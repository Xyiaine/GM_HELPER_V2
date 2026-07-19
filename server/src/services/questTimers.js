const activeTimers = new Map();

function startNodeTimer(prisma, io, campaignId, questId, nodeId, durationSeconds, onTimeout) {
  cancelNodeTimer(nodeId); // Clear existing if any

  const timer = setTimeout(async () => {
    activeTimers.delete(nodeId);
    if (onTimeout) {
      await onTimeout(prisma, io, campaignId, questId, nodeId);
    }
  }, durationSeconds * 1000);

  activeTimers.set(nodeId, timer);
}

function cancelNodeTimer(nodeId) {
  if (activeTimers.has(nodeId)) {
    clearTimeout(activeTimers.get(nodeId));
    activeTimers.delete(nodeId);
  }
}

async function handleNodeTimeout(prisma, io, campaignId, questId, nodeId) {
  try {
    const node = await prisma.questNode.findUnique({
      where: { id: nodeId },
    });
    
    if (!node || !node.timeoutNodeId) return;

    // Reach the timeout node
    const consequenceNode = await prisma.questNode.update({
      where: { id: node.timeoutNodeId },
      data: { status: 'reached', reachedAt: new Date() },
    });

    if (io) {
      io.to(`campaign:${campaignId}:gm`).emit('quest_node_timeout', {
        questId,
        nodeId: node.id,
        consequenceNodeId: consequenceNode.id,
      });
      
      if (consequenceNode.sensoryText) {
        io.to(`campaign:${campaignId}:gm`).emit('quest_node_reached', {
          questId,
          nodeId: consequenceNode.id,
          sensoryText: consequenceNode.sensoryText,
        });
      }
      
      if (node.timerVisibleToPlayers) {
        const session = await prisma.session.findFirst({
          where: { campaignId, status: 'live' }
        });
        io.to(`campaign:${campaignId}:player`).emit('quest_node_timer_cleared', { nodeId: node.id });
        if (session && session.mode === 'in_person' && session.tableScreenToken) {
          io.to(`table_screen:${session.tableScreenToken}`).emit('quest_node_timer_cleared', { nodeId: node.id });
        }
      }
    }

    // If consequence node is also timed, start its timer
    if (consequenceNode.isTimed && consequenceNode.timerDurationSeconds) {
      startNodeTimer(prisma, io, campaignId, questId, consequenceNode.id, consequenceNode.timerDurationSeconds, handleNodeTimeout);
    }

    // Check if consequence node is "end" node
    if (consequenceNode.nodeType === 'end' && consequenceNode.endOutcome) {
      const outcome = consequenceNode.endOutcome;
      // We'd ideally call the same logic as the resolve endpoint here.
      // For now, update quest status
      await prisma.quest.update({
        where: { id: questId },
        data: { status: outcome === 'success' ? 'completed' : outcome === 'failure' ? 'failed' : 'abandoned' },
      });
    }
  } catch (err) {
    console.error('Error handling node timeout:', err);
  }
}

async function restoreTimersFromDB(prisma, io) {
  try {
    const reachedTimedNodes = await prisma.questNode.findMany({
      where: {
        status: 'reached',
        isTimed: true,
        timeoutNodeId: { not: null },
      },
      include: {
        quest: { select: { campaignId: true, status: true } },
      }
    });

    const now = new Date();

    for (const node of reachedTimedNodes) {
      // Ignore if quest is no longer active
      if (node.quest.status === 'completed' || node.quest.status === 'failed' || node.quest.status === 'abandoned') {
        continue;
      }

      if (node.reachedAt && node.timerDurationSeconds) {
        const expirationTime = new Date(node.reachedAt.getTime() + node.timerDurationSeconds * 1000);
        const timeRemainingMs = expirationTime.getTime() - now.getTime();

        // Check if consequence is already reached (to avoid re-triggering)
        const consequenceNode = await prisma.questNode.findUnique({
          where: { id: node.timeoutNodeId },
        });

        if (consequenceNode && consequenceNode.status === 'not_reached') {
          if (timeRemainingMs > 0) {
            // Restart timer
            startNodeTimer(prisma, io, node.quest.campaignId, node.questId, node.id, Math.ceil(timeRemainingMs / 1000), handleNodeTimeout);
          } else {
            // Time expired while server was offline, trigger immediately
            await handleNodeTimeout(prisma, io, node.quest.campaignId, node.questId, node.id);
          }
        }
      }
    }
    console.log(`Restored ${activeTimers.size} quest node timers`);
  } catch (err) {
    console.error('Error restoring quest timers:', err);
  }
}

async function cancelParentTimers(prisma, nodeId) {
  try {
    const incomingConnections = await prisma.questNodeConnection.findMany({
      where: { toNodeId: nodeId },
      include: { fromNode: true }
    });
    
    for (const conn of incomingConnections) {
      if (conn.fromNode.isTimed && conn.fromNode.status === 'reached') {
        cancelNodeTimer(conn.fromNode.id);
      }
    }
  } catch (err) {
    console.error('Error canceling parent timers:', err);
  }
}

module.exports = {
  startNodeTimer,
  cancelNodeTimer,
  restoreTimersFromDB,
  handleNodeTimeout,
  cancelParentTimers,
};
