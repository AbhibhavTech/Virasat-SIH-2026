import React, { useState, useEffect } from 'react';
import { ShieldAlert, ExternalLink, X, Lock } from 'lucide-react';
import { isSecureContext, INSECURE_MEDIA_ALERT_TITLE, INSECURE_MEDIA_ERROR_MESSAGE } from '../../utils/securityContext';

interface InsecureContextAlertProps {
  variant?: 'banner' | 'card' | 'inline';
  featureName?: string;
  className?: string;
  dismissible?: boolean;
}

export const InsecureContextAlert: React.FC<InsecureContextAlertProps> = ({
  variant = 'banner',
  featureName = 'Microphone access',
  className = '',
  dismissible = true,
}) => {
  const [isSecure, setIsSecure] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setIsSecure(isSecureContext());
  }, []);

  // If environment is secure (HTTPS or localhost) or user dismissed, don't show anything
  if (isSecure || dismissed) {
    return null;
  }

  const handleUpgradeToHttps = () => {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  };

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs ${className}`}
      >
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900 leading-tight">
            {INSECURE_MEDIA_ALERT_TITLE}
          </p>
          <p className="text-[11px] text-amber-800/90 mt-0.5 leading-normal">
            {featureName} is restricted by your browser over insecure HTTP. Use HTTPS or localhost.
          </p>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-700 hover:text-amber-950 rounded hover:bg-amber-100 transition cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 text-stone-900 shadow-sm space-y-3 ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span>{INSECURE_MEDIA_ALERT_TITLE}</span>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-amber-100/50 transition cursor-pointer"
              aria-label="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-xs text-stone-700 leading-relaxed font-sans">
          {INSECURE_MEDIA_ERROR_MESSAGE}
        </p>

        <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-[11px] text-stone-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Browser Security Policy</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-snug">
            The <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[10px] text-stone-800">navigator.mediaDevices.getUserMedia</code> API is strictly disabled by modern web browsers when accessed through plain HTTP on external networks.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {typeof window !== 'undefined' && window.location.protocol === 'http:' && (
            <button
              type="button"
              onClick={handleUpgradeToHttps}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Switch to HTTPS</span>
            </button>
          )}
          {dismissible && (
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium transition cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default 'banner' variant
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`px-4 py-2.5 rounded-2xl bg-amber-50/95 border border-amber-200 text-stone-900 shadow-sm flex items-start sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-start sm:items-center gap-2.5 min-w-0">
        <div className="p-1 rounded-md bg-amber-100 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="text-xs min-w-0">
          <span className="font-bold text-amber-950 block sm:inline sm:mr-2">
            {INSECURE_MEDIA_ALERT_TITLE}:
          </span>
          <span className="text-amber-900/90 leading-relaxed font-sans">
            {featureName} is restricted in insecure HTTP environments. Please run under HTTPS or on localhost to enable voice input and MediaDevices.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {typeof window !== 'undefined' && window.location.protocol === 'http:' && (
          <button
            type="button"
            onClick={handleUpgradeToHttps}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>Use HTTPS</span>
          </button>
        )}
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-800 hover:text-amber-950 rounded hover:bg-amber-100 transition cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
