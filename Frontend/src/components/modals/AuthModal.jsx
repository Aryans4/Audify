import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/auth.css';

export default function AuthModal({ isOpen = false, onClose }) {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authTab,
    setAuthTab,
    login,
    register,
    requestPasswordReset,
    resetPassword,
  } = useAuth();
  const { showToast } = useToast();
  const resetParams = new URLSearchParams(window.location.search);
  const resetToken = resetParams.get('resetToken') || '';

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [regRole, setRegRole] = useState('user');
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [resetPass, setResetPass] = useState('');
  const [resetPassConfirm, setResetPassConfirm] = useState('');
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);

  const modalOpen = isOpen || isAuthModalOpen;
  const handleClose = onClose || closeAuthModal;

  if (!modalOpen) return null;

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
      handleClose();
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
    if (regPass !== regPassConfirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsRegSubmitting(true);
    try {
      await register(regUser.trim(), regEmail.trim(), regPass, regRole);
      setRegUser('');
      setRegEmail('');
      setRegPass('');
      setRegPassConfirm('');
      setRegRole('user');
      handleClose();
    } catch (err) {
      const msg = err.message || 'Registration failed';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already in use')) {
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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsRecoverySubmitting(true);
    try {
      await requestPasswordReset(forgotEmail.trim());
      setForgotSubmitted(true);
    } catch (err) {
      showToast(err.message || 'Could not request a password reset', 'error');
    } finally {
      setIsRecoverySubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken) {
      showToast('This password reset link is incomplete. Request a new one.', 'error');
      return;
    }
    if (resetPass !== resetPassConfirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsRecoverySubmitting(true);
    try {
      await resetPassword({ token: resetToken, password: resetPass });
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`);
      setAuthTab('login');
      setResetPass('');
      setResetPassConfirm('');
      showToast('Password reset. Sign in with your new password.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not reset your password', 'error');
    } finally {
      setIsRecoverySubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay auth-modal-overlay"
      id="modal-auth"
      onClick={(e) => {
        if (e.target.id === 'modal-auth') handleClose();
      }}
    >
      <div className="modal-card auth-modal-card">
        <button className="modal-close" id="btn-close-auth" onClick={handleClose}>
          &times;
        </button>

        {(authTab === 'login' || authTab === 'register') && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
              id="tab-login"
              onClick={() => setAuthTab('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
              id="tab-register"
              onClick={() => setAuthTab('register')}
            >
              Register
            </button>
          </div>
        )}

        {authTab === 'login' ? (
          <form id="form-login" className="modal-form" onSubmit={handleLoginSubmit}>
            <div className="form-header">
              <h3>Welcome Back</h3>
              <p>Sign in to access your library and release music</p>
            </div>

            <div className="input-group">
              <label htmlFor="login-username">Username or email</label>
              <input
                type="text"
                id="login-username"
                required
                autoComplete="username"
                placeholder="Enter your username or email"
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
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="auth-text-button"
              onClick={() => {
                setForgotSubmitted(false);
                setAuthTab('forgot');
              }}
            >
              Forgot password?
            </button>
            <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isLoginSubmitting}>
              {isLoginSubmitting ? 'Signing in...' : 'Sign In to Audify'}
            </button>
          </form>
        ) : authTab === 'register' ? (
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
                minLength={3}
                maxLength={30}
                autoComplete="username"
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
                autoComplete="email"
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
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password-confirm">Confirm password</label>
              <input
                type="password"
                id="reg-password-confirm"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={regPassConfirm}
                onChange={(e) => setRegPassConfirm(e.target.value)}
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

            <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isRegSubmitting}>
              {isRegSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : authTab === 'forgot' ? (
          <form id="form-forgot-password" className="modal-form" onSubmit={handleForgotSubmit}>
            <div className="form-header">
              <h3>Reset your password</h3>
              <p>Enter the email address on your account and we’ll send a secure reset link.</p>
            </div>
            {forgotSubmitted ? (
              <p className="auth-recovery-message" role="status">
                If an account exists for that email, a password reset link has been sent.
              </p>
            ) : (
              <>
                <div className="input-group">
                  <label htmlFor="forgot-email">Email address</label>
                  <input
                    type="email"
                    id="forgot-email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isRecoverySubmitting}>
                  {isRecoverySubmitting ? 'Sending link...' : 'Email me a reset link'}
                </button>
              </>
            )}
            <button type="button" className="auth-text-button" onClick={() => setAuthTab('login')}>
              Back to sign in
            </button>
          </form>
        ) : (
          <form id="form-reset-password" className="modal-form" onSubmit={handleResetSubmit}>
            <div className="form-header">
              <h3>Choose a new password</h3>
              <p>Your reset link is valid for 30 minutes and can only be used once.</p>
            </div>
            <div className="input-group">
              <label htmlFor="reset-password">New password</label>
              <input
                type="password"
                id="reset-password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={resetPass}
                onChange={(e) => setResetPass(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="reset-password-confirm">Confirm new password</label>
              <input
                type="password"
                id="reset-password-confirm"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Enter your new password again"
                value={resetPassConfirm}
                onChange={(e) => setResetPassConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isRecoverySubmitting}>
              {isRecoverySubmitting ? 'Updating password...' : 'Set new password'}
            </button>
            <button type="button" className="auth-text-button" onClick={() => setAuthTab('login')}>
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
