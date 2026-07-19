import React, { useEffect, useState, useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Heart, Shield, Zap, Book, Backpack, AlertCircle, Network, User, Activity, Check, Save, Loader } from 'lucide-react';
import SkillTreeViewer from '../gm/SkillTreeViewer';
import { formatClasses } from '../../utils/formatters';
import { SKILLS_LIST, ABILITIES_LIST, getModifier, formatModifier, calculateInvestedPoints } from './characterUtils';
import './CharacterSheet.css';

export default function CharacterSheet({ campaignId, characterData, isGm, onUpdate }) {
  const playerStore = usePlayerStore();
  const [activeTab, setActiveTab] = useState('stats');
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  const character = isGm ? characterData : playerStore.character;
  const isLoading = isGm ? false : playerStore.isLoading;

  useEffect(() => {
    if (campaignId && !isGm) {
      playerStore.fetchCharacter(campaignId);
      playerStore.fetchPrivateNotes(campaignId);
    }
  }, [campaignId, isGm, playerStore]);

  const { skills, saves, inventory } = useMemo(() => {
    if (!character) return { skills: {}, saves: {}, inventory: [] };
    let parsedSkills = {};
    let parsedSaves = {};
    try { parsedSkills = character.skills ? JSON.parse(character.skills) : {}; } catch(e){}
    try { parsedSaves = character.savingThrows ? JSON.parse(character.savingThrows) : {}; } catch(e){}
    
    return {
      skills: parsedSkills,
      saves: parsedSaves,
      inventory: character.inventoryItems || []
    };
  }, [character?.skills, character?.savingThrows, character?.inventoryItems]);

  if (isLoading) return <div className="loading-screen" style={{ color: 'var(--color-text)', textAlign: 'center', padding: '40px' }}>Chargement de la fiche...</div>;
  if (!character) return <div className="empty-state" style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>Aucun personnage assigné. Demandez au MJ d'en créer un.</div>;

  const investedStatPoints = calculateInvestedPoints(character);
  const maxStatPoints = 5 + (character.level || 1);
  const availableStatPoints = maxStatPoints - investedStatPoints;

  const handleUpdate = async (data) => {
    const newData = { ...data };
    
    // Si modification d'une stat impactant les calculs, on met à jour les données dérivées
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
    const calculatedHpMax = 10 + (((character.level || 1) - 1) * 6) + ((character.level || 1) * getModifier(character.constitution));
    const newHp = Math.max(0, Math.min(calculatedHpMax, character.hpCurrent + amount));
    handleUpdate({ hpCurrent: newHp });
  };

  const canEdit = character.canBeEditedByPlayer || isGm;
  
  // Dynamic Calculations
  const level = character.level || 1;
  const dexMod = getModifier(character.dexterity);
  const conMod = getModifier(character.constitution);
  const calculatedSpeed = 8 + dexMod;
  const calculatedInit = dexMod;
  const calculatedAc = 10 + dexMod;
  const calculatedHpMax = 10 + ((level - 1) * 6) + (level * conMod);

  const maxSavesMastery = Math.floor(level / 4);
  const maxSkillsMastery = Math.floor(level / 2);
  const usedSavesMastery = Object.values(saves).filter(Boolean).length;
  const usedSkillsMastery = Object.values(skills).reduce((acc, val) => acc + (val || 0), 0);

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
            `Niveau ${character.level} • ${character.race} • ${formatClasses(character.class)}`
          )}
        </div>
        
        <div className="skill-points-badge">
          <Network size={16} /> Points d'Arbre de Talents : {(character.level || 1) - (character.skillPoints || 0)} dispo.
        </div>

        <div className="vital-stats-grid" style={{ marginTop: '24px' }}>
          <div className="vital-stat-box">
            <Heart size={28} color="var(--danger, #ef4444)" />
            <div className="vital-stat-value">{character.hpCurrent} / {calculatedHpMax}</div>
            <div className="vital-stat-label">Points de Vie</div>
            {canEdit && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className="stat-btn" onClick={() => handleHpChange(-1)}>-</button>
                <button className="stat-btn" onClick={() => handleHpChange(1)}>+</button>
              </div>
            )}
          </div>
          
          <div className="vital-stat-box">
            <Shield size={28} color="var(--color-primary)" />
            <div className="vital-stat-value">{calculatedAc}</div>
            <div className="vital-stat-label">Classe d'Armure</div>
          </div>
          
          <div className="vital-stat-box">
            <Zap size={28} color="var(--warning, #f59e0b)" />
            <div className="vital-stat-value">{calculatedInit >= 0 ? `+${calculatedInit}` : calculatedInit}</div>
            <div className="vital-stat-label">Initiative</div>
          </div>

          <div className="vital-stat-box">
            <Activity size={28} color="#a3e635" />
            <div className="vital-stat-value">{calculatedSpeed} m</div>
            <div className="vital-stat-label">Vitesse</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'identity' ? 'active' : ''}`} onClick={() => setActiveTab('identity')}><User size={16} /> Identité</button>
          <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            <Activity size={16} /> Stats
          </button>
          <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            <Book size={16} /> Compétences
          </button>
          <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <Backpack size={16} /> Inventaire
          </button>
          <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
            <Book size={16} /> Mes Notes
          </button>
        </nav>
        <button className="tab-btn" style={{ color: '#fff', background: 'var(--warning, #f59e0b)' }} onClick={() => setShowSkillTree(true)}><Network size={16} /> Arbres de Talents</button>
      </div>

      {/* Identity Tab */}
      {activeTab === 'identity' && (
        <section className="glass-panel">
          <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: '16px' }}>Background & Roleplay</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Alignement</label>
              {canEdit ? (
                <input type="text" value={character.alignment || ''} onChange={e => handleUpdate({ alignment: e.target.value })} className="editable-input" style={{ textAlign: 'left' }} />
              ) : (
                <div style={{ color: 'var(--color-text)' }}>{character.alignment || 'Non défini'}</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Historique</label>
              {canEdit ? (
                <input type="text" value={character.background || ''} onChange={e => handleUpdate({ background: e.target.value })} className="editable-input" style={{ textAlign: 'left' }} />
              ) : (
                <div style={{ color: 'var(--color-text)' }}>{character.background || 'Non défini'}</div>
              )}
            </div>
          </div>

          <p style={{ color: 'var(--color-text-muted)' }}><strong>Dés de Vie :</strong> {character.hitDice || "Non définis"}</p>
          <p style={{ color: 'var(--color-text-muted)' }}><strong>PV Temporaires :</strong> {character.temporaryHp || 0}</p>
          <p style={{ color: 'var(--color-text-muted)' }}><strong>Inspiration Héroïque :</strong> {character.heroicInspiration ? 'Oui' : 'Non'}</p>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Traits de personnalité supplémentaires...</p>
        </section>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <section>
          {canEdit && (
            <div className="glass-panel" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
              <span style={{ color: 'var(--color-text)', fontWeight: 'bold' }}>Points de Carac. Libres :</span>
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
              {canEdit ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: 'var(--color-text)', fontSize: '1.2rem' }}>+</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={character.proficiencyBonus || 2} 
                    onChange={e => handleUpdate({ proficiencyBonus: parseInt(e.target.value) || 2 })} 
                    className="editable-input" 
                    style={{ width: '50px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }} 
                  />
                </div>
              ) : (
                <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '12px' }}>
                  +{character.proficiencyBonus || 2}
                </strong>
              )}
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
                const pb = character.proficiencyBonus || 2;
                const finalMod = isProficient ? baseMod + pb : baseMod;
                return (
                  <div key={stat} className="save-item" style={{ cursor: canEdit ? 'pointer' : 'default' }} onClick={() => {
                    if (!canEdit) return;
                    if (!isProficient && usedSavesMastery >= maxSavesMastery) return; // Limite atteinte
                    const newSaves = { ...saves, [stat]: !isProficient };
                    handleUpdate({ savingThrows: JSON.stringify(newSaves) });
                  }}>
                    <span style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
                      <div className={`skill-prof-indicator ${isProficient ? 'proficient' : ''}`} style={{ cursor: canEdit ? 'pointer' : 'default' }}></div>
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

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <section className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: 0 }}>Compétences</h3>
            <span style={{ fontSize: '0.9rem', color: usedSkillsMastery > maxSkillsMastery ? 'var(--danger, #ef4444)' : 'var(--color-text-muted)', fontWeight: 'bold' }}>
              Points utilisés : {usedSkillsMastery} / {maxSkillsMastery}
            </span>
          </div>
          <div className="skills-grid">
            {SKILLS_LIST.map(skill => {
              const profLevel = skills[skill.id] || 0; // 0=none, 1=prof, 2=exp
              const baseMod = getModifier(character[skill.ability]);
              const pb = character.proficiencyBonus || 2;
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
                    else return; // Limite atteinte
                  } else if (profLevel === 1) {
                    if (usedSkillsMastery < maxSkillsMastery) newLevel = 2;
                    else newLevel = 0; // On boucle vers 0 si on ne peut pas monter à 2
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
                    <div className={`skill-prof-indicator ${indicatorClass}`} style={{ cursor: canEdit ? 'pointer' : 'default' }}></div>
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

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <section className="glass-panel">
          <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: '12px' }}>Inventaire</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Notez ici vos objets, votre or, et votre équipement de manière libre.</p>
          {canEdit ? (
            <textarea 
              value={character.notes || ''} 
              onChange={e => handleUpdate({ notes: e.target.value })}
              className="editable-textarea"
              placeholder="Ex: 50 pièces d'or, une corde de 15m, une épée longue..."
            />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
              {character.notes || 'Inventaire vide.'}
            </div>
          )}
        </section>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-text)', marginBottom: 0 }}>Mes Notes</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Ces notes sont privées et ne peuvent pas être lues par le MJ.</p>
          
          {!isGm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <textarea 
                  id="new-note-input"
                  placeholder="Nouvelle note..." 
                  className="editable-textarea"
                  rows={2}
                  style={{ flex: 1 }}
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
                  <div key={note.id} style={{ padding: '12px', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', flex: 1 }}>{note.content}</div>
                    <button 
                      onClick={() => playerStore.deletePrivateNote(campaignId, note.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--error, #ef4444)', cursor: 'pointer', padding: '0 8px' }}
                    >
                      X
                    </button>
                  </div>
                ))}
                {(!playerStore.privateNotes || playerStore.privateNotes.length === 0) && (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>Aucune note.</div>
                )}
              </div>
            </div>
          )}
          {isGm && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px' }}>Vous n'avez pas accès aux notes privées des joueurs.</div>
          )}
        </section>
      )}
      
      {!canEdit && (
        <div className="glass-panel" style={{ marginTop: 'auto', border: '1px solid var(--warning, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--warning, #f59e0b)' }}>
          <AlertCircle size={18} />
          <span>Lecture seule. Le MJ doit autoriser l'édition de cette fiche.</span>
        </div>
      )}

      {showSkillTree && (
        <SkillTreeViewer 
          campaignId={campaignId}
          character={character}
          isGm={isGm}
          onUpdateCharacter={(data) => {
            if (isGm && onUpdate) return onUpdate(data);
            return playerStore.updateCharacter(campaignId, data);
          }}
          onClose={() => setShowSkillTree(false)}
        />
      )}
    </div>
  );
}
