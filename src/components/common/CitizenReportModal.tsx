import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Info,
  Building,
} from 'lucide-react';
import { api } from '../../services/api';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeId?: string;
  placeName?: string;
  city?: string;
  onSuccess?: () => void;
}

const ISSUE_CATEGORIES = [
  { id: 'cleanliness', label: 'Cleanliness & Waste', icon: '🧹' },
  { id: 'structural_damage', label: 'Structural Damage', icon: '🏛️' },
  { id: 'vandalism', label: 'Vandalism / Graffiti', icon: '🎨' },
  { id: 'overcrowding', label: 'Overcrowding & Safety', icon: '⚠️' },
  { id: 'accessibility', label: 'Accessibility Obstacle', icon: '♿' },
  { id: 'signage', label: 'Missing / Broken Signage', icon: '🪧' },
  { id: 'ticket_fraud', label: 'Ticket Fraud / Scalping', icon: '🎫' },
  { id: 'other', label: 'Other Issue', icon: '📝' },
];

const SEVERITIES = [
  { id: 'low', label: 'Low', desc: 'Minor cosmetic', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  { id: 'medium', label: 'Medium', desc: 'Noticeable issue', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  { id: 'high', label: 'High', desc: 'Urgent attention', color: 'bg-orange-50 text-orange-800 border-orange-300' },
  { id: 'critical', label: 'Critical', desc: 'Safety/Structural risk', color: 'bg-rose-50 text-rose-800 border-rose-300' },
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  placeId,
  placeName = 'Heritage Site',
  city = 'India',
  onSuccess,
}) => {
  const [issueType, setIssueType] = useState('cleanliness');
  const [severity, setSeverity] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      setError('Please provide at least 10 characters describing the issue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createReport({
        site_id: placeId || 'general',
        site_name: placeName,
        city,
        issue_category: issueType,
        severity,
        description: description.trim(),
        image_url: mediaUrl.trim() || undefined,
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setDescription('');
        setMediaUrl('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF8F5] border-b border-[#EFE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#FF671F]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Citizen Heritage Stewardship
              </h3>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Building className="w-3 h-3 text-stone-400" />
                <span>{placeName} ({city})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-stone-900">
                Report Successfully Logged
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                Thank you for protecting India's heritage. Your observation has been queued in the National Heritage Stewardship Audit log for inspection.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ISSUE_CATEGORIES.map((cat) => {
                    const isSelected = issueType === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setIssueType(cat.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-orange-50 border-[#FF671F] text-[#FF671F] font-bold shadow-xs'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span className="leading-tight line-clamp-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Severity Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Observed Severity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SEVERITIES.map((sev) => {
                    const isSelected = severity === sev.id;
                    return (
                      <button
                        key={sev.id}
                        type="button"
                        onClick={() => setSeverity(sev.id)}
                        className={`p-2 rounded-xl border text-xs text-center transition ${
                          isSelected
                            ? 'ring-2 ring-[#FF671F] border-[#FF671F] font-bold ' + sev.color
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <div>{sev.label}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{sev.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Report Summary / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Broken railing along western terrace"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF671F]"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Provide precise location, physical condition, or safety concerns..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF671F]"
                />
              </div>

              {/* Photo Evidence URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-stone-400" />
                  Photo Proof / Evidence URL (Optional)
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.example.com/damage-proof.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF671F]"
                />
              </div>

              {/* Provenance Notice */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-[11px] text-stone-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Reports are logged with immutable audit timestamps and reviewed by designated heritage officers and conservation moderators under SIH 2026 Guidelines.
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF671F] hover:bg-[#E65100] transition shadow-warm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <span>Submit Citizen Report</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
