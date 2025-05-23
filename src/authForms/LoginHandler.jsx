//Libraries
import { useState } from 'react';
import { User, Lock, Loader} from 'lucide-react';

//Constants
import BACKEND_URL from '../utils/backendEndpoint';

//CSSFiles
import './AuthForm.css';

function LoginHandler() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (e) => {
    e.preventDefault();

    if(username.trim() === '' || password.trim() === '') {
      setError('Username and password cannot be empty');
      return; 
    }

    setIsLoading(true);
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    setIsLoading(false);

    if (res.ok) {
      window.location.href = '/home';
      localStorage.setItem('token', data.token);
    } else {
      setError(data.error || 'Error while trying to login');
    }
  };

  const goToRegister = () => {
    window.location.href = '/sign-up';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title light-color">Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={login} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? <Loader/> : 'Login'}
          </button>
        </form>

        <div className="auth-actions">
          <button onClick={goToRegister} className="secondary-button">Sign up</button>
          <button onClick={goBack} className="secondary-button">Go back</button>
        </div>
      </div>
    </div>
  );
}

export default LoginHandler;