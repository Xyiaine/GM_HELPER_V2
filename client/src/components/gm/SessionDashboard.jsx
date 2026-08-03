import React, { useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import api from '../../utils/api';
import ThreatClockWidget from './ThreatClockWidget';
import FactionTracker from './FactionTracker';
import NpcVoiceProfileCard from './NpcVoiceProfileCard';
import { X, Dices, Search, Users, HelpCircle, Compass, Radio, CheckCircle, Shield, FileText, CheckSquare, Layers } from 'lucide-react';

export default function SessionDashboard({ quest, campaignId, onClose }) {
  const { drawRandomEvent, drawScenePool, auditQuestIntegrity, convertRules } = useGmStore();
  const [drawnEvent, setDrawnEvent] = useState(null);
  const [checkedLeads, setCheckedLeads] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'npc' | 'leads' | 'pool' | 'debrief' | 'missions'
  const [ruleSystem, setRuleSystem] = useState('dnd5e'); // 'dnd5e' | 'generic' (FE-11)
  const [scenePoolState, setScenePoolState] = useState(null);
  const [auditReport, setAuditReport] = useState(null);

  let mechanicNotes = {};
  try {
    mechanicNotes = quest.mechanicNotes || {};
  } catch (e) {}

  let tableCalibration = {};
  try {
    tableCalibration = typeof mechanicNotes.tableCalibration === 'string'
      ? JSON.parse(mechanicNotes.tableCalibration)
      : (mechanicNotes.tableCalibration || {});
  } catch (e) {}

  let debriefQuestions = [];
  try {
    const debrief = typeof mechanicNotes.postSessionDebrief === 'string'
      ? JSON.parse(mechanicNotes.postSessionDebrief)
      : (mechanicNotes.postSessionDebrief || {});
    debriefQuestions = debrief.questions || [];
  } catch (e) {}

  const handleRollD8 = async () => {
    try {
      const res = await drawRandomEvent(campaignId, quest.id);
      setDrawnEvent(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawScenePool = async () => {
    try {
      const res = await drawScenePool(campaignId, quest.id);
      setScenePoolState(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAudit = async () => {
    try {
      const res = await auditQuestIntegrity(campaignId, quest.id);
      setAuditReport(res.report);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLead = (leadIdx) => {
    setCheckedLeads(prev => ({ ...prev, [leadIdx]: !prev[leadIdx] }));
  };

  const handleBroadcastClue = async (leadObj) => {
    try {
      await api.post(`/api/v1/gm/campaigns/${campaignId}/spotlight`, {
        contentType: 'banner',
        text: `🔍 PISTE D'ENQUÊTE RÉVÉLÉE : ${leadObj.lead}\n\n💡 Indice : ${leadObj.reveals}`
      });
      alert('Indice diffusé sur le Spotlight des joueurs !');
    } catch (err) {
      console.error(err);
    }
  };

  // Find objective with investigation leads
  const objIncident = quest.objectives?.find(o => o.investigationLeads);
  let leads = [];
  try {
    leads = objIncident?.investigationLeads
      ? (typeof objIncident.investigationLeads === 'string' ? JSON.parse(objIncident.investigationLeads) : objIncident.investigationLeads)
      : [];
  } catch (e) {}

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '450px',
      backgroundColor: 'var(--color-surface)',
      borderLeft: '1px solid var(--color-border)',
      boxShadow: '-6px 0 25px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-background)'
      }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-primary-light)', fontSize: '1.1rem' }}>
            📊 Tableau de Bord — Session
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {quest.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* FE-11: Ruleset System Switcher */}
          <button
            onClick={() => setRuleSystem(ruleSystem === 'dnd5e' ? 'generic' : 'dnd5e')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              backgroundColor: ruleSystem === 'dnd5e' ? 'rgba(99, 102, 241, 0.2)' : '#222',
              color: ruleSystem === 'dnd5e' ? '#a5b4fc' : '#aaa',
              cursor: 'pointer'
            }}
            title="FE-11: Bascule d'affichage des règles (DD 5e / Générique)"
          >
            {ruleSystem === 'dnd5e' ? '🎲 DD 5e' : '⚙️ Générique'}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.2)', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '0.75rem',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'overview' ? 'bold' : 'normal',
            borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          En jeu
        </button>
        <button
          onClick={() => setActiveTab('npc')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '0.75rem',
            border: 'none',
            background: activeTab === 'npc' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'npc' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'npc' ? 'bold' : 'normal',
            borderBottom: activeTab === 'npc' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          PNJ ({quest.npcProfiles?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '0.75rem',
            border: 'none',
            background: activeTab === 'leads' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'leads' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'leads' ? 'bold' : 'normal',
            borderBottom: activeTab === 'leads' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Enquête ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('pool')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '0.75rem',
            border: 'none',
            background: activeTab === 'pool' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'pool' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'pool' ? 'bold' : 'normal',
            borderBottom: activeTab === 'pool' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Pool Scènes
        </button>
        <button
          onClick={() => setActiveTab('debrief')}
          style={{
            flex: 1,
            padding: '10px 4px',
            fontSize: '0.75rem',
            border: 'none',
            background: activeTab === 'debrief' ? 'var(--color-surface)' : 'transparent',
            color: activeTab === 'debrief' ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'debrief' ? 'bold' : 'normal',
            borderBottom: activeTab === 'debrief' ? '2px solid var(--color-primary)' : 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Débrief
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {activeTab === 'overview' && (
          <>
            {/* Threat Trackers (FE-2 Widget) */}
            {quest.threats && quest.threats.length > 0 ? (
              quest.threats.map(threat => (
                <ThreatClockWidget key={threat.id} threat={threat} campaignId={campaignId} questId={quest.id} />
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Aucune horloge de menace active.</div>
            )}

            {/* Faction Tracker (FE-3 Tracker) */}
            <FactionTracker factions={quest.factionProgress} campaignId={campaignId} questId={quest.id} />

            {/* Random Event Draw Button d8 (FE-5) */}
            <div style={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
                <Dices size={16} color="#a78bfa" />
                Tirage d'Événement Aléatoire (d8)
              </h4>
              <button
                className="btn-primary"
                onClick={handleRollD8}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px' }}
              >
                <Dices size={18} /> Lancer le d8
              </button>
              {drawnEvent && (
                <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid #8b5cf6', borderRadius: '4px', padding: '10px', fontSize: '0.85rem' }}>
                  <strong>Résultat Dé : {drawnEvent.roll}</strong> → {drawnEvent.result}
                </div>
              )}
            </div>

            {/* Audit Intégrité (BE-7) */}
            <div style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={14} /> Audit Intégrité Référentielle
                </strong>
                <button className="btn-secondary" onClick={handleRunAudit} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                  Lancer l'audit
                </button>
              </div>
              {auditReport && (
                <div style={{ marginTop: '8px', padding: '8px', borderRadius: '4px', backgroundColor: auditReport.isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                  <span style={{ color: auditReport.isValid ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {auditReport.isValid ? '✅ Graphe 100% Valide' : '⚠️ Anomalies détectées'}
                  </span>
                  {auditReport.errors?.map((err, idx) => (
                    <div key={idx} style={{ color: '#ef4444', marginTop: '4px', fontSize: '0.75rem' }}>❌ {err}</div>
                  ))}
                  {auditReport.warnings?.map((warn, idx) => (
                    <div key={idx} style={{ color: '#f59e0b', marginTop: '4px', fontSize: '0.75rem' }}>⚠️ {warn}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Table Calibration */}
            {tableCalibration.sessionBudget && (
              <div style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '0.8rem' }}>
                <strong style={{ color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Compass size={14} /> Calibrage de Table ({tableCalibration.playerCount || 8} joueurs)
                </strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)' }}>
                  Budget : {tableCalibration.sessionBudget}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'npc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {quest.npcProfiles && quest.npcProfiles.length > 0 ? (
              quest.npcProfiles.map(prof => (
                <NpcVoiceProfileCard key={prof.id} profile={prof} />
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Aucun profil de PNJ disponible.</div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <Search size={16} color="#38bdf8" />
              Pistes d'Enquête (FE-12)
            </h4>
            {leads.length > 0 ? (
              leads.map((leadObj, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', color: '#38bdf8' }}>
                      <input
                        type="checkbox"
                        checked={!!checkedLeads[idx]}
                        onChange={() => toggleLead(idx)}
                      />
                      {leadObj.lead}
                    </label>
                    <button
                      className="btn-secondary"
                      onClick={() => handleBroadcastClue(leadObj)}
                      style={{ padding: '2px 6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Diffuser cette piste sur l'écran Spotlight de la table"
                    >
                      <Radio size={12} color="#10b981" /> Spotlight
                    </button>
                  </div>
                  {checkedLeads[idx] && (
                    <div style={{ fontSize: '0.8rem', color: '#e0f2fe', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '4px', marginTop: '4px' }}>
                      💡 <strong>Révélation :</strong> {leadObj.reveals}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Aucune piste d'enquête configurée.</div>
            )}
          </div>
        )}

        {activeTab === 'pool' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <Layers size={16} color="#10b981" />
              Pool de Scènes (BE-5)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Tirez aléatoirement 3 scènes parmi le pool disponible pour construire le parcours unique de cette partie :
            </p>
            <button
              className="btn-primary"
              onClick={handleDrawScenePool}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#10b981', color: 'black' }}
            >
              🎲 Tirer une Scène du Pool
            </button>
            {scenePoolState && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '6px', padding: '12px', fontSize: '0.85rem' }}>
                {scenePoolState.completed ? (
                  <strong style={{ color: '#10b981' }}>🏁 Pool complet ! Allez au nœud de clôture.</strong>
                ) : (
                  <>
                    <strong style={{ color: '#10b981' }}>Scène Tirée : {scenePoolState.selectedNode?.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '4px' }}>
                      Progression Pool : {scenePoolState.drawnCount} / {scenePoolState.requiredCount} scènes
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'debrief' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <HelpCircle size={16} color="#f59e0b" />
              Tour de Table Post-Session (FE-9)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
              5 à 10 minutes hors fiction pour recueillir le ressenti des joueurs et alimenter leurs futures missions secrètes :
            </p>
            {debriefQuestions.map((q, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px', fontSize: '0.85rem', color: '#fef3c7' }}>
                <strong>{idx + 1}.</strong> {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

