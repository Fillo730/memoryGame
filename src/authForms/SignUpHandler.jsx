//Libraries
import { useState } from 'react';
import { User, Lock, BadgePlus, UserPlus, Loader} from 'lucide-react';

//Functions
import { checkPassword, checkUsername, checkName} from '../utils/checkPasswordUsername';

//Constants
import BACKEND_URL from '../utils/backendEndpoint';

//CSSFiles
import './AuthForm.css';

function SignUpHandler() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();

    const usernameCheck = checkUsername(form.username);
    if(!usernameCheck.valid) {
      setError(usernameCheck.message);
      return;
    }

    const firstNameCheck = checkName(form.firstName);
    const lastNameCheck = checkName(form.lastName);
    if(!firstNameCheck.valid || !lastNameCheck.valid) {
      setError(firstNameCheck.message || lastNameCheck.message);
      return;
    }

    const passwordCheck = checkPassword(form.password);
    if(!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setIsLoading(false);

    if (res.ok) {
      window.location.href = '/login';
    } else {
      setError(data.error || 'Registration failed');
    }
  };

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title light-color">Sign up</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={register} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">Firstname</label>
            <div className="input-wrapper">
              <UserPlus className="input-icon" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Lastname</label>
            <div className="input-wrapper">
              <BadgePlus className="input-icon" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? <Loader/> : 'Sign Up'}
          </button>
        </form>

        <div className="auth-actions">
          <button onClick={goToLogin} className="secondary-button">Login</button>
          <button onClick={goBack} className="secondary-button">Go back</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpHandler;