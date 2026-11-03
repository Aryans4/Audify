import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../services/api';

const BOT_SPAM_REGEX = /(t\.me|telegram|whatsapp|wa\.me|bit\.ly|tinyurl|http:\/\/|https:\/\/|free promo|repost to \d+k|dm me on ig|check my bio|soundclout|buy followers)/i;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function CommentsDrawer() {
  const { audioRef, currentTrack, isCommentsOpen, toggleComments, seekTo, updateTrackComments } = useAudio();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [text, setText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSpamWarning, setHasSpamWarning] = useState(false);

  const comments = currentTrack?.comments || [];
  const title = currentTrack ? currentTrack.title : 'Track Notes';
  const artist = currentTrack
    ? typeof currentTrack.artist === 'string'
      ? currentTrack.artist
      : currentTrack.artist?.username || 'Artist'
    : 'Artist';

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    setHasSpamWarning(BOT_SPAM_REGEX.test(val));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!user) {
      openAuthModal('login');
      showToast('Sign in with your verified Audify account to post notes', 'info');
      return;
    }

    if (!currentTrack) {
      showToast('Select a track first', 'info');
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      showToast('Please write a note before submitting', 'error');
      return;
    }

    if (BOT_SPAM_REGEX.test(trimmed)) {
      showToast('Blocked by Audify Anti-Bot Shield: Promotional spam is prohibited.', 'error');
      return;
    }

    const audio = audioRef.current;
    const timestamp = isPinned && audio && audio.duration ? Math.floor(audio.currentTime) : 0;

    setIsSubmitting(true);
    try {
      const res = await apiFetch(`/api/music/${currentTrack._id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: trimmed, timestamp }),
      });

      showToast('Verified community note posted!', 'success');
      setText('');
      setHasSpamWarning(false);
      updateTrackComments(currentTrack._id, res.comments || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCommentsOpen) return null;

  return (
    <aside className="comments-drawer" id="comments-drawer">
      <div className="comments-header">
        <div>
          <div className="verified-shield-badge">
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>
            </svg>
            <span>Verified Notes &bull; Anti-Bot</span>
          </div>
          <h3 className="comments-title" id="comments-track-title">
            {title}
          </h3>
          <p className="comments-artist" id="comments-artist">
            {artist}
          </p>
        </div>
        <button className="btn-close-drawer" id="btn-close-comments" onClick={toggleComments}>
          &times;
        </button>
      </div>

      {/* Note Composer */}
      <div className="comment-composer-box">
        {!user ? (
          <div className="comment-login-cta" id="comment-login-cta">
            <p>Sign in to post verified timestamps & studio notes.</p>
            <button className="btn btn-sm btn-primary" id="btn-comment-login" onClick={() => openAuthModal('login')}>
              Sign In to Post
            </button>
          </div>
        ) : (
          <div className="comment-composer-inner" id="comment-composer-inner">
            <div className="comment-composer-meta">
              <label className="comment-timestamp-toggle" title="Pin note to current playback time">
                <input
                  type="checkbox"
                  id="comment-pin-timestamp"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <span>Pin to timestamp</span>
              </label>
              <span className="comment-char-count" id="comment-char-count">
                {text.length}/300
              </span>
            </div>

            <textarea
              id="comment-input-text"
              className="comment-textarea"
              placeholder="Leave a verified studio note, harmonic observation, or lyrics reaction..."
              maxLength={300}
              value={text}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />

            {hasSpamWarning && (
              <div className="comment-bot-warning" id="comment-bot-warning">
                ⚠️ Promo/bot links & spam patterns are blocked by Audify Anti-Bot Shield.
              </div>
            )}

            <button
              className="btn btn-sm btn-primary comment-submit-btn"
              id="btn-submit-comment"
              onClick={handleSubmit}
              disabled={isSubmitting || hasSpamWarning || !text.trim()}
            >
              {isSubmitting ? (
                <span>Posting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Post Note</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="comments-list" id="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36" style={{ opacity: 0.4 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No notes for this track yet.</p>
            <span>Be the first verified listener to pin a note!</span>
          </div>
        ) : (
          comments.map((c, i) => {
            const author = typeof c.user === 'string' ? c.user : c.user?.username || 'Verified Listener';
            const initial = (author || 'V').charAt(0).toUpperCase();
            const dateStr = c.createdAt
              ? new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : 'Recently';

            return (
              <div key={c._id || i} className="comment-item">
                <div className="comment-item-avatar">{initial}</div>
                <div className="comment-item-content">
                  <div className="comment-item-header">
                    <span className="comment-item-author">{author}</span>
                    <span className="verified-check" title="Verified Human Listener">✓</span>
                    {c.timestamp > 0 && (
                      <button
                        className="comment-timestamp-badge"
                        title="Click to jump audio to timestamp"
                        onClick={() => {
                          seekTo(c.timestamp);
                          showToast(`Jumped to note at ${formatTime(c.timestamp)}`, 'info');
                        }}
                      >
                        ⏱ {formatTime(c.timestamp)}
                      </button>
                    )}
                    <span className="comment-item-time">{dateStr}</span>
                  </div>
                  <p className="comment-item-text">{c.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
