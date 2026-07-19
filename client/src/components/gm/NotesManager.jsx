import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import api from '../../utils/api';

export default function NotesManager() {
  const { campaignId } = useParams();
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [campaignId]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const data = await api.get(`/api/v1/gm/campaigns/${campaignId}/notes`);
      setNotes(data.notes || data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingNote({ title: 'New Note', content: '', type: 'general' });
  };

  const handleSave = async () => {
    if (!editingNote.title) return;
    try {
      if (editingNote.id) {
        // Update
        const data = await api.put(`/api/v1/gm/campaigns/${campaignId}/notes/${editingNote.id}`, editingNote);
        setNotes(notes.map(n => n.id === data.note.id ? data.note : n));
      } else {
        // Create
        const data = await api.post(`/api/v1/gm/campaigns/${campaignId}/notes`, editingNote);
        setNotes([data.note, ...notes]);
      }
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/api/v1/gm/campaigns/${campaignId}/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      if (editingNote?.id === id) setEditingNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="loading-screen">Loading notes...</div>;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar for Notes List */}
      <div style={{ width: '300px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--color-primary)" /> Notes
          </h2>
          <button className="btn-primary" onClick={handleCreateNew} style={{ padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
            <Plus size={16} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>No notes yet.</p>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                onClick={() => setEditingNote(note)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '4px', 
                  backgroundColor: editingNote?.id === note.id ? 'var(--color-background)' : 'transparent',
                  border: `1px solid ${editingNote?.id === note.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '4px' }}>{note.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(note.updatedAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
        {editingNote ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <input 
                value={editingNote.title} 
                onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', borderBottom: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)', padding: '8px 0', width: '50%' }}
                placeholder="Note Title"
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                {editingNote.id && (
                  <button className="btn-secondary" onClick={() => handleDelete(editingNote.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger, #ef4444)' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                )}
                <button className="btn-secondary" onClick={() => setEditingNote(null)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <X size={16} /> Cancel
                </button>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingNote({...editingNote, content: editingNote.content + '**Bold**'})} style={{ padding: '4px 8px', fontSize: '0.9rem' }}><b>B</b></button>
                <button type="button" className="btn-secondary" onClick={() => setEditingNote({...editingNote, content: editingNote.content + '*Italic*'})} style={{ padding: '4px 8px', fontSize: '0.9rem' }}><i>I</i></button>
                <button type="button" className="btn-secondary" onClick={() => setEditingNote({...editingNote, content: editingNote.content + '\n# Heading\n'})} style={{ padding: '4px 8px', fontSize: '0.9rem' }}>H1</button>
                <button type="button" className="btn-secondary" onClick={() => setEditingNote({...editingNote, content: editingNote.content + '\n- List item'})} style={{ padding: '4px 8px', fontSize: '0.9rem' }}>List</button>
                <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Markdown supported</span>
              </div>
              <textarea 
                value={editingNote.content || ''}
                onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                style={{ flex: 1, padding: '16px', border: 'none', backgroundColor: 'transparent', color: 'var(--color-text)', resize: 'none', fontSize: '1rem', fontFamily: 'monospace' }}
                placeholder="Start writing in markdown..."
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)' }}>
            Select a note or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}
