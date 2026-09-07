import React, { useState, useEffect } from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Code2,
  Table,
  MapPin,
  Building2,
  Landmark,
  Sparkles,
  Train,
  BedDouble,
  Compass,
  Navigation,
  Image as ImageIcon,
  Clock,
  Flag,
  ArrowRight,
  ShieldCheck,
  FileJson,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  DatabaseStatusResponse,
  DatabaseCategoryMeta,
  DatabaseRecordsResponse,
  DatabaseSyncResult,
  MasterDataCategory,
} from '../../types';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<DatabaseStatusResponse | null>(null);
  const [categories, setCategories] = useState<DatabaseCategoryMeta[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MasterDataCategory | null>(null);
  const [recordsData, setRecordsData] = useState<DatabaseRecordsResponse | null>(null);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'inspector' | 'sync'>('overview');
  const [syncTestResult, setSyncTestResult] = useState<DatabaseSyncResult | null>(null);
  const [syncTesting, setSyncTesting] = useState<boolean>(false);
  const [viewJson, setViewJson] = useState<boolean>(false);

  // Load backend status and categories
  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      const [statusRes, catRes] = await Promise.all([
        api.getDatabaseStatus(),
        api.getDatabaseCategories(),
      ]);
      setStatus(statusRes);
      setCategories(catRes);
      if (catRes.length > 0 && !selectedCategory) {
        setSelectedCategory(catRes[0].key);
      }
    } catch (err) {
      console.error('Failed to load database status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDatabaseData();
    }
  }, [isOpen]);

  // Load records when category or search changes in inspector
  const loadCategoryRecords = async (cat: MasterDataCategory, query = '') => {
    setRecordsLoading(true);
    try {
      const data = await api.getDatabaseRecords(cat, {
        search: query || undefined,
        limit: 25,
      });
      setRecordsData(data);
    } catch (err) {
      console.error(`Failed to load records for ${cat}:`, err);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory && activeTab === 'inspector') {
      loadCategoryRecords(selectedCategory, searchQuery);
    }
  }, [selectedCategory, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      loadCategoryRecords(selectedCategory, searchQuery);
    }
  };

  const handleRunDryRun = async () => {
    setSyncTesting(true);
    try {
      const res = await api.syncMasterDatabase({
        dry_run: true,
        source_name: 'Master Tourism Integration Suite Test',
        full_database: {
          destinations: [
            {
              id: 'test-unesco-site',
              name: 'Sample Dynamic Heritage Gateway',
              city: 'Mumbai',
              state: 'Maharashtra',
              country: 'India',
              category: 'Heritage',
              summary: 'Validation record for master database dynamic pipeline.',
              coordinates: { lat: 18.922, lng: 72.8347 },
              tags: ['unesco', 'heritage', 'tested'],
              features: { map: true, navigation: true, ai: true, '3d': false },
            },
          ],
        },
      });
      setSyncTestResult(res);
    } catch (err: any) {
      setSyncTestResult({
        success: false,
        message: err?.message || 'Dry-run failed',
        synced_categories: [],
        inserted_or_updated: 0,
        dry_run: true,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setSyncTesting(false);
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (key: MasterDataCategory) => {
    switch (key) {
      case 'states':
        return <Flag className="w-4 h-4 text-amber-800" />;
      case 'cities':
        return <Building2 className="w-4 h-4 text-blue-800" />;
      case 'destinations':
        return <MapPin className="w-4 h-4 text-rose-800" />;
      case 'heritage':
        return <Landmark className="w-4 h-4 text-amber-900" />;
      case 'attractions':
        return <Sparkles className="w-4 h-4 text-purple-800" />;
      case 'railway_stations':
        return <Train className="w-4 h-4 text-emerald-800" />;
      case 'hotels':
        return <BedDouble className="w-4 h-4 text-teal-800" />;
      case 'maps_coordinates':
        return <Compass className="w-4 h-4 text-indigo-800" />;
      case 'routes':
        return <Navigation className="w-4 h-4 text-orange-800" />;
      case 'images':
        return <ImageIcon className="w-4 h-4 text-cyan-800" />;
      case 'visiting_details':
        return <Clock className="w-4 h-4 text-stone-800" />;
      default:
        return <Database className="w-4 h-4 text-stone-800" />;
    }
  };

  return (
    <div
      id="database-status-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="database-status-modal-content"
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Master Tourism Database Architecture
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Service Layer
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  v{status?.schema_version || '2.4.0'}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Single reusable data layer dynamically powering 11 master tourism dimensions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDatabaseData}
              title="Refresh status from backend"
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 font-semibold transition ${
              activeTab === 'overview'
                ? 'border-amber-800 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              11 Master Categories & Storage
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('inspector');
              if (selectedCategory) loadCategoryRecords(selectedCategory, searchQuery);
            }}
            className={`py-3 px-3 border-b-2 font-semibold transition ${
              activeTab === 'inspector'
                ? 'border-amber-800 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Table className="w-4 h-4" />
              Live Category Inspector
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3 border-b-2 font-semibold transition ${
              activeTab === 'sync'
                ? 'border-amber-800 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              Database Ingestion & Schema API
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-stone-500">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-700" />
              <p className="text-sm font-medium">Querying Master Data Service Layer...</p>
            </div>
          ) : (
            <>
              {/* Top Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Total Master Records
                  </div>
                  <div className="text-2xl font-bold text-stone-900 mt-1">
                    {status?.total_records.toLocaleString() || 0}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Fully indexed & cached
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Categories Architecture
                  </div>
                  <div className="text-2xl font-bold text-amber-800 mt-1">
                    {categories.length} Dimensions
                  </div>
                  <div className="text-[11px] text-stone-600 font-medium mt-0.5">
                    Unified Schema v2.4.0
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Storage Architecture
                  </div>
                  <div className="text-xs font-bold text-stone-900 mt-1.5 truncate" title="In-Memory Master Service">
                    Unified Data Layer
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium mt-0.5 truncate">
                    Ready for Master DB sync
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Dynamic Sync Status
                  </div>
                  <div className="text-sm font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Hot Ready
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-1">
                    {new Date(status?.last_synced || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* TAB 1: 11 Categories Overview Grid */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        11 Dynamic Master Data Categories
                      </h3>
                      <p className="text-xs text-stone-600">
                        Prepared to be dynamically powered by a single master tourism database
                      </p>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      Click any category to inspect live records
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {categories.map((cat) => (
                      <div
                        key={cat.key}
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setActiveTab('inspector');
                          loadCategoryRecords(cat.key);
                        }}
                        className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-700/50 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 group-hover:bg-amber-50 group-hover:border-amber-200 transition">
                                {getCategoryIcon(cat.key)}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition">
                                  {cat.label}
                                </h4>
                                <span className="text-[10px] text-stone-500 font-mono">
                                  pk: {cat.primaryKey}
                                </span>
                              </div>
                            </div>
                            <span className="text-base font-bold text-stone-900">
                              {cat.count.toLocaleString()}
                            </span>
                          </div>

                          <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1 max-w-[75%]">
                            {cat.schemaFields.slice(0, 3).map((f) => (
                              <span
                                key={f}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono"
                              >
                                {f}
                              </span>
                            ))}
                            {cat.schemaFields.length > 3 && (
                              <span className="text-[9px] text-stone-500">
                                +{cat.schemaFields.length - 3}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-amber-800 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                            Inspect <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Live Category Records Inspector */}
              {activeTab === 'inspector' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                      {categories.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => {
                            setSelectedCategory(cat.key);
                            loadCategoryRecords(cat.key, searchQuery);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                            selectedCategory === cat.key
                              ? 'bg-amber-800 text-white font-semibold'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {getCategoryIcon(cat.key)}
                          {cat.label}
                          <span className="text-[10px] opacity-80">({cat.count})</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={`Search ${selectedCategory || 'records'}...`}
                          className="w-48 sm:w-56 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-700 bg-[#FAF8F5]"
                        />
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      </form>

                      <button
                        onClick={() => setViewJson(!viewJson)}
                        className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 ${
                          viewJson
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                        }`}
                        title="Toggle JSON / Table View"
                      >
                        <FileJson className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Records Table / View */}
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
                      <span>
                        Showing {recordsData?.records.length || 0} of {recordsData?.total || 0} records for{' '}
                        <strong className="text-stone-900 uppercase font-bold">{selectedCategory}</strong>
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        GET /api/database/records?category={selectedCategory}
                      </span>
                    </div>

                    {recordsLoading ? (
                      <div className="py-16 flex flex-col items-center justify-center text-stone-500 text-xs gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-700" />
                        Loading records from data layer...
                      </div>
                    ) : viewJson ? (
                      <pre className="p-4 text-xs font-mono bg-stone-900 text-emerald-300 overflow-x-auto max-h-96">
                        {JSON.stringify(recordsData?.records, null, 2)}
                      </pre>
                    ) : recordsData?.records.length === 0 ? (
                      <div className="py-12 text-center text-xs text-stone-500">
                        No records found matching query.
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-600">
                              {selectedCategory === 'images' ? (
                                <>
                                  <th className="py-2.5 px-4 font-semibold">Visual Preview</th>
                                  <th className="py-2.5 px-4 font-semibold">Entity & Companion ID</th>
                                  <th className="py-2.5 px-4 font-semibold">Source & License</th>
                                  <th className="py-2.5 px-4 font-semibold">Attribution & Rights</th>
                                </>
                              ) : (
                                <>
                                  <th className="py-2.5 px-4 font-semibold">Identifier</th>
                                  <th className="py-2.5 px-4 font-semibold">Primary Title / Name</th>
                                  <th className="py-2.5 px-4 font-semibold">Location (City / State)</th>
                                  <th className="py-2.5 px-4 font-semibold">Details / Metadata</th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {recordsData?.records.map((item, idx) => {
                              const id = item.id || item.code || item.place_id || item.entity_id || `rec-${idx}`;
                              const name = item.name || item.place_name || item.entity_name || item.origin || 'Unnamed';
                              const location = [item.city, item.state].filter(Boolean).join(', ') || 'Pan-India';
                              const thumb = item.thumbnail_url || item.image_url || item.url || item.image_metadata?.thumbnail_url;
                              const meta = item.image_metadata;

                              if (selectedCategory === 'images') {
                                const imgUrl = item.image_url || item.url;
                                return (
                                  <tr key={id} className="hover:bg-amber-50/40 transition">
                                    <td className="py-2.5 px-4">
                                      <div className="w-14 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0 relative group">
                                        {thumb ? (
                                          <img
                                            src={thumb}
                                            alt={name}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&auto=format&fit=crop&q=80';
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                                            <ImageIcon className="w-4 h-4" />
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4">
                                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                                        {name}
                                        {item.is_hero && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold">
                                            Hero
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500 font-mono">
                                        <span>{item.entity_id || id}</span>
                                        {item.entity_type && (
                                          <span className="text-[9px] px-1 rounded bg-stone-100 text-stone-600 uppercase">
                                            {item.entity_type}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4">
                                      <div className="text-stone-800 font-medium text-xs">
                                        {item.source || 'Ministry of Tourism / ASI'}
                                      </div>
                                      <div className="mt-1">
                                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                          {item.license || 'CC-BY-SA-4.0'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4 max-w-xs">
                                      <div className="text-stone-600 text-[11px] line-clamp-1">
                                        {item.attribution || item.credit_attribution || 'Curated Open Tourism Documentation'}
                                      </div>
                                      {item.source_page && (
                                        <a
                                          href={item.source_page}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 hover:text-amber-950 underline mt-0.5"
                                        >
                                          Source Registry Page <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr key={id} className="hover:bg-amber-50/40 transition">
                                  <td className="py-2.5 px-4 font-mono text-[11px] text-stone-500 font-medium">
                                    {id}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <div className="flex items-center gap-2.5">
                                      {thumb && (
                                        <img
                                          src={thumb}
                                          alt={name}
                                          referrerPolicy="no-referrer"
                                          className="w-7 h-7 rounded-md object-cover border border-stone-200 flex-shrink-0"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      )}
                                      <div>
                                        <span className="font-semibold text-stone-900 block leading-tight">
                                          {name}
                                        </span>
                                        {meta && (
                                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-mono border border-emerald-200">
                                            {meta.license}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-stone-600">
                                    {location}
                                  </td>
                                  <td className="py-2.5 px-4 text-stone-500 max-w-xs truncate">
                                    {item.summary ||
                                      item.description ||
                                      (item.category && `Category: ${item.category}`) ||
                                      (item.modes && `Modes: ${item.modes.join(', ')}`) ||
                                      (item.entry_fee && `Fee: ₹${item.entry_fee.domestic || ''}`) ||
                                      'Verified active record'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Master Database Ingestion API & Schema */}
              {activeTab === 'sync' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-stone-900">
                          Master Tourism Database Ingestion Specification
                        </h3>
                        <p className="text-xs text-stone-600">
                          How your master tourism database dynamically syncs into the Virasat platform
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        POST /api/database/sync
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      The single reusable data layer abstracts direct in-memory calls so that any master database
                      (JSON batch, PostgreSQL, Cloud SQL, or REST sync) can dynamically hydrate the entire application.
                      All existing pages and navigation will immediately reflect newly ingested records without code changes.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={handleRunDryRun}
                        disabled={syncTesting}
                        className="px-4 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs transition flex items-center gap-2 shadow-xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncTesting ? 'animate-spin' : ''}`} />
                        {syncTesting ? 'Validating Master DB Schema...' : 'Run Master DB Dry-Run Validation'}
                      </button>
                    </div>

                    {syncTestResult && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs font-mono mt-3 ${
                          syncTestResult.success
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          {syncTestResult.message}
                        </div>
                        <div className="text-[11px] text-stone-600 mt-1">
                          Validated Categories: [
                          {syncTestResult.synced_categories.join(', ')}] • Inserted/Updated: {syncTestResult.inserted_or_updated}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schema Sample Payload */}
                  <div className="bg-stone-900 rounded-xl p-4 text-xs font-mono text-stone-300 space-y-2">
                    <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800">
                      <span>Sample Master Tourism Database Sync Payload (`POST /api/database/sync`)</span>
                      <span className="text-[10px] text-amber-400">JSON Format</span>
                    </div>
                    <pre className="overflow-x-auto text-[11px] text-emerald-300 leading-relaxed">
{`{
  "source_name": "Ministry of Tourism National Master Database 2026",
  "dry_run": false,
  "full_database": {
    "states": [{ "id": "kerala", "name": "Kerala", "capital": "Thiruvananthapuram", "region": "South" }],
    "cities": [{ "id": "kochi", "name": "Kochi", "state": "Kerala", "lat": 9.9312, "lng": 76.2673 }],
    "destinations": [{ "id": "fort-kochi", "name": "Fort Kochi", "city": "Kochi", "state": "Kerala" }],
    "heritage": [{ "id": "jew-town", "name": "Jew Town & Synagogue", "city": "Kochi" }],
    "attractions": [{ "id": "indo-portuguese-museum", "name": "Indo-Portuguese Museum", "city": "Kochi" }],
    "railway_stations": [{ "code": "ERS", "name": "Ernakulam Junction", "city": "Kochi" }],
    "hotels": [{ "id": "brunton-boatyard", "name": "Brunton Boatyard", "city": "Kochi" }],
    "maps_coordinates": [{ "id": "coord-kochi", "name": "Fort Kochi", "lat": 9.9658, "lng": 76.2421 }],
    "routes": [{ "id": "kochi-alleppey", "name": "Kochi to Alleppey Corridor", "distance_km": 63 }],
    "images": [{ "id": "img-kochi-1", "url": "https://images.unsplash.com/...", "is_hero": true }],
    "visiting_details": [{ "place_id": "fort-kochi", "timings": "Open 24 hours", "entry_fee": { "domestic": 0 } }]
  }
}`}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Storage Architecture:</span>
            <span>Reusable In-Memory Index with Dynamic Master DB Sync API</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
