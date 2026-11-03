import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authTab, setAuthTab, login, register } = useAuth();
  const { showToast } = useToast();

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // Register form state
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState('user');
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass.trim()) {
      showToast('Please enter both username and password', 'error');
      return;
    }

    setIsLoginSubmitting(true);
    try {
      await login(loginUser.trim(), loginPass);
      setLoginUser('');
      setLoginPass('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regUser.trim() || !regEmail.trim() || !regPass.trim()) {
      showToast('Please fill in all registration fields', 'error');
      return;
    }

    setIsRegSubmitting(true);
    try {
      await register(regUser.trim(), regEmail.trim(), regPass, regRole);
      setRegUser('');
      setRegEmail('');
      setRegPass('');
      setRegRole('user');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      if (msg.toLowerCase().includes('already exists')) {
        showToast('Account already exists! Please sign in with your password.', 'info');
        setLoginUser(regUser.trim());
        setAuthTab('login');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setIsRegSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modal-auth"
      onClick={(e) => {
        if (e.target.id === 'modal-auth') closeAuthModal();
      }}
    >
      <div className="modal-card">
        <button className="modal-close" id="btn-close-auth" onClick={closeAuthModal}>
          &times;
        </button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
            id="tab-login"
            onClick={() => setAuthTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
            id="tab-register"
            onClick={() => setAuthTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {authTab === 'login' ? (
          <form id="form-login" className="modal-form" onSubmit={handleLoginSubmit}>
            <div className="form-header">
              <h3>Welcome Back</h3>
              <p>Sign in to access your library and release music</p>
            </div>

            <div className="input-group">
              <label htmlFor="login-username">Username</label>
              <input
                type="text"
                id="login-username"
                required
                placeholder="Enter your username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                required
                placeholder="Enter your password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isLoginSubmitting}>
              {isLoginSubmitting ? 'Signing in...' : 'Sign In to Audify'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form id="form-register" className="modal-form" onSubmit={handleRegisterSubmit}>
            <div className="form-header">
              <h3>Create an Account</h3>
              <p>Join the next generation high-fidelity audio platform</p>
            </div>

            <div className="input-group">
              <label htmlFor="reg-username">Username</label>
              <input
                type="text"
                id="reg-username"
                required
                placeholder="Pick a unique username"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                type="email"
                id="reg-email"
                required
                placeholder="you@domain.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                type="password"
                id="reg-password"
                required
                placeholder="Create a strong password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label-with-hint">
                <span>Account Type</span>
                <span className="label-hint">Choose your experience</span>
              </label>
              <div className="role-selector-dual">
                <div
                  className={`role-choice-card ${regRole === 'user' ? 'selected' : ''}`}
                  onClick={() => setRegRole('user')}
                >
                  <div className="role-choice-header">
                    <div className="role-choice-icon-wrap role-icon-listener">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                      </svg>
                    </div>
                    <div className="role-choice-title-meta">
                      <div className="role-choice-title">Listener</div>
                      <span className="role-choice-pill pill-listener">STREAMING</span>
                    </div>
                    <div className="role-radio-dot"></div>
                  </div>
                  <ul className="role-features-list">
                    <li>✓ High-fidelity audio streaming</li>
                    <li>✓ Liked songs & favorites</li>
                    <li>✓ Real-time synced lyrics & FX</li>
                    <li>✓ Track comments & discovery</li>
                  </ul>
                </div>

                <div
                  className={`role-choice-card ${regRole === 'artist' ? 'selected artist-highlight' : ''}`}
                  onClick={() => setRegRole('artist')}
                >
                  <div className="role-choice-header">
                    <div className="role-choice-icon-wrap role-icon-artist">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div className="role-choice-title-meta">
                      <div className="role-choice-title">Artist</div>
                      <span className="role-choice-pill pill-artist">CREATOR STUDIO</span>
                    </div>
                    <div className="role-radio-dot"></div>
                  </div>
                  <ul className="role-features-list">
                    <li>★ <strong>All Listener perks included</strong></li>
                    <li>★ Dedicated <strong>Artist Studio UI</strong></li>
                    <li>★ Upload & release single songs</li>
                    <li>★ Curate & publish multi-track albums</li>
                  </ul>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isRegSubmitting}>
              {isRegSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
