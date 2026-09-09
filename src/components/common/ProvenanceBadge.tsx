import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Users, Clock, Compass, ExternalLink } from 'lucide-react';

export type ProvenanceType =
  | 'OFFICIAL'
  | 'TRUSTED_THIRD_PARTY'
  | 'COMMUNITY_REPORTED'
  | 'MODELLED'
  | 'ESTIMATED'
  | 'STALE'
  | 'UNVERIFIED'
  // Support lowercase database variants
  | 'official'
  | 'trusted_third_party'
  | 'community_reported'
  | 'modelled'
  | 'estimated'
  | 'stale'
  | 'unverified'
  // Legacy aliases
  | 'VERIFIED_SECONDARY'
  | 'COMMUNITY'
  | 'SIMULATED DEMO DATA';

interface ProvenanceBadgeProps {
  type?: ProvenanceType | string;
  sourceText?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  confidenceScore?: number;
  className?: string;
  size?: 'sm' | 'md';
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type = 'UNVERIFIED',
  sourceText,
  sourceUrl,
  verifiedAt,
  confidenceScore,
  className = '',
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const normalized = (type || 'UNVERIFIED').toString().toUpperCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'OFFICIAL':
        return {
          label: 'ASI / GOVT VERIFIED',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
          icon: ShieldCheck,
          defaultSource: 'Archaeological Survey of India (ASI) / Ministry of Tourism / Official Portal',
          confidence: 'Official Tier 1 (100%)',
        };
      case 'TRUSTED_THIRD_PARTY':
      case 'VERIFIED_SECONDARY':
        return {
          label: 'UNESCO / CURATED',
          bg: 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100',
          icon: CheckCircle2,
          defaultSource: 'UNESCO World Heritage Centre / Sahapedia / INTACH / Audited Registry',
          confidence: 'Trusted Tier 2 (95%)',
        };
      case 'COMMUNITY_REPORTED':
      case 'COMMUNITY':
        return {
          label: 'COMMUNITY REPORTED',
          bg: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100',
          icon: Users,
          defaultSource: 'Verified Field Contributor / Citizen Heritage Researcher',
          confidence: 'Community Tier 4 (75%)',
        };
      case 'MODELLED':
      case 'SIMULATED DEMO DATA':
        return {
          label: 'MODELLED',
          bg: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
          icon: Cpu,
          defaultSource: 'Algorithmic calculation from official transit schedules and road transit benchmarks.',
          confidence: 'Modelled / Calculated',
        };
      case 'ESTIMATED':
        return {
          label: 'ESTIMATED',
          bg: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100',
          icon: Compass,
          defaultSource: 'Derived from nearby transit stops, regional averages, or seasonal parameters.',
          confidence: 'Estimated Approximation',
        };
      case 'STALE':
        return {
          label: 'STALE — RE-CHECK REQUIRED',
          bg: 'bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100',
          icon: Clock,
          defaultSource: 'Previously verified, but past its scheduled 12-month re-verification window.',
          confidence: 'Needs Fresh Audit',
        };
      case 'UNVERIFIED':
      default:
        return {
          label: 'UNVERIFIED — PENDING AUDIT',
          bg: 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200',
          icon: AlertTriangle,
          defaultSource: 'Provisional record pending official archival corroboration or field inspection.',
          confidence: 'Unverified Legacy Data',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1 rounded-md font-semibold border tracking-wide transition-colors cursor-help ${
          isSmall ? 'px-1.5 py-0.2 text-[10px]' : 'px-2 py-0.5 text-[11px]'
        } ${config.bg} ${className}`}
        aria-label={`Data Provenance: ${config.label}`}
      >
        <Icon className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} flex-shrink-0`} />
        <span>{config.label}</span>
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-white text-stone-800 rounded-lg shadow-xl border border-stone-200 z-50 text-xs font-normal pointer-events-auto transition-all"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 mb-1.5">
            <span className="font-bold text-[10px] text-stone-900 tracking-wider">PROVENANCE METRIC</span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {config.confidence}
            </span>
          </div>

          <p className="text-stone-600 leading-relaxed text-[11px]">
            {sourceText || config.defaultSource}
          </p>

          {sourceUrl && (
            <div className="mt-2 pt-1.5 border-t border-stone-100">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline"
              >
                <span>Check Official Source Authority</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {verifiedAt && (
            <div className="mt-1 text-[10px] text-stone-400">
              Audited: {new Date(verifiedAt).toLocaleDateString()}
            </div>
          )}

          {confidenceScore !== undefined && (
            <div className="mt-1 text-[10px] text-stone-500 font-medium">
              Confidence Score: {confidenceScore}%
            </div>
          )}
        </div>
      )}
    </div>
  );
};
