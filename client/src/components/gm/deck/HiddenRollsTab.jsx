import React, { useEffect, useState } from 'react';
import { useGmStore } from '../../../store/gmStore';
import api from '../../../utils/api';
import { Eye, Dices, TrendingUp, TrendingDown, Loader, Check, X } from 'lucide-react';
import { SKILLS_LIST, ABILITIES_LIST, ABILITY_LABELS } from '../../../utils/rules';

// Jets cachés et scores passifs.
//
// Les joueurs lancent leurs dés physiquement : l'application n'a rien à faire
// des jets visibles. Elle sert exactement là où le MJ doit aujourd'hui calculer
// seul — savoir qui remarque quelque chose sans le demander, et lancer un dé
// qu'un joueur ne doit pas voir.
export default function HiddenRollsTab() {
  const { activeCampaignId } = useGmStore();

  const [passive, setPassive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [characterId, setCharacterId] = useState('');
  const [rollType, setRollType] = useState('skill_check');
  const [target, setTarget] = useState('perception');
  const [dc, setDc] = useState(12);
  const [mode, setMode] = useState('normal');
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!activeCampaignId) return;
    let cancelled = false;

    setLoading(true);
    api.get(`/api/v1/gm/campaigns/${activeCampaignId}/hidden-rolls/passive`)
      .then((res) => {
        if (cancelled) return;
        setPassive(res);
        if (res.characters?.length && !characterId) {
          setCharacterId(res.characters[0].id);
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaignId]);

  const characters = passive?.characters || [];

  // Le choix de la cible change avec le type de jet : une compétence, une
  // caractéristique ou un jet de sauvegarde n'ont pas la même liste.
  useEffect(() => {
    if (rollType === 'skill_check') setTarget('perception');
    else if (rollType === 'ability_check') setTarget('wisdom');
    else if (rollType === 'saving_throw') setTarget('dexterity');
    else setTarget('');
  }, [rollType]);

  const roll = async () => {
    if (!characterId) return;
    setRolling(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        characterId,
        type: rollType,
        dc: Number(dc) || undefined,
        advantage: mode === 'advantage',
        disadvantage: mode === 'disadvantage',
      };
      if (rollType === 'skill_check') payload.skill = target;
      else payload.ability = target;

      const res = await api.post(`/api/v1/gm/campaigns/${activeCampaignId}/hidden-rolls/roll`, payload);
      setResult(res.roll);
    } catch (err) {
      setError(err.message);
    } finally {
      setRolling(false);
    }
  };

  const best = passive?.group?.highestPerception;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--danger-tint)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger, #ef4444)', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      {/* ─── Scores passifs ─────────────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
          <Eye size={15} color="#38bdf8" />
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)' }}>Scores passifs</h4>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: '0.76rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
          Ce que le groupe remarque sans lancer de dé. Inutile de demander aux joueurs.
        </p>

        {loading ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>Calcul…</p>
        ) : characters.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>Aucun personnage dans cette campagne.</p>
        ) : (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 52px 52px 52px', backgroundColor: 'var(--color-background)', fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span style={{ padding: '7px 10px' }}>Personnage</span>
              <span style={{ padding: '7px 4px', textAlign: 'center' }}>Percep.</span>
              <span style={{ padding: '7px 4px', textAlign: 'center' }}>Intui.</span>
              <span style={{ padding: '7px 4px', textAlign: 'center' }}>Inves.</span>
            </div>

            {characters.map((c) => {
              const isBest = best && best.characterId === c.id;
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 52px 52px 52px',
                    borderTop: '1px solid var(--color-border)', fontSize: '0.84rem',
                    backgroundColor: isBest ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  }}
                >
                  <span style={{ padding: '8px 10px', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </span>
                  {['perception', 'insight', 'investigation'].map((key) => (
                    <span
                      key={key}
                      style={{
                        padding: '8px 4px', textAlign: 'center', fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                        color: key === 'perception' && isBest ? '#38bdf8' : 'var(--color-text)',
                      }}
                    >
                      {c.passive[key]}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {best && (
          <p style={{ margin: '8px 0 0', fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
            Œil du groupe : <strong style={{ color: '#38bdf8' }}>{best.name}</strong>, Perception passive {best.value}.
          </p>
        )}
      </section>

      {/* ─── Jet caché ──────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
          <Dices size={15} color="#a78bfa" />
          <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)' }}>Jet caché</h4>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '0.76rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
          Lancé par l'application, visible de vous seul. Ni les joueurs ni l'écran de table n'en voient le résultat.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Personnage</span>
            <select
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              style={{ padding: '7px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
            >
              {characters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Type</span>
              <select
                value={rollType}
                onChange={(e) => setRollType(e.target.value)}
                style={{ padding: '7px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              >
                <option value="skill_check">Compétence</option>
                <option value="ability_check">Caractéristique</option>
                <option value="saving_throw">Jet de sauvegarde</option>
                <option value="initiative">Initiative</option>
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Difficulté</span>
              <input
                type="number"
                min="1"
                max="40"
                value={dc}
                onChange={(e) => setDc(e.target.value)}
                style={{ padding: '7px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              />
            </label>
          </div>

          {rollType !== 'initiative' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Cible</span>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ padding: '7px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
              >
                {rollType === 'skill_check'
                  ? SKILLS_LIST.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)
                  : ABILITIES_LIST.map((a) => <option key={a} value={a}>{ABILITY_LABELS[a]}</option>)}
              </select>
            </label>
          )}

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { key: 'advantage', label: 'Avantage', Icon: TrendingUp },
              { key: 'disadvantage', label: 'Désavantage', Icon: TrendingDown },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setMode(mode === key ? 'normal' : key)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem',
                  border: `1px solid ${mode === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  backgroundColor: mode === key ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: mode === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={roll}
            disabled={rolling || !characterId}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '9px', opacity: rolling || !characterId ? 0.55 : 1 }}
          >
            {rolling ? <Loader size={15} /> : <Dices size={15} />}
            {rolling ? 'Lancer…' : 'Lancer en secret'}
          </button>

          {result && (
            <div style={{
              padding: '12px 14px', borderRadius: '8px',
              border: `1px solid ${result.outcome === 'success' ? 'rgba(16, 185, 129, 0.5)' : result.outcome === 'failure' ? 'rgba(239, 68, 68, 0.5)' : 'var(--color-border)'}`,
              backgroundColor: result.outcome === 'success' ? 'rgba(16, 185, 129, 0.1)' : result.outcome === 'failure' ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-background)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {result.characterName} · {result.label}
                </span>
                <span style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {result.total}
                </span>
              </div>

              <div style={{ marginTop: '6px', fontSize: '0.76rem', color: 'var(--color-text-muted)', fontFamily: 'ui-monospace, monospace' }}>
                {result.details}
              </div>

              {result.dc !== null && result.dc !== undefined && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: result.outcome === 'success' ? 'var(--success, #10b981)' : 'var(--danger, #ef4444)' }}>
                  {result.outcome === 'success' ? <Check size={14} /> : <X size={14} />}
                  {result.outcome === 'success' ? 'Réussite' : 'Échec'} contre DD {result.dc}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
