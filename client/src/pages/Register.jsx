import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

function Register() {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const { register, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ firstName, lastName, pseudo });
    if (result.success) {
      navigate('/gm');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Créer un compte</h1>
        <p>Rejoindre GM Helper</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Votre nom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Votre prénom"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
              placeholder="Votre pseudo en jeu"
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>
        
        <div className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter ici</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
