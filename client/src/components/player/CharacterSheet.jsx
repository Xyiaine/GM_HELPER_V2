import React, { useEffect, useState, useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import api from '../../utils/api';
import {
  Heart, Shield, Zap, Book, Backpack, AlertCircle, Network, User,
  Activity, Check, Swords, Plus, Trash2, RotateCcw, Sparkles,
  Lock, Flame, Coins, Eye, Maximize2, Loader
} from 'lucide-react';
import SkillTreeViewer from '../gm/SkillTreeViewer';
import { formatClasses } from '../../utils/formatters';
import {
  SKILLS_LIST,
  ABILITIES_LIST,
  getModifier,
  formatModifier,
  calculateInvestedPoints,
  getProficiencyBonus,
  calculateCarryCapacity,
  calculateTotalWeight,
  parseCurrency,
  parseAttacks,
  parseDeathSaves,
  parseHitDice,
  parseRoleplayTraits
} from './characterUtils';
import './CharacterSheet.css';

export default function CharacterSheet({ campaignId, characterData, isGm, onUpdate }) {
  const playerStore = usePlayerStore();
  const [activeTab, setActiveTab] = useState('combat'); // Default on combat or stats
  const [showSkillTreeModal, setShowSkillTreeModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  // Add Item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('weapon');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Add Attack form state
  const [isAddingAttack, setIsAddingAttack] = useState(false);
  const [newAtkName, setNewAtkName] = useState('');
  const [newAtkAbility, setNewAtkAbility] = useState('strength');
  const [newAtkDamage, setNewAtkDamage] = useState('1d8');
  const [newAtkDamageType, setNewAtkDamageType] = useState('tranchant');
  const [newAtkRange, setNewAtkRange] = useState('Corps à corps');

  const character = isGm ? characterData : playerStore.character;
  const isLoading = isGm ? false : playerStore.isLoading;

  useEffect(() => {
    if (campaignId && !isGm) {
      playerStore.fetchCharacter(campaignId);
      playerStore.fetchPrivateNotes(campaignId);
    }
  }, [campaignId, isGm, playerStore]);

  const { skills, saves, inventory, attacks, currency, deathSaves, hitDice, roleplayTraits } = useMemo(() => {
    if (!character) {
      return {
        skills: {}, saves: {}, inventory: [], attacks: [],
        currency: { cp: 0, sp: 0, gp: 0, pp: 0 },
        deathSaves: { successes: 0, failures: 0 },
        hitDice: { dieType: 'd10', total: 1, used: 0 },
        roleplayTraits: { personality: '', ideals: '', bonds: '', flaws: '' }
      };
    }
    let parsedSkills = {};
    let parsedSaves = {};
    try { parsedSkills = character.skills ? JSON.parse(character.skills) : {}; } catch(e){}
    try { parsedSaves = character.savingThrows ? JSON.parse(character.savingThrows) : {}; } catch(e){}

    return {
      skills: parsedSkills,
      saves: parsedSaves,
      inventory: character.inventoryItems || [],
      attacks: parseAttacks(character.attacks),
      currency: parseCurrency(character.currency),
      deathSaves: parseDeathSaves(character.deathSaves),
      hitDice: parseHitDice(character.hitDice, character.level || 1),
      roleplayTraits: parseRoleplayTraits(character.traits)
    };
  }, [character]);

  if (isLoading) return <div className="loading-screen" style={{ color: 'var(--color-text)', textAlign: 'center', padding: '40px' }}>Chargement de la fiche...</div>;
  if (!character) return <div className="empty-state" style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>Aucun personnage assigné. Demandez au MJ d'en créer un.</div>;

  const canEdit = character.canBeEditedByPlayer || isGm;
  const level = character.level || 1;
  const dexMod = getModifier(character.dexterity);
  const conMod = getModifier(character.constitution);
  const strMod = getModifier(character.strength);
  const pb = character.proficiencyBonus || getProficiencyBonus(level);

  // Dynamic calculations
  const calculatedSpeed = character.speed !== undefined ? character.speed : (8 + dexMod);
  const calculatedInit = character.initiative !== undefined ? character.initiative : dexMod;
  const calculatedAc = character.armorClass !== undefined ? character.armorClass : (10 + dexMod);
  const calculatedHpMax = character.hpMax || (10 + ((level - 1) * 6) + (level * conMod));

  const investedStatPoints = calculateInvestedPoints(character);
  const maxStatPoints = 5 + level;
  const availableStatPoints = maxStatPoints - investedStatPoints;

  const maxSavesMastery = Math.floor(level / 4);
  const maxSkillsMastery = Math.floor(level / 2);
  const usedSavesMastery = Object.values(saves).filter(Boolean).length;
  const usedSkillsMastery = Object.values(skills).reduce((acc, val) => acc + (val || 0), 0);

  const totalWeight = calculateTotalWeight(inventory);
  const maxCapacity = calculateCarryCapacity(character.strength);
  const weightPercent = Math.min(100, Math.round((totalWeight / (maxCapacity || 1)) * 100));

  const handleUpdate = async (data) => {
    const newData = { ...data };

    const affectsFormulas = ['level', 'dexterity', 'constitution'].some(key => key in data);
    if (affectsFormulas) {
      const mergedChar = { ...character, ...data };
      const newLvl = mergedChar.level || 1;
      const newDexMod = getModifier(mergedChar.dexterity);
      const newConMod = getModifier(mergedChar.constitution);

      newData.speed = 8 + newDexMod;
      newData.initiative = newDexMod;
      newData.armorClass = 10 + newDexMod;
      newData.hpMax = 10 + ((newLvl - 1) * 6) + (newLvl * newConMod);

      if (mergedChar.hpCurrent > newData.hpMax) {
        newData.hpCurrent = newData.hpMax;
      }
    }

    setSaveStatus('saving');
    try {
      if (isGm && onUpdate) {
        await onUpdate(newData);
      } else {
        await playerStore.updateCharacter(campaignId, newData);
      }
      setSaveStatus('saved');
      setTimeout(() => { setSaveStatus(prev => prev === 'saved' ? 'idle' : prev); }, 2000);
    } catch (e) {
      setSaveStatus('idle');
    }
  };

  const handleHpChange = (amount) => {
    const newHp = Math.max(0, Math.min(calculatedHpMax, (character.hpCurrent || 0) + amount));
    handleUpdate({ hpCurrent: newHp });
  };

  const handleCurrencyChange = (coin, val) => {
    const parsedVal = Math.max(0, parseInt(val) || 0);
    const newCurrency = { ...currency, [coin]: parsedVal };
    handleUpdate({ currency: JSON.stringify(newCurrency) });
  };

  const handleDeathSavesToggle = (type, index) => {
    if (!canEdit) return;
    const current = deathSaves[type] || 0;
    const target = index + 1;
    const newCount = (current === target) ? target - 1 : target;
    const newDeathSaves = { ...deathSaves, [type]: Math.max(0, Math.min(3, newCount)) };
    handleUpdate({ deathSaves: JSON.stringify(newDeathSaves) });
  };

  const handleDeathSavesReset = () => {
    if (!canEdit) return;
    handleUpdate({ deathSaves: JSON.stringify({ successes: 0, failures: 0 }) });
  };

  const handleHitDiceDelta = (delta) => {
    if (!canEdit) return;
    const currentUsed = hitDice.used || 0;
    const newUsed = Math.max(0, Math.min(hitDice.total, currentUsed + delta));
    const newHitDice = { ...hitDice, used: newUsed };
    handleUpdate({ hitDice: JSON.stringify(newHitDice) });
  };

  const handleInspirationToggle = () => {
    if (!canEdit && !isGm) return;
    handleUpdate({ heroicInspiration: !character.heroicInspiration });
  };

  // Inventory interactions
  const handleToggleEquip = async (itemId) => {
    if (!canEdit) return;
    try {
      const endpoint = isGm
        ? `/api/v1/gm/campaigns/${campaignId}/characters/${character.id}/inventory/${itemId}/toggle-equip`
        : `/api/v1/player/campaigns/${campaignId}/character/inventory/${itemId}/toggle-equip`;
      await api.patch(endpoint);
      if (isGm && onUpdate) {
        await onUpdate({});
      } else {
        await playerStore.fetchCharacter(campaignId);
      }
    } catch (err) {
      console.error('Failed to toggle equip state', err);
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (!canEdit) return;
    try {
      const endpoint = isGm
        ? `/api/v1/gm/campaigns/${campaignId}/characters/${character.id}/inventory/${itemId}/quantity`
        : `/api/v1/player/campaigns/${campaignId}/character/inventory/${itemId}/quantity`;
      await api.patch(endpoint, { quantity: newQty });
      if (isGm && onUpdate) {
        await onUpdate({});
      } else {
        await playerStore.fetchCharacter(campaignId);
      }
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!canEdit) return;
    try {
      const endpoint = isGm
        ? `/api/v1/gm/campaigns/${campaignId}/characters/${character.id}/inventory/${itemId}`
        : `/api/v1/player/campaigns/${campaignId}/character/inventory/${itemId}`;
      await api.delete(endpoint);
      if (isGm && onUpdate) {
        await onUpdate({});
      } else {
        await playerStore.fetchCharacter(campaignId);
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !canEdit) return;
    try {
      const endpoint = isGm
        ? `/api/v1/gm/campaigns/${campaignId}/characters/${character.id}/inventory`
        : `/api/v1/player/campaigns/${campaignId}/character/inventory`;
      await api.post(endpoint, {
        name: newItemName.trim(),
        type: newItemType,
        weight: parseFloat(newItemWeight) || 0,
        quantity: parseInt(newItemQty) || 1
      });
      setNewItemName('');
      setNewItemWeight('');
      setNewItemQty(1);
      setIsAddingItem(false);
      if (isGm && onUpdate) {
        await onUpdate({});
      } else {
        await playerStore.fetchCharacter(campaignId);
      }
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  // Attacks handlers
  const handleAddAttack = (e) => {
    e.preventDefault();
    if (!newAtkName.trim() || !canEdit) return;
    const abilityMod = newAtkAbility === 'dexterity' ? dexMod : strMod;
    const bonus = abilityMod + pb;
    const newAttack = {
      id: 'atk_' + Date.now(),
      name: newAtkName.trim(),
      ability: newAtkAbility,
      bonus: bonus >= 0 ? `+${bonus}` : `${bonus}`,
      damage: `${newAtkDamage} ${formatModifier(abilityMod)}`,
      damageType: newAtkDamageType,
      range: newAtkRange
    };
    const updatedAttacks = [...attacks, newAttack];
    handleUpdate({ attacks: JSON.stringify(updatedAttacks) });
    setNewAtkName('');
    setIsAddingAttack(false);
  };

  const handleDeleteAttack = (atkId) => {
    if (!canEdit) return;
    const updatedAttacks = attacks.filter(a => a.id !== atkId);
    handleUpdate({ attacks: JSON.stringify(updatedAttacks) });
  };

  const handleRoleplayTraitChange = (key, value) => {
    const updated = { ...roleplayTraits, [key]: value };
    handleUpdate({ traits: JSON.stringify(updated) });
  };

  return (
    <div className="character-sheet">
      {saveStatus !== 'idle' && (
        <div className={`autosave-indicator ${saveStatus}`}>
          {saveStatus === 'saving' ? <Loader size={16} className="spin" /> : <Check size={16} />}
          {saveStatus === 'saving' ? 'Sauvegarde...' : 'Sauvegardé'}
        </div>
      )}

      {/* Header & Vital Stats */}
      <header className="glass-panel character-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          {canEdit ? (
            <input
              type="text"
              value={character.name || ''}
              onChange={e => handleUpdate({ name: e.target.value })}
              className="editable-input character-name"
              style={{ background: 'transparent', border: 'none', borderBottom: '2px dashed rgba(255,255,255,0.2)', width: 'auto', minWidth: '200px' }}
              placeholder="Nom du personnage"
            />
          ) : (
            <h1 className="character-name">{character.name}</h1>
          )}
        </div>

        <div className="character-subtitle" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {canEdit ? (
            <>
              Niveau <input type="number" min="1" max="20" value={character.level || 1} onChange={e => handleUpdate({ level: parseInt(e.target.value) || 1 })} className="editable-input" style={{ width: '50px' }} />
              • <input type="text" value={character.race || ''} onChange={e => handleUpdate({ race: e.target.value })} className="editable-input" placeholder="Race" style={{ width: '120px' }} />
              • <input type="text" value={character.class || ''} onChange={e => handleUpdate({ class: e.target.value })} className="editable-input" placeholder="Classe" style={{ width: '120px' }} />
            </>
          ) : (
            `Niveau ${character.level || 1} • ${character.race || 'Humain'} • ${formatClasses(character.class)}`
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div className="skill-points-badge">
            <Network size={16} /> Points d'Arbre : {((character.level || 1) * 2) - (character.skillPoints || 0)} dispo.
          </div>
          <button
            onClick={handleInspirationToggle}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid ' + (character.heroicInspiration ? 'var(--warning, #f59e0b)' : 'rgba(255,255,255,0.2)'),
              background: character.heroicInspiration ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
              color: character.heroicInspiration ? '#f59e0b' : 'var(--color-text-muted)',
              cursor: (canEdit || isGm) ? 'pointer' : 'default',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
            title="Inspiration Héroïque accordée par le MJ"
          >
            <Sparkles size={16} />
            <span>Inspiration {character.heroicInspiration ? 'Active' : 'Inactive'}</span>
          </button>
        </div>

        {/* Top Vital Stats Badges */}
        <div className="vital-stats-grid" style={{ marginTop: '20px' }}>
          <div className="vital-stat-box">
            <Heart size={26} color="var(--danger, #ef4444)" />
            <div className="vital-stat-value">{character.hpCurrent ?? 0} / {calculatedHpMax}</div>
            <div className="vital-stat-label">Points de Vie</div>
            {canEdit && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button className="stat-btn" onClick={() => handleHpChange(-1)} title="-1 PV">-</button>
                <button className="stat-btn" onClick={() => handleHpChange(1)} title="+1 PV">+</button>
              </div>
            )}
          </div>

          <div className="vital-stat-box">
            <Shield size={26} color="var(--color-primary, #6366f1)" />
            <div className="vital-stat-value">{calculatedAc}</div>
            <div className="vital-stat-label">Classe d'Armure</div>
          </div>

          <div className="vital-stat-box">
            <Zap size={26} color="var(--warning, #f59e0b)" />
            <div className="vital-stat-value">{calculatedInit >= 0 ? `+${calculatedInit}` : calculatedInit}</div>
            <div className="vital-stat-label">Initiative</div>
          </div>

          <div className="vital-stat-box">
            <Activity size={26} color="#a3e635" />
            <div className="vital-stat-value">{calculatedSpeed} m</div>
            <div className="vital-stat-label">Vitesse</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs — 8 Distinct Tabs per Specification */}
      <div className="tabs-container">
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'combat' ? 'active' : ''}`} onClick={() => setActiveTab('combat')}>
            <Swords size={16} /> Combat
          </button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <Activity size={16} /> Caractéristiques
          </button>
          <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Book size={16} /> Compétences
          </button>
          <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <Backpack size={16} /> Inventaire & Or
          </button>
          <button className={`tab-btn ${activeTab === 'identity' ? 'active' : ''}`} onClick={() => setActiveTab('identity')}>
            <User size={16} /> Identité & RP
          </button>
          <button className={`tab-btn ${activeTab === 'skillsTree' ? 'active' : ''}`} onClick={() => setActiveTab('skillsTree')}>
            <Network size={16} /> Arbres de Talents
          </button>
          {!isGm && (
            <button className={`tab-btn ${activeTab === 'playerNotes' ? 'active' : ''}`} onClick={() => setActiveTab('playerNotes')}>
              <Book size={16} /> Mes Notes
            </button>
          )}
          {isGm && (
            <button className={`tab-btn ${activeTab === 'gmNotes' ? 'active' : ''}`} onClick={() => setActiveTab('gmNotes')}>
              <Lock size={16} color="#ef4444" /> Notes MJ Secrètes
            </button>
          )}
        </nav>
      </div>

      {/* ============================================================ */}
      {/* 1. COMBAT TAB                                                */}
      {/* ============================================================ */}
      {activeTab === 'combat' && (
        <section className="combat-section">
          <div className="combat-grid-2">
            {/* PV & Temp HP */}
            <div className="glass-panel combat-card">
              <div className="combat-card-header">
                <span className="combat-card-title"><Heart size={18} color="#ef4444" /> Santé & Dégâts</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Max : {calculatedHpMax} PV</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: (character.hpCurrent || 0) === 0 ? '#ef4444' : 'var(--color-text)' }}>
                    {character.hpCurrent ?? 0} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>/ {calculatedHpMax}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PV Actuels</div>
                </div>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="stat-btn" onClick={() => handleHpChange(-5)} title="-5 PV">-5</button>
                    <button className="stat-btn" onClick={() => handleHpChange(-1)} title="-1 PV">-1</button>
                    <button className="stat-btn" onClick={() => handleHpChange(1)} title="+1 PV">+1</button>
                    <button className="stat-btn" onClick={() => handleHpChange(5)} title="+5 PV">+5</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>PV Temporaires :</span>
                {canEdit ? (
                  <input
                    type="number"
                    min="0"
                    value={character.temporaryHp || 0}
                    onChange={e => handleUpdate({ temporaryHp: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="editable-input"
                    style={{ width: '60px' }}
                  />
                ) : (
                  <span style={{ fontWeight: 'bold' }}>{character.temporaryHp || 0}</span>
                )}
              </div>
            </div>

            {/* Hit Dice & Death Saves */}
            <div className="glass-panel combat-card">
              <div className="combat-card-header">
                <span className="combat-card-title"><Activity size={18} color="#f59e0b" /> Dés de Vie & Survie</span>
                <button onClick={handleDeathSavesReset} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                  <RotateCcw size={12} /> Reset Mort
                </button>
              </div>

              {/* Hit Dice Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Dés de Vie ({hitDice.dieType || 'd10'})</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                    {hitDice.total - (hitDice.used || 0)} / {hitDice.total} restants
                  </div>
                </div>
                {canEdit && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="stat-btn"
                      onClick={() => handleHitDiceDelta(1)}
                      disabled={(hitDice.used || 0) >= hitDice.total}
                      title="Dépenser 1 Dé de Vie"
                    >
                      -
                    </button>
                    <button
                      className="stat-btn"
                      onClick={() => handleHitDiceDelta(-1)}
                      disabled={(hitDice.used || 0) <= 0}
                      title="Récupérer 1 Dé de Vie (Repos Long)"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Death Saving Throws */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sauvegardes contre la Mort (DD 10)
                </div>
                {/* Successes */}
                <div className="death-saves-row">
                  <span style={{ fontSize: '0.85rem', color: 'var(--success, #10b981)', fontWeight: 'bold' }}>Succès</span>
                  <div className="death-save-circles">
                    {[0, 1, 2].map(idx => (
                      <div
                        key={'succ_' + idx}
                        className={`save-circle success ${(deathSaves.successes || 0) > idx ? 'checked' : ''}`}
                        onClick={() => handleDeathSavesToggle('successes', idx)}
                        title={`Succès ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
                {/* Failures */}
                <div className="death-saves-row">
                  <span style={{ fontSize: '0.85rem', color: 'var(--danger, #ef4444)', fontWeight: 'bold' }}>Échecs</span>
                  <div className="death-save-circles">
                    {[0, 1, 2].map(idx => (
                      <div
                        key={'fail_' + idx}
                        className={`save-circle failure ${(deathSaves.failures || 0) > idx ? 'checked' : ''}`}
                        onClick={() => handleDeathSavesToggle('failures', idx)}
                        title={`Échec ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attacks and Weapons Section */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Swords size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Attaques & Armes Équipées</h3>
              </div>
              {canEdit && (
                <button
                  className="btn-primary"
                  onClick={() => setIsAddingAttack(!isAddingAttack)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Ajouter une Attaque
                </button>
              )}
            </div>

            {isAddingAttack && canEdit && (
              <form onSubmit={handleAddAttack} style={{ background: 'var(--paper-sunken)', padding: '14px', borderRadius: '8px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nom Arme/Attaque</label>
                  <input type="text" placeholder="Ex: Fusil de sniper" value={newAtkName} onChange={e => setNewAtkName(e.target.value)} className="editable-input" style={{ width: '100%', textAlign: 'left' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Carac. Clé</label>
                  <select value={newAtkAbility} onChange={e => setNewAtkAbility(e.target.value)} className="editable-input" style={{ width: '100%' }}>
                    <option value="strength">Force (Mêlée)</option>
                    <option value="dexterity">Dextérité (Tir/Finesse)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Dégâts de Base</label>
                  <input type="text" placeholder="Ex: 1d8 ou 2d6" value={newAtkDamage} onChange={e => setNewAtkDamage(e.target.value)} className="editable-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Type Dégâts</label>
                  <input type="text" placeholder="perforant, feu..." value={newAtkDamageType} onChange={e => setNewAtkDamageType(e.target.value)} className="editable-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Portée</label>
                  <input type="text" placeholder="CàC ou 24/72m" value={newAtkRange} onChange={e => setNewAtkRange(e.target.value)} className="editable-input" style={{ width: '100%' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Enregistrer</button>
                  <button type="button" onClick={() => setIsAddingAttack(false)} style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', color: 'var(--ink)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>✕</button>
                </div>
              </form>
            )}

            {attacks.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px', fontSize: '0.9rem' }}>
                Aucune arme configurée. Ajoutez vos armes de poing, fusils ou lames post-apocalyptiques.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="attacks-table">
                  <thead>
                    <tr>
                      <th>Arme / Action</th>
                      <th>Toucher</th>
                      <th>Dégâts</th>
                      <th>Portée</th>
                      {canEdit && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {attacks.map(atk => (
                      <tr key={atk.id}>
                        <td><strong>{atk.name}</strong></td>
                        <td style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{atk.bonus}</td>
                        <td>{atk.damage} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>({atk.damageType})</span></td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{atk.range}</td>
                        {canEdit && (
                          <td>
                            <button
                              onClick={() => handleDeleteAttack(atk.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger, #ef4444)', cursor: 'pointer', padding: '4px' }}
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 2. STATS & SAVING THROWS TAB                                */}
      {/* ============================================================ */}
      {activeTab === 'stats' && (
        <section>
          {canEdit && (
            <div className="glass-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>Points de Caractéristiques Libres :</span>
              <span style={{ color: availableStatPoints > 0 ? 'var(--color-primary)' : availableStatPoints < 0 ? 'var(--danger, #ef4444)' : 'var(--color-text-muted)', fontWeight: '900', fontSize: '1.4rem' }}>
                {availableStatPoints}
              </span>
            </div>
          )}

          <div className="stats-grid">
            {ABILITIES_LIST.map(stat => {
              const val = character[stat] || 10;
              const mod = getModifier(val);
              return (
                <div key={stat} className="glass-panel stat-card">
                  <div className="stat-name">{stat.substring(0, 3)}</div>
                  <div className="stat-value-container">
                    {canEdit && (
                      <button className="stat-btn" style={{ visibility: val > 8 ? 'visible' : 'hidden' }} onClick={() => val > 8 && handleUpdate({ [stat]: val - 1 })}>-</button>
                    )}
                    <span className="stat-value">{val}</span>
                    {canEdit && (
                      <button className="stat-btn" style={{ visibility: val < 20 ? 'visible' : 'hidden' }} onClick={() => val < 20 && handleUpdate({ [stat]: val + 1 })}>+</button>
                    )}
                  </div>
                  <div className="stat-mod">{formatModifier(mod)}</div>
                </div>
              );
            })}
          </div>

          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Bonus de Maîtrise</strong>
              <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem', background: 'var(--info-tint)', padding: '4px 12px', borderRadius: '12px' }}>
                +{pb}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
              <h4 style={{ color: 'var(--color-text)', margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jets de Sauvegarde</h4>
              <span style={{ fontSize: '0.85rem', color: usedSavesMastery > maxSavesMastery ? 'var(--danger, #ef4444)' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
                Maîtrises : {usedSavesMastery} / {maxSavesMastery}
              </span>
            </div>

            <div className="saving-throws-list">
              {ABILITIES_LIST.map(stat => {
                const isProficient = saves[stat];
                const baseMod = getModifier(character[stat]);
                const finalMod = isProficient ? baseMod + pb : baseMod;
                return (
                  <div key={stat} className="save-item" style={{ cursor: canEdit ? 'pointer' : 'default' }} onClick={() => {
                    if (!canEdit) return;
                    if (!isProficient && usedSavesMastery >= maxSavesMastery) return;
                    const newSaves = { ...saves, [stat]: !isProficient };
                    handleUpdate({ savingThrows: JSON.stringify(newSaves) });
                  }}>
                    <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
                      <div className={`skill-prof-indicator ${isProficient ? 'proficient' : ''}`}></div>
                      {stat.substring(0, 3).toUpperCase()}
                    </span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{formatModifier(finalMod)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. SKILLS TAB (18 D&D 5e Competences)                         */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: 0 }}>Compétences (18 Standard 5e)</h3>
            <span style={{ fontSize: '0.9rem', color: usedSkillsMastery > maxSkillsMastery ? 'var(--danger, #ef4444)' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
              Points utilisés : {usedSkillsMastery} / {maxSkillsMastery}
            </span>
          </div>
          <div className="skills-grid">
            {SKILLS_LIST.map(skill => {
              const profLevel = skills[skill.id] || 0; // 0=none, 1=prof, 2=exp
              const baseMod = getModifier(character[skill.ability]);
              let finalMod = baseMod;
              if (profLevel === 1) finalMod += pb;
              if (profLevel === 2) finalMod += (pb * 2);

              let indicatorClass = '';
              if (profLevel === 1) indicatorClass = 'proficient';
              if (profLevel === 2) indicatorClass = 'expert';

              return (
                <div key={skill.id} className="skill-item" style={{ cursor: canEdit ? 'pointer' : 'default', userSelect: 'none' }} onClick={() => {
                  if (!canEdit) return;

                  let newLevel;
                  if (profLevel === 0) {
                    if (usedSkillsMastery < maxSkillsMastery) newLevel = 1;
                    else return;
                  } else if (profLevel === 1) {
                    if (usedSkillsMastery < maxSkillsMastery) newLevel = 2;
                    else newLevel = 0;
                  } else {
                    newLevel = 0;
                  }

                  const newSkills = { ...skills };
                  if (newLevel === 0) {
                    delete newSkills[skill.id];
                  } else {
                    newSkills[skill.id] = newLevel;
                  }
                  handleUpdate({ skills: JSON.stringify(newSkills) });
                }}>
                  <div className="skill-info">
                    <div className={`skill-prof-indicator ${indicatorClass}`}></div>
                    <div>
                      <div className="skill-name">{skill.label}</div>
                      <div className="skill-attr">{skill.ability.substring(0,3)}</div>
                    </div>
                  </div>
                  <div className="skill-mod">{formatModifier(finalMod)}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. INVENTORY & CURRENCY TAB                                  */}
      {/* ============================================================ */}
      {activeTab === 'inventory' && (
        <section className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={20} color="#f59e0b" /> Devises & Monnaies
            </h3>
          </div>

          {/* 4 Currency Badges */}
          <div className="currency-bar">
            <div className="currency-badge pp">
              <span className="currency-label">Platine (PP)</span>
              {canEdit ? (
                <input type="number" min="0" value={currency.pp || 0} onChange={e => handleCurrencyChange('pp', e.target.value)} className="currency-input" />
              ) : (
                <span className="currency-input">{currency.pp || 0}</span>
              )}
            </div>
            <div className="currency-badge gp">
              <span className="currency-label">Or (PO)</span>
              {canEdit ? (
                <input type="number" min="0" value={currency.gp || 0} onChange={e => handleCurrencyChange('gp', e.target.value)} className="currency-input" />
              ) : (
                <span className="currency-input">{currency.gp || 0}</span>
              )}
            </div>
            <div className="currency-badge sp">
              <span className="currency-label">Argent (PA)</span>
              {canEdit ? (
                <input type="number" min="0" value={currency.sp || 0} onChange={e => handleCurrencyChange('sp', e.target.value)} className="currency-input" />
              ) : (
                <span className="currency-input">{currency.sp || 0}</span>
              )}
            </div>
            <div className="currency-badge cp">
              <span className="currency-label">Cuivre (PC)</span>
              {canEdit ? (
                <input type="number" min="0" value={currency.cp || 0} onChange={e => handleCurrencyChange('cp', e.target.value)} className="currency-input" />
              ) : (
                <span className="currency-input">{currency.cp || 0}</span>
              )}
            </div>
          </div>

          {/* Weight & Capacity Gauge */}
          <div className="weight-bar-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <span>Poids Transporté : <strong>{totalWeight.toFixed(1)} kg</strong></span>
              <span>Capacité Max (FOR x 7.5) : <strong>{maxCapacity} kg</strong></span>
            </div>
            <div className="weight-progress-bg">
              <div
                className="weight-progress-fill"
                style={{
                  width: `${weightPercent}%`,
                  backgroundColor: weightPercent > 100 ? '#ef4444' : weightPercent > 80 ? '#f59e0b' : '#10b981'
                }}
              />
            </div>
          </div>

          {/* Structured Inventory List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Objets en Possession ({inventory.length})
            </h4>
            {canEdit && (
              <button
                className="btn-primary"
                onClick={() => setIsAddingItem(!isAddingItem)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 12px' }}
              >
                <Plus size={14} /> Ajouter un Objet
              </button>
            )}
          </div>

          {isAddingItem && canEdit && (
            <form onSubmit={handleAddItem} style={{ background: 'var(--paper-sunken)', padding: '14px', borderRadius: '8px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nom de l'objet</label>
                <input type="text" placeholder="Ex: Corde, Rations..." value={newItemName} onChange={e => setNewItemName(e.target.value)} className="editable-input" style={{ width: '100%', textAlign: 'left' }} required />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Type</label>
                <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="editable-input" style={{ width: '100%' }}>
                  <option value="weapon">Arme</option>
                  <option value="armor">Armure</option>
                  <option value="consumable">Consommable</option>
                  <option value="tool">Outil</option>
                  <option value="misc">Divers</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Poids (kg)</label>
                <input type="number" step="0.1" min="0" placeholder="0.5" value={newItemWeight} onChange={e => setNewItemWeight(e.target.value)} className="editable-input" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Quantité</label>
                <input type="number" min="1" value={newItemQty} onChange={e => setNewItemQty(e.target.value)} className="editable-input" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Ajouter</button>
                <button type="button" onClick={() => setIsAddingItem(false)} style={{ background: 'var(--paper-raised)', border: '1px solid var(--rule)', color: 'var(--ink)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>✕</button>
              </div>
            </form>
          )}

          {inventory.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px', fontSize: '0.9rem' }}>
              Inventaire vide. Utilisez le bouton "Ajouter un Objet" pour équiper votre survivant.
            </div>
          ) : (
            <div className="inventory-list">
              {inventory.map(row => {
                const itm = row.item || {};
                return (
                  <div key={row.id} className="inventory-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {canEdit && (
                        <button
                          onClick={() => handleToggleEquip(row.itemId)}
                          className={`equip-btn ${row.equipped ? 'equipped' : ''}`}
                          title={row.equipped ? 'Équipé (Actif)' : 'Dans le sac (Non équipé)'}
                        >
                          <Shield size={14} />
                          <span>{row.equipped ? 'Équipé' : 'Sac'}</span>
                        </button>
                      )}
                      <div>
                        <div className="inventory-item-name">{itm.name || 'Objet sans nom'}</div>
                        <div className="inventory-item-meta">
                          {itm.type} • {itm.weight || 0} kg • {itm.description || 'Pas de description'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {canEdit ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button className="stat-btn" onClick={() => handleQuantityChange(row.itemId, (row.quantity || 1) - 1)}>-</button>
                          <span className="inventory-item-quantity">{row.quantity || 1}</span>
                          <button className="stat-btn" onClick={() => handleQuantityChange(row.itemId, (row.quantity || 1) + 1)}>+</button>
                        </div>
                      ) : (
                        <span className="inventory-item-quantity">x{row.quantity || 1}</span>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => handleDeleteItem(row.itemId)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger, #ef4444)', cursor: 'pointer', padding: '6px' }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notes d'équipement libres */}
          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
              Notes d'Équipement Libres & Détails :
            </label>
            {canEdit ? (
              <textarea
                value={character.notes || ''}
                onChange={e => handleUpdate({ notes: e.target.value })}
                className="editable-textarea"
                placeholder="Notes de sacs, réserves cachées, munitions restantes..."
                rows={3}
                style={{ minHeight: '100px' }}
              />
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'var(--paper-sunken)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                {character.notes || 'Aucune note.'}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 5. IDENTITY & ROLEPLAY TAB                                   */}
      {/* ============================================================ */}
      {activeTab === 'identity' && (
        <section className="glass-panel">
          <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: '16px' }}>Identité & Historique D&D 5e</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Alignement</label>
              {canEdit ? (
                <input type="text" value={character.alignment || ''} onChange={e => handleUpdate({ alignment: e.target.value })} className="editable-input" style={{ textAlign: 'left' }} placeholder="Ex: Neutre Bon" />
              ) : (
                <div style={{ color: 'var(--color-text)' }}>{character.alignment || 'Non défini'}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Historique (Background)</label>
              {canEdit ? (
                <input type="text" value={character.background || ''} onChange={e => handleUpdate({ background: e.target.value })} className="editable-input" style={{ textAlign: 'left' }} placeholder="Ex: Pillard repenti, Mécanicien" />
              ) : (
                <div style={{ color: 'var(--color-text)' }}>{character.background || 'Non défini'}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>URL Portrait / Image</label>
              {canEdit ? (
                <input type="text" value={character.portraitUrl || ''} onChange={e => handleUpdate({ portraitUrl: e.target.value })} className="editable-input" style={{ textAlign: 'left' }} placeholder="https://..." />
              ) : (
                <div style={{ color: 'var(--color-text)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{character.portraitUrl || 'Aucun'}</div>
              )}
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />

          {/* 4 Pillars of D&D 5e Roleplay: Personality, Ideals, Bonds, Flaws */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>Traits de Personnalité</label>
              {canEdit ? (
                <textarea rows={3} value={roleplayTraits.personality || ''} onChange={e => handleRoleplayTraitChange('personality', e.target.value)} className="editable-textarea" style={{ minHeight: '80px' }} placeholder="Façons d'être, manies, langage..." />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'var(--paper-sunken)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>{roleplayTraits.personality || 'Non défini'}</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 'bold' }}>Idéaux</label>
              {canEdit ? (
                <textarea rows={3} value={roleplayTraits.ideals || ''} onChange={e => handleRoleplayTraitChange('ideals', e.target.value)} className="editable-textarea" style={{ minHeight: '80px' }} placeholder="Ce en quoi croit le personnage..." />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'var(--paper-sunken)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>{roleplayTraits.ideals || 'Non défini'}</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 'bold' }}>Liens</label>
              {canEdit ? (
                <textarea rows={3} value={roleplayTraits.bonds || ''} onChange={e => handleRoleplayTraitChange('bonds', e.target.value)} className="editable-textarea" style={{ minHeight: '80px' }} placeholder="Personnes, lieux ou objets chers..." />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'var(--paper-sunken)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>{roleplayTraits.bonds || 'Non défini'}</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 'bold' }}>Défauts & Faiblesses</label>
              {canEdit ? (
                <textarea rows={3} value={roleplayTraits.flaws || ''} onChange={e => handleRoleplayTraitChange('flaws', e.target.value)} className="editable-textarea" style={{ minHeight: '80px' }} placeholder="Vices, impulsions destructrices..." />
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'var(--paper-sunken)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>{roleplayTraits.flaws || 'Non défini'}</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 6. SKILL TREES TAB (Native Integration)                      */}
      {/* ============================================================ */}
      {activeTab === 'skillsTree' && (
        <section className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={20} color="#f59e0b" /> Progression Hybride — Arbres de Talents
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                2 points investis dans une branche = 1 niveau dans la classe correspondante. Dépensez vos points directement ci-dessous.
              </p>
            </div>
            <button
              onClick={() => setShowSkillTreeModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                borderRadius: '6px', background: 'var(--overlay-subtle)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
              }}
              title="Agrandir en plein écran"
            >
              <Maximize2 size={16} /> Plein Écran
            </button>
          </div>

          <SkillTreeViewer
            campaignId={campaignId}
            character={character}
            isGm={isGm}
            embedded={true}
            onUpdateCharacter={async (data) => {
              if (isGm && onUpdate) return onUpdate(data);
              return playerStore.updateCharacter(campaignId, data);
            }}
          />
        </section>
      )}

      {/* ============================================================ */}
      {/* 7. PLAYER PRIVATE NOTES TAB                                  */}
      {/* ============================================================ */}
      {activeTab === 'playerNotes' && !isGm && (
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: 0 }}>Mes Notes Privées</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Ces notes sont confidentielles et ne peuvent jamais être lues par le MJ.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <textarea
                id="new-note-input"
                placeholder="Nouvelle note personnelle..."
                className="editable-textarea"
                rows={2}
                style={{ flex: 1, minHeight: '60px' }}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  const el = document.getElementById('new-note-input');
                  if (el && el.value.trim()) {
                    playerStore.createPrivateNote(campaignId, { content: el.value.trim() }).then(() => {
                      el.value = '';
                    });
                  }
                }}
              >
                Ajouter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {playerStore.privateNotes && playerStore.privateNotes.map(note => (
                <div key={note.id} style={{ padding: '12px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', flex: 1 }}>{note.content}</div>
                  <button
                    onClick={() => playerStore.deletePrivateNote(campaignId, note.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger, #ef4444)', cursor: 'pointer', padding: '0 8px' }}
                    title="Supprimer la note"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {(!playerStore.privateNotes || playerStore.privateNotes.length === 0) && (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>Aucune note personnelle.</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 8. GM SECRET NOTES TAB (GM ONLY)                            */}
      {/* ============================================================ */}
      {activeTab === 'gmNotes' && isGm && (
        <section className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="#ef4444" /> Notes Secrètes du MJ
            </h3>
            <span className="gm-secret-badge">
              <Eye size={14} /> Strictement Confidentiel MJ
            </span>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Ces notes sont réservées à votre préparation de MJ (passé caché, missions secrètes, trahisons prévues, indices liés). Elles ne sont <strong>jamais transmises ni affichées</strong> au joueur.
          </p>

          <textarea
            value={character.gmNotes || ''}
            onChange={e => handleUpdate({ gmNotes: e.target.value })}
            className="editable-textarea"
            rows={8}
            placeholder="Coulisses de ce personnage, objectifs secrets de faction, arcs narratifs à déclencher..."
            style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'var(--danger-tint)' }}
          />
        </section>
      )}

      {/* Read-Only Warning */}
      {!canEdit && (
        <div className="glass-panel" style={{ marginTop: 'auto', border: '1px solid var(--warning, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--warning, #f59e0b)' }}>
          <AlertCircle size={18} />
          <span>Fiche en lecture seule. Le MJ doit autoriser l'édition pour modifier les valeurs.</span>
        </div>
      )}

      {/* Fullscreen Modal Fallback for Skill Tree if requested */}
      {showSkillTreeModal && (
        <SkillTreeViewer
          campaignId={campaignId}
          character={character}
          isGm={isGm}
          onUpdateCharacter={async (data) => {
            if (isGm && onUpdate) return onUpdate(data);
            return playerStore.updateCharacter(campaignId, data);
          }}
          onClose={() => setShowSkillTreeModal(false)}
        />
      )}
    </div>
  );
}
