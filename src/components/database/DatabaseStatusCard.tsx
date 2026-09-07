import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { DatabaseStatusResponse } from '../../types';

interface DatabaseStatusCardProps {
  onOpenModal: () => void;
  className?: string;
}

export const DatabaseStatusCard: React.FC<DatabaseStatusCardProps> = ({
  onOpenModal,
  className = '',
}) => {
  const [status, setStatus] = useState<DatabaseStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const data = await api.getDatabaseStatus();
        if (isMounted) setStatus(data);
      } catch (err) {
        console.error('Error fetching database status badge:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      id="database-status-card"
      onClick={onOpenModal}
      className={`p-3.5 rounded-xl bg-white border border-stone-200 hover:border-amber-700/50 hover:shadow-sm transition cursor-pointer flex items-center justify-between gap-3 text-stone-800 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900">
              Master Tourism Database
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
              Live
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            {loading ? (
              'Querying data layer...'
            ) : (
              `${status?.total_records.toLocaleString() || 0} records across 11 master categories`
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-amber-800">
        <span className="hidden sm:inline">Status</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};
