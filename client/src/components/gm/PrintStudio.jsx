import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { Printer, Package, Users, Download, Loader, Check, AlertTriangle } from 'lucide-react';

// Atelier d'impression.
//
// Les joueurs n'ont que leur fiche papier : tout ce qui doit exister à la table
// sort d'ici. Format imposé au cadrage : tarot agrandi ×1,5, soit 105 × 180 mm.
const CARD_FORMAT = { width: 105, height: 180 };

const RARITY = {
  common: { label: 'Courant', color: '#8a8175' },
  uncommon: { label: 'Peu courant', color: '#5b8f2a' },
  rare: { label: 'Rare', color: '#3b82f6' },
  very_rare: { label: 'Très rare', color: '#a855f7' },
  legendary: { label: 'Légendaire', color: '#d99a3f' },
};

const TYPE_LABEL = {
  weapon: 'Arme',
  armor: 'Armure',
  potion: 'Potion',
  tool: 'Outil',
  consumable: 'Consommable',
  valuable: 'Valeur',
  quest: 'Quête',
  misc: 'Divers',
};

const HIGH_RARITIES = ['rare', 'very_rare', 'legendary'];

export default function PrintStudio() {
  const { campaignId } = useParams();
  const [tab, setTab] = useState('items');
  const [data, setData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [layout, setLayout] = useState('planche');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (!campaignId) return;
    let cancelled = false;

    api.get(`/api/v1/gm/campaigns/${campaignId}/exports/preview`)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); });

    return () => { cancelled = true; };
  }, [campaignId]);

  const items = data?.items || [];
  const characters = data?.characters || [];

  const selection = tab === 'items' ? selectedItems : selectedCharacters;
  const setSelection = tab === 'items' ? setSelectedItems : setSelectedCharacters;

  const toggle = (id) => {
    setDone(null);
    setSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setDone(null);
    const all = (tab === 'items' ? items : characters).map((x) => x.id);
    setSelection(selection.length === all.length ? [] : all);
  };

  const selectHighRarity = () => {
    setDone(null);
    setSelectedItems(items.filter((i) => HIGH_RARITIES.includes(i.rarity)).map((i) => i.id));
  };

  const counts = useMemo(() => ({
    items: selectedItems.length,
    characters: selectedCharacters.length,
  }), [selectedItems, selectedCharacters]);

  const totalSelected = counts.items + counts.characters;

  const download = async () => {
    if (totalSelected === 0) return;
    setBusy(true);
    setError(null);
    setDone(null);

    try {
      const files = [];

      if (counts.items > 0) {
        files.push({
          url: `/api/v1/gm/campaigns/${campaignId}/exports/items?layout=${layout}&ids=${selectedItems.join(',')}`,
          name: `objets-${layout}.pdf`,
        });
      }
      if (counts.characters > 0) {
        files.push({
          url: `/api/v1/gm/campaigns/${campaignId}/exports/characters?layout=${layout}&ids=${selectedCharacters.join(',')}`,
          name: `personnages-${layout}.pdf`,
        });
      }

      for (const file of files) {
        const res = await fetch(file.url, { headers: api.getHeaders() });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Échec de la génération du PDF");
        }
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      }

      setDone(files.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const allOfTab = tab === 'items' ? items : characters;
  const allSelected = allOfTab.length > 0 && selection.length === allOfTab.length;

  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 8px', color: 'var(--color-text)', fontSize: '1.6rem' }}>
          <Printer size={24} color="var(--color-primary)" />
          Atelier d'impression
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Cartes au format {CARD_FORMAT.width} × {CARD_FORMAT.height} mm — tarot agrandi ×1,5.
        </p>
      </header>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', backgroundColor: 'var(--danger-tint)', border: '1px solid rgba(239, 68, 68, 0.4)', color: 'var(--danger, #ef4444)', fontSize: '0.9rem' }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {done && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', backgroundColor: 'var(--success-tint)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--success, #10b981)', fontSize: '0.9rem' }}>
          <Check size={16} /> {done} fichier{done > 1 ? 's' : ''} PDF téléchargé{done > 1 ? 's' : ''}.
        </div>
      )}

      {/* Onglets */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[
          { key: 'items', label: 'Objets', icon: Package, count: items.length },
          { key: 'characters', label: 'Personnages', icon: Users, count: characters.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setDone(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
              border: `1px solid ${tab === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
              backgroundColor: tab === key ? 'rgba(99, 102, 241, 0.15)' : 'var(--color-surface)',
              color: tab === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: tab === key ? 600 : 400,
            }}
          >
            <Icon size={15} /> {label} ({count})
          </button>
        ))}
      </div>

      {/* Mise en page */}
      <section style={{ marginBottom: '20px', padding: '16px', borderRadius: '10px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--color-text)' }}>Mise en page</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'planche', label: 'Planche A4', hint: '2 cartes par feuille paysage, traits de coupe — impression domestique' },
            { key: 'card', label: 'Une carte par page', hint: `${CARD_FORMAT.width} × ${CARD_FORMAT.height} mm exact — imprimeur ou papier prédécoupé` },
          ].map(({ key, label, hint }) => (
            <button
              key={key}
              onClick={() => setLayout(key)}
              style={{
                flex: '1 1 260px', textAlign: 'left', padding: '12px 14px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${layout === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: layout === key ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{hint}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Sélection */}
      <section style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text)' }}>
            Sélection — {selection.length} sur {allOfTab.length}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {tab === 'items' && (
              <button className="btn-secondary" onClick={selectHighRarity} style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
                Rares et plus
              </button>
            )}
            <button className="btn-secondary" onClick={toggleAll} style={{ fontSize: '0.8rem', padding: '5px 10px' }}>
              {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
          </div>
        </div>

        {!data ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>Chargement…</p>
        ) : allOfTab.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {tab === 'items' ? 'Aucun objet dans cette campagne.' : 'Aucun personnage dans cette campagne.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
            {tab === 'items' && items.map((item) => {
              const rarity = RARITY[item.rarity] || RARITY.common;
              const checked = selectedItems.includes(item.id);
              return (
                <label
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                    padding: '10px 12px', borderRadius: '8px',
                    border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: checked ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-background)',
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '3px' }}>
                      <span style={{ color: rarity.color, fontWeight: 600 }}>{rarity.label}</span>
                      {item.type && (
                        <span style={{ color: 'var(--color-text-muted)' }}>· {TYPE_LABEL[item.type] || item.type}</span>
                      )}
                    </span>
                  </span>
                </label>
              );
            })}

            {tab === 'characters' && characters.map((character) => {
              const checked = selectedCharacters.includes(character.id);
              return (
                <label
                  key={character.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                    padding: '10px 12px', borderRadius: '8px',
                    border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: checked ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-background)',
                  }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(character.id)} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {character.name}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                      Niveau {character.level}{character.class ? ` · ${character.class}` : ''}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      <button
        className="btn-primary"
        onClick={download}
        disabled={busy || totalSelected === 0}
        style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '12px 22px', fontSize: '0.95rem',
          opacity: busy || totalSelected === 0 ? 0.55 : 1,
          cursor: busy || totalSelected === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {busy ? <Loader size={17} className="spin" /> : <Download size={17} />}
        {busy
          ? 'Génération du PDF…'
          : totalSelected === 0
            ? 'Sélectionnez au moins une carte'
            : `Télécharger ${totalSelected} carte${totalSelected > 1 ? 's' : ''} en PDF`}
      </button>
    </div>
  );
}
