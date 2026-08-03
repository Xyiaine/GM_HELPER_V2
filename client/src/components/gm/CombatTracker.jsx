import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../store/gmStore';
import {
  Swords,
  Shield,
  Heart,
  Square,
  FastForward,
  Plus,
  Eye,
  EyeOff,
  UserCheck,
  Truck,
  Skull,
  User,
  CheckCircle2,
  Trash2,
  ChevronRight,
} from 'lucide-react';

const CONDITIONS_DND5E = [
  'Aveuglé',
  'Charmé',
  'Assourdi',
  'Effrayé',
  'Agrippé',
  'Incapable d\'agir',
  'Invisible',
  'Paralysé',
  'Pétrifié',
  'Empoisonné',
  'À terre',
  'Entravé',
  'Étourdi',
  'Inconscient',
];

export default function CombatTracker() {
  const {
    activeCampaignId,
    encounters = [],
    activeEncounter,
    characters = [],
    npcs = [],
    bestiary = [],
    vehicles = [],
    fetchEncounters,
    fetchEncounterDetail,
    createEncounter,
    addCombatantsBulk,
    updateCombatantInCombat,
    removeCombatantInCombat,
    startSurpriseCheck,
    startInitiativeEntry,
    startCombat,
    nextTurnInCombat,
    endCombat,
    fetchCharacters,
    fetchNpcs,
    fetchBestiary,
    fetchVehicles,
  } = useGmStore();

  const [selectedEncounterId, setSelectedEncounterId] = useState(null);
  const [newEncounterName, setNewEncounterName] = useState('');
  const [isCreatingEncounter, setIsCreatingEncounter] = useState(false);

  // Participant selection state for Phase 1
  const [selectedSourceType, setSelectedSourceType] = useState('character');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [bulkCount, setBulkCount] = useState(1);
  const [manualName, setManualName] = useState('');
  const [manualAc, setManualAc] = useState(10);
  const [manualHp, setManualHp] = useState(10);

  // Surprise state for Phase 2
  const [surpriseMap, setSurpriseMap] = useState({});

  // Initiative state for Phase 3
  const [initiativeMap, setInitiativeMap] = useState({});

  // Load prerequisites
  useEffect(() => {
    if (activeCampaignId) {
      fetchEncounters(activeCampaignId);
      fetchCharacters(activeCampaignId);
      fetchNpcs(activeCampaignId);
      fetchBestiary(activeCampaignId);
      fetchVehicles(activeCampaignId);
    }
  }, [activeCampaignId, fetchEncounters, fetchCharacters, fetchNpcs, fetchBestiary, fetchVehicles]);

  // Select active or first encounter when list loads
  useEffect(() => {
    const list = encounters || [];
    if (list.length > 0 && !selectedEncounterId) {
      const active = list.find((e) => e.status === 'active' || e.phase === 'active' || e.status === 'planned');
      const targetId = active ? active.id : list[0].id;
      setSelectedEncounterId(targetId);
      fetchEncounterDetail(activeCampaignId, targetId);
    }
  }, [encounters, selectedEncounterId, activeCampaignId, fetchEncounterDetail]);

  const handleSelectEncounter = (id) => {
    setSelectedEncounterId(id);
    if (id) {
      fetchEncounterDetail(activeCampaignId, id);
    }
  };

  const handleCreateNewEncounter = async (e) => {
    if (e) e.preventDefault();
    if (!newEncounterName.trim()) return;
    try {
      const created = await createEncounter(activeCampaignId, {
        name: newEncounterName.trim(),
        phase: 'planned',
        status: 'planned',
      });
      setIsCreatingEncounter(false);
      setNewEncounterName('');
      if (created?.encounter?.id) {
        setSelectedEncounterId(created.encounter.id);
        fetchEncounterDetail(activeCampaignId, created.encounter.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddParticipant = async () => {
    if (!activeEncounter) return;
    try {
      let payloadItem = {
        sourceType: selectedSourceType,
        sourceId: selectedSourceId,
        count: bulkCount,
      };

      if (selectedSourceType === 'manual') {
        payloadItem = {
          sourceType: 'manual',
          name: manualName || 'Combattant Manuel',
          armorClass: manualAc,
          hpMax: manualHp,
          count: bulkCount,
        };
      }

      await addCombatantsBulk(activeCampaignId, activeEncounter.id, [payloadItem]);
      setSelectedSourceId('');
      setManualName('');
    } catch (err) {
      console.error('Failed to add combatant:', err);
    }
  };

  const handleRemoveCombatant = async (combatantId) => {
    if (!activeEncounter) return;
    await removeCombatantInCombat(activeCampaignId, activeEncounter.id, combatantId);
  };

  const handleSaveSurpriseAndProceed = async () => {
    if (!activeEncounter) return;
    for (const c of activeEncounter.combatants || []) {
      const isSurprised = !!surpriseMap[c.id];
      if (isSurprised !== c.isSurprised) {
        await updateCombatantInCombat(activeCampaignId, activeEncounter.id, c.id, { isSurprised });
      }
    }
    await startInitiativeEntry(activeCampaignId, activeEncounter.id);
  };

  const handleSaveInitiativeAndStartCombat = async () => {
    if (!activeEncounter) return;
    for (const c of activeEncounter.combatants || []) {
      const initVal = initiativeMap[c.id] !== undefined ? parseInt(initiativeMap[c.id], 10) : c.initiative;
      if (initVal !== c.initiative) {
        await updateCombatantInCombat(activeCampaignId, activeEncounter.id, c.id, { initiative: initVal });
      }
    }
    await startCombat(activeCampaignId, activeEncounter.id);
  };

  const handleHpDelta = async (combatant, delta) => {
    if (!activeEncounter) return;
    const newHp = Math.max(0, combatant.hpCurrent + delta);
    await updateCombatantInCombat(activeCampaignId, activeEncounter.id, combatant.id, { hpCurrent: newHp });
  };

  const handleToggleCondition = async (combatant, conditionName) => {
    if (!activeEncounter) return;
    let currentConds = [];
    try {
      currentConds = JSON.parse(combatant.conditions || '[]');
    } catch (e) {
      currentConds = [];
    }

    if (currentConds.includes(conditionName)) {
      currentConds = currentConds.filter((c) => c !== conditionName);
    } else {
      currentConds.push(conditionName);
    }

    await updateCombatantInCombat(activeCampaignId, activeEncounter.id, combatant.id, {
      conditions: JSON.stringify(currentConds),
    });
  };

  const handleToggleVisibility = async (combatant) => {
    if (!activeEncounter) return;
    await updateCombatantInCombat(activeCampaignId, activeEncounter.id, combatant.id, {
      isVisibleToPlayers: !combatant.isVisibleToPlayers,
    });
  };

  const renderTypeIcon = (type, sourceType) => {
    if (sourceType === 'vehicle' || type === 'vehicle') return <Truck size={16} color="#3b82f6" />;
    if (sourceType === 'character' || type === 'character') return <User size={16} color="#10b981" />;
    if (sourceType === 'npc' || type === 'npc') return <UserCheck size={16} color="#f59e0b" />;
    return <Skull size={16} color="#ef4444" />;
  };

  const encountersList = encounters || [];
  const currentPhase = activeEncounter ? (activeEncounter.phase || activeEncounter.status || 'planned') : 'planned';

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Encounter Selector */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Swords size={28} /> Combat & Rencontres D&D 5e
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            Tracker de combat temps réel synchronisé MJ / Écran TV / Joueurs.
          </p>
        </div>

        {/* Encounter selector dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedEncounterId || ''}
            onChange={(e) => handleSelectEncounter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontSize: '0.95rem',
            }}
          >
            {encountersList.length === 0 && <option value="">Aucune rencontre enregistrée</option>}
            {encountersList.map((enc) => {
              const pStr = (enc.phase || enc.status || 'planned').toUpperCase();
              const count = enc._count?.combatants || enc.combatants?.length || 0;
              return (
                <option key={enc.id} value={enc.id}>
                  {enc.name} [{pStr}] ({count} combattants)
                </option>
              );
            })}
          </select>

          <button
            className="btn-primary"
            onClick={() => setIsCreatingEncounter(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Créer une Rencontre
          </button>
        </div>
      </header>

      {/* Modal create encounter */}
      {isCreatingEncounter && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-border)', width: '420px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>Créer une Rencontre de Zéro</h3>
            <form onSubmit={handleCreateNewEncounter} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>Nom de la rencontre *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Embuscade dans les ruines, Attaque de Convoi..."
                  value={newEncounterName}
                  onChange={(e) => setNewEncounterName(e.target.value)}
                  autoFocus
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsCreatingEncounter(false)} style={{ padding: '8px 16px', background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '6px', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                  Créer et Configurer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!activeEncounter ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '8px',
            border: '1px dashed var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Swords size={56} color="var(--color-text-muted)" style={{ opacity: 0.4 }} />
          <div>
            <h3 style={{ margin: '0 0 6px 0', color: 'var(--color-text)' }}>Aucun combat sélectionné</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.95rem' }}>
              Vous n'avez pas de combat actif actuellement. Vous pouvez créer un nouveau combat de zéro pour choisir vos combattants.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setIsCreatingEncounter(true)}
            style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}
          >
            <Plus size={20} /> ⚔️ Créer un Combat de Zéro
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Phase Progress Stepper */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            {[
              { id: 'planned', label: '1. Préparation' },
              { id: 'surprise_check', label: '2. Surprise' },
              { id: 'initiative_entry', label: '3. Initiative' },
              { id: 'active', label: '4. Combat Actif' },
              { id: 'completed', label: '5. Résolution' },
            ].map((step, idx) => {
              const isActive = currentPhase === step.id;
              return (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 'bold' : 'normal',
                    backgroundColor: isActive ? 'rgba(var(--color-primary-rgb, 120, 80, 255), 0.25)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    borderRight: idx < 4 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  {step.label}
                </div>
              );
            })}
          </div>

          {/* PHASE 1: PREPARATION */}
          {currentPhase === 'planned' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>1. Sélection des Participants</h3>

                {/* Form to add combatants */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 100px auto', gap: '12px', alignItems: 'end', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Type de source</label>
                    <select
                      value={selectedSourceType}
                      onChange={(e) => {
                        setSelectedSourceType(e.target.value);
                        setSelectedSourceId('');
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                    >
                      <option value="character">Personnage Joueur (PJ)</option>
                      <option value="npc">PNJ de Campagne</option>
                      <option value="bestiary">Monstre du Bestiaire</option>
                      <option value="vehicle">Véhicule (avec Équipage)</option>
                      <option value="manual">Ajout Manuel Libre</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Sélectionner l'entité</label>
                    {selectedSourceType === 'character' && (
                      <select
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                      >
                        <option value="">-- Choisir un PJ --</option>
                        {(characters || []).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Niv {c.level} {c.class || ''})
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedSourceType === 'npc' && (
                      <select
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                      >
                        <option value="">-- Choisir un PNJ --</option>
                        {(npcs || []).map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.name} ({n.role || 'PNJ'})
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedSourceType === 'bestiary' && (
                      <select
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                      >
                        <option value="">-- Choisir dans le Bestiaire --</option>
                        {(bestiary || []).map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} [CA {b.armorClass} • PV {b.hpMax}]
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedSourceType === 'vehicle' && (
                      <select
                        value={selectedSourceId}
                        onChange={(e) => setSelectedSourceId(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                      >
                        <option value="">-- Choisir un Véhicule --</option>
                        {(vehicles || []).map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.modelType || 'Véhicule'}) [CA {v.acBase} • PV {v.hpCurrent}/{v.hpMaxBase}]
                          </option>
                        ))}
                      </select>
                    )}

                    {selectedSourceType === 'manual' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Nom"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                        />
                        <input
                          type="number"
                          placeholder="CA"
                          title="Classe d'Armure"
                          value={manualAc}
                          onChange={(e) => setManualAc(parseInt(e.target.value, 10) || 10)}
                          style={{ width: '60px', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                        />
                        <input
                          type="number"
                          placeholder="PV"
                          title="PV Max"
                          value={manualHp}
                          onChange={(e) => setManualHp(parseInt(e.target.value, 10) || 10)}
                          style={{ width: '70px', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Quantité</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value, 10) || 1)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
                    />
                  </div>

                  <button className="btn-primary" onClick={handleAddParticipant} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Ajouter
                  </button>
                </div>

                {/* List of current combatants */}
                <h4 style={{ margin: '16px 0 8px 0', color: 'var(--color-text)' }}>
                  Combattants dans la rencontre ({(activeEncounter.combatants || []).length})
                </h4>

                {(activeEncounter.combatants || []).length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Aucun combattant ajouté pour l'instant. Utilisez le formulaire ci-dessus pour ajouter des PJ, PNJ, monstres ou véhicules.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(activeEncounter.combatants || []).map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--color-background)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {renderTypeIcon(c.type, c.sourceType)}
                          <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            🛡️ CA {c.armorClass} • ❤️ {c.hpCurrent}/{c.hpMax} PV
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => handleToggleVisibility(c)}
                            title={c.isVisibleToPlayers ? 'Visible des joueurs (TV)' : 'Masqué des joueurs (MJ uniquement)'}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: c.isVisibleToPlayers ? '#10b981' : 'var(--color-text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                            }}
                          >
                            {c.isVisibleToPlayers ? <Eye size={16} /> : <EyeOff size={16} />}
                            {c.isVisibleToPlayers ? 'Public' : 'Masqué MJ'}
                          </button>

                          <button
                            onClick={() => handleRemoveCombatant(c.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons to proceed */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => startSurpriseCheck(activeCampaignId, activeEncounter.id)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                  }}
                >
                  🎭 Passer à la phase de Surprise
                </button>
                <button
                  className="btn-primary"
                  onClick={() => startInitiativeEntry(activeCampaignId, activeEncounter.id)}
                  style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  🎲 Saisir l'Initiative <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: SURPRISE CHECK */}
          {currentPhase === 'surprise_check' && (
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>2. Phase de Surprise</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Cochez les combattants qui sont **surpris** (déterminé sur table via Discrétion vs Perception). Un combattant surpris n'agit pas au round 1.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
                {(activeEncounter.combatants || []).map((c) => {
                  const isChecked = surpriseMap[c.id] !== undefined ? surpriseMap[c.id] : c.isSurprised;
                  return (
                    <label
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '12px',
                        borderRadius: '6px',
                        backgroundColor: isChecked ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-background)',
                        border: isChecked ? '1px solid #ef4444' : '1px solid var(--color-border)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {renderTypeIcon(c.type, c.sourceType)}
                        <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isChecked && <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>SURPRIS</span>}
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setSurpriseMap({ ...surpriseMap, [c.id]: e.target.checked })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  className="btn-primary"
                  onClick={handleSaveSurpriseAndProceed}
                  style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Valider la Surprise & Saisir l'Initiative <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 3: INITIATIVE ENTRY */}
          {currentPhase === 'initiative_entry' && (
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>3. Saisie de l'Initiative</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Saisissez les résultats de jets d'initiative obtenus physiquement sur table par chaque combattant.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
                {(activeEncounter.combatants || []).map((c) => {
                  const initVal = initiativeMap[c.id] !== undefined ? initiativeMap[c.id] : c.initiative;
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {renderTypeIcon(c.type, c.sourceType)}
                        <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                        {c.isSurprised && <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>(Surpris)</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Initiative :</span>
                        <input
                          type="number"
                          value={initVal}
                          onChange={(e) => setInitiativeMap({ ...initiativeMap, [c.id]: e.target.value })}
                          style={{
                            width: '70px',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            fontWeight: 'bold',
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  className="btn-primary"
                  onClick={handleSaveInitiativeAndStartCombat}
                  style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                >
                  <Swords size={20} /> ⚔️ DÉBUTER LE COMBAT
                </button>
              </div>
            </div>
          )}

          {/* PHASE 4: ACTIVE COMBAT TRACKER */}
          {currentPhase === 'active' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Combat Bar Header */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-primary)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(120, 80, 255, 0.2)',
                }}
              >
                <div>
                  <h2 style={{ margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ⚔️ COMBAT EN COURS — Round {activeEncounter.currentRound}
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Combattant actif : {activeEncounter.combatants?.[activeEncounter.currentTurnIndex]?.name || 'N/A'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => nextTurnInCombat(activeCampaignId, activeEncounter.id)}
                    className="btn-primary"
                    style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    Tour Suivant <FastForward size={18} />
                  </button>
                  <button
                    onClick={() => endCombat(activeCampaignId, activeEncounter.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Square size={16} /> Terminer le Combat
                  </button>
                </div>
              </div>

              {/* Combatants Turn List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(activeEncounter.combatants || []).map((c, index) => {
                  const isActiveTurn = index === activeEncounter.currentTurnIndex;
                  const isDowned = c.hpCurrent <= 0;
                  let parsedConditions = [];
                  try {
                    parsedConditions = JSON.parse(c.conditions || '[]');
                  } catch (e) {
                    parsedConditions = [];
                  }

                  return (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: isActiveTurn ? 'rgba(var(--color-primary-rgb, 120, 80, 255), 0.15)' : 'var(--color-surface)',
                        border: isActiveTurn ? '2px solid var(--color-primary)' : isDowned ? '1px solid #ef4444' : '1px solid var(--color-border)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Main Combatant Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        {/* Name & Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', color: isActiveTurn ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            #{index + 1}
                          </span>
                          {renderTypeIcon(c.type, c.sourceType)}
                          <div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: isDowned ? '#ef4444' : 'var(--color-text)' }}>
                              {c.name}
                            </span>
                            {c.isSurprised && activeEncounter.currentRound === 1 && (
                              <span style={{ marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                SURPRIS (Tour passé)
                              </span>
                            )}
                            {isDowned && (
                              <span style={{ marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                À TERRE / K.O.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Initiative & AC & HP Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {/* Initiative */}
                          <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Init</span>
                            <strong>{c.initiative}</strong>
                          </div>

                          {/* Armor Class (GM only visible) */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              fontWeight: 'bold',
                            }}
                          >
                            <Shield size={16} /> CA {c.armorClass}
                          </div>

                          {/* HP Adjustment Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-background)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Heart size={18} color={isDowned ? '#ef4444' : '#f87171'} />
                            <span style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'center' }}>
                              {c.hpCurrent} / {c.hpMax}
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleHpDelta(c, -5)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>-5</button>
                              <button onClick={() => handleHpDelta(c, -1)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>-1</button>
                              <button onClick={() => handleHpDelta(c, +1)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>+1</button>
                              <button onClick={() => handleHpDelta(c, +5)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text)', cursor: 'pointer' }}>+5</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conditions Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Conditions D&D 5e :</span>
                        {CONDITIONS_DND5E.map((cond) => {
                          const hasCond = parsedConditions.includes(cond);
                          return (
                            <button
                              key={cond}
                              onClick={() => handleToggleCondition(c, cond)}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                border: hasCond ? '1px solid #f59e0b' : '1px solid var(--color-border)',
                                backgroundColor: hasCond ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                                color: hasCond ? '#f59e0b' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                              }}
                            >
                              {cond}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PHASE 5: COMPLETED SUMMARY */}
          {currentPhase === 'completed' && (
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="#10b981" /> Combat Terminé — Résumé
              </h2>

              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Durée totale du combat : <strong>{activeEncounter.currentRound} rounds</strong>
              </p>

              <h4 style={{ margin: '12px 0 4px 0' }}>Bilan des combattants</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(activeEncounter.combatants || []).map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '4px', backgroundColor: 'var(--color-background)' }}>
                    <span>{c.name}</span>
                    <span style={{ color: c.hpCurrent <= 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                      {c.hpCurrent <= 0 ? 'K.O. / Tombé (0 PV)' : `${c.hpCurrent}/${c.hpMax} PV`}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  className="btn-primary"
                  onClick={() => setIsCreatingEncounter(true)}
                  style={{ padding: '8px 16px' }}
                >
                  Nouveau Combat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
