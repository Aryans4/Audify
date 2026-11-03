import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';

export default function ArtistGatewayModal() {
  const { user, isArtist, setUser } = useAuth();
  const { isArtistGatewayOpen, closeArtistGateway, setActivePage } = useAudio();
  const { showToast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isArtistGatewayOpen) return null;

  const handleBecomeArtist = async () => {
    setIsUpgrading(true);
    try {
      // Simulate/perform artist upgrade
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (user) {
        const updatedUser = { ...user, role: 'artist' };
        setUser(updatedUser);
        localStorage.setItem('audify_user', JSON.stringify(updatedUser));
      }

      showToast('Welcome to Audify Artist Network! Creator tools unlocked.', 'success');
      closeArtistGateway();
    } catch (err) {
      showToast('Could not complete upgrade. Please try again.', 'error');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      {/* Background preview effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0 flex flex-col gap-12 p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between p-12 bg-surface-container-low rounded-3xl">
          <div className="max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary text-label-sm uppercase font-bold">
              Artist Portal Preview
            </span>
            <h1 className="text-display-hero font-headline font-bold text-on-surface">
              Amplify your sound globally.
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-surface-container-high space-y-2">
              <div className="text-label-sm text-outline uppercase">Monthly Listeners</div>
              <div className="text-headline-md font-bold text-primary">128,450</div>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-high space-y-2">
              <div className="text-label-sm text-outline uppercase">Total Earnings</div>
              <div className="text-headline-md font-bold text-secondary">$3,420.50</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Modal Dialog Card (Stitch Screen 4 Spec) */}
      <div className="relative z-10 w-full max-w-2xl bg-surface-container-high/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex flex-col gap-6 border border-outline-variant/20 overflow-hidden my-auto">
        {/* Decorative Glow Accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm font-bold uppercase tracking-wider">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>Creator Upgrade</span>
            </div>
            <h2 className="text-headline-lg font-headline font-bold text-on-surface tracking-tight">
              Ready to share your sound?
            </h2>
            <p className="text-body-lg text-outline">
              Join Audify as an Artist and unlock publishing and creator tools.
            </p>
          </div>
          <button
            onClick={closeArtistGateway}
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-variant transition-all flex-shrink-0"
            title="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Pricing Banner */}
        <div className="p-5 rounded-2xl bg-surface-container-low flex items-center justify-between relative z-10 border border-outline-variant/10">
          <div className="space-y-1">
            <div className="text-title-sm text-on-surface font-bold">Artist Pro Pass</div>
            <div className="text-body-sm text-outline">
              Full access to distribution, analytics, & AI tools
            </div>
          </div>
          <div className="text-right">
            <div className="text-headline-sm font-headline text-primary font-bold">
              $9.99 <span className="text-body-sm text-outline font-normal">/ month</span>
            </div>
            <div className="text-body-sm text-tertiary">or ₹799 / month</div>
          </div>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
          {/* Feature 1 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">person_pin</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Artist Profile</div>
              <div className="text-body-sm text-outline">Verified badge & custom bio</div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">publish</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Music Publishing</div>
              <div className="text-body-sm text-outline">Unlimited global releases</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">album</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Albums & Releases</div>
              <div className="text-body-sm text-outline">EPs, albums, & singles setup</div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Creator Analytics</div>
              <div className="text-body-sm text-outline">Real-time stream telemetry</div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Audience Insights</div>
              <div className="text-body-sm text-outline">Demographics & top cities</div>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
            </div>
            <div>
              <div className="text-title-sm text-on-surface font-semibold">Advanced Creation Tools</div>
              <div className="text-body-sm text-outline">AI DJ, Remix Lab, & stems</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 relative z-10">
          <button
            onClick={closeArtistGateway}
            className="px-6 py-3 rounded-full text-title-sm font-bold text-on-surface hover:bg-surface-variant transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleBecomeArtist}
            disabled={isUpgrading}
            className="px-8 py-3 bg-primary text-on-primary rounded-full text-title-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
          >
            {isUpgrading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Become an Artist</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
