import React from 'react';
import { Camera, ShieldCheck } from 'lucide-react';

interface OfficialImagePendingProps {
  className?: string;
  heightClass?: string;
  label?: string;
  showBadge?: boolean;
}

export const OfficialImagePending: React.FC<OfficialImagePendingProps> = ({
  className = '',
  heightClass = 'h-48',
  label = 'Official image pending',
  showBadge = true,
}) => {
  return (
    <div
      className={`relative w-full ${heightClass} bg-gradient-to-br from-stone-100 via-amber-50/40 to-stone-200 border border-stone-200/80 rounded-xl flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden ${className}`}
    >
      {/* Decorative subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#884a20_1px,transparent_1px)] [background-size:12px_12px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 mb-2 shadow-sm">
          <Camera className="w-6 h-6" />
        </div>
        <p className="text-stone-700 font-medium text-sm">{label}</p>
        <p className="text-stone-500 text-xs mt-0.5 max-w-[200px]">
          Verified archival imagery under official acquisition
        </p>

        {showBadge && (
          <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-600 text-[11px] font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Record verified</span>
          </div>
        )}
      </div>
    </div>
  );
};
