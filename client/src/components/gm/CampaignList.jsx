import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGmStore } from '../../store/gmStore';

export default function CampaignList() {
  const { campaigns, isLoading, error, fetchCampaigns, setActiveCampaign } = useGmStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSelect = async (campaignId) => {
    await setActiveCampaign(campaignId);
    navigate(`/gm/campaigns/${campaignId}`);
  };

  if (isLoading) return <div className="loading-screen">Loading campaigns...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>My Campaigns</h1>
      
      {campaigns.length === 0 ? (
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't created any campaigns yet.</p>
          <button className="btn-primary">Create Campaign</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {campaigns.map(campaign => (
            <div 
              key={campaign.id} 
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                padding: '20px', 
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => handleSelect(campaign.id)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{campaign.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {campaign.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>{campaign.gameSystem}</span>
                <span>{campaign.memberCount || 0} Members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
