import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Auth.css';

function Login() {
  const [pseudo, setPseudo] = useState('');
  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    useAuthStore.setState({ error: null, isLoading: false });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pseudo.trim()) return;
    const result = await login(pseudo.trim());
    if (result.success) {
      navigate('/gm');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Connexion</h1>
        <p>Connectez-vous à GM Helper avec votre pseudo</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
              placeholder="Votre pseudo en jeu"
              autoFocus
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="auth-footer">
          Pas encore de compte ? <Link to="/register">S'inscrire ici</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
