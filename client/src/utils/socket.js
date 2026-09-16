import { io } from 'socket.io-client';

// Single socket instance for the whole app. Socket.IO keeps one connection per
// client, and several components need to listen on it at the same time
// (LiveSession, PlayerMapView, ConvoyDashboard, the GM session manager...).
//
// Before, every component called `socket.connect()` and `socket.disconnect()` in
// its own effect cleanup. Navigating between tabs therefore tore down the
// connection that other mounted components were still using, and each component
// overwrote `socket.auth` with its own credentials.
//
// `acquireSocket` hands out a reference-counted lease instead: the connection is
// established on the first acquire and closed only when the last holder releases
// it. Changing credentials while connected forces a clean reconnect.
const socket = io('/', {
  autoConnect: false,
});

let holders = 0;
let currentAuthKey = null;
let pendingDisconnect = null;

// When a component re-runs its effect (dependency change), React releases the
// previous lease *before* acquiring the new one. Without a grace period the
// counter would hit zero and the connection would be torn down and rebuilt on
// every dependency change. The disconnect is therefore deferred briefly and
// cancelled if the socket is re-acquired in the meantime.
const DISCONNECT_GRACE_MS = 300;

function cancelPendingDisconnect() {
  if (pendingDisconnect !== null) {
    clearTimeout(pendingDisconnect);
    pendingDisconnect = null;
  }
}

function scheduleDisconnect() {
  cancelPendingDisconnect();
  pendingDisconnect = setTimeout(() => {
    pendingDisconnect = null;
    if (holders === 0) {
      socket.disconnect();
    }
  }, DISCONNECT_GRACE_MS);
}

function authKeyOf(auth) {
  try {
    return JSON.stringify(auth || {});
  } catch (e) {
    return null;
  }
}

/**
 * Acquire the shared socket connection.
 *
 * @param {object} auth Credentials passed to the server handshake
 *                      (e.g. `{ token }` or `{ token, isTableScreen: true }`).
 * @returns {() => void} Release function. Call it from the effect cleanup.
 */
export function acquireSocket(auth = {}) {
  const key = authKeyOf(auth);

  cancelPendingDisconnect();

  // Credentials changed while someone was still connected: the handshake can
  // only be sent once per connection, so start a fresh one.
  if (holders > 0 && key !== currentAuthKey) {
    socket.disconnect();
    holders = 0;
  }

  currentAuthKey = key;
  socket.auth = auth;
  holders += 1;

  if (!socket.connected) {
    socket.connect();
  }

  let released = false;
  return function releaseSocket() {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
    if (holders === 0) {
      scheduleDisconnect();
    }
  };
}

/**
 * Join the campaign room. Everything the table shares travels through it:
 * session messages, spotlight, quest timers, convoys, encounters, map reveals.
 * Without it a client connects successfully and silently receives nothing.
 */
export function joinCampaignRoom(campaignId) {
  if (!campaignId) return;
  socket.emit('join_campaign', { campaignId });
}

export function leaveCampaignRoom(campaignId) {
  if (!campaignId) return;
  socket.emit('leave_campaign', { campaignId });
}

/**
 * Join the campaign room now, and again after every reconnection.
 *
 * Rooms live on the server, tied to a connection. A client that drops and
 * reconnects comes back to no room at all and silently stops receiving events,
 * which looks exactly like a broken feature. Always use this rather than a bare
 * `joinCampaignRoom` call from a component.
 *
 * @returns {() => void} Cleanup that stops the automatic re-join.
 */
export function autoJoinCampaignRoom(campaignId) {
  if (!campaignId) return () => {};
  const rejoin = () => joinCampaignRoom(campaignId);
  rejoin();
  socket.on('connect', rejoin);
  return () => socket.off('connect', rejoin);
}

export default socket;
