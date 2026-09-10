import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  MapPin,
  Landmark,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  CameraOff,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { PlaceEditModal, PlaceFormData } from '../components/admin/PlaceEditModal';
import { OfficialImagePending } from '../components/common/OfficialImagePending';
import { TOPICS_AND_SUBTOPICS, TopicName, SourceQualityTier, computeSourceQuality } from '../types/taxonomy';

interface AdminMetrics {
  total_states: number;
  total_cities: number;
  total_places: number;
  verified_places: number;
  pending_places: number;
  needs_review_places: number;
  draft_places: number;
  rejected_places: number;
  places_without_sources: number;
  places_without_coordinates: number;
  places_without_images: number;
  tier1_places?: number;
  tier2_places?: number;
  tier3_generic_places?: number;
}

interface LiveAuditSummary {
  audited_at: string;
  metrics: {
    verified_before: number;
    http_200_matched: number;
    http_200_mismatch: number;
    http_failed: number;
    downgraded_to_needs_review: number;
    final_verified_and_live: number;
  };
}

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditSummary, setAuditSummary] = useState<LiveAuditSummary | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedSubtopic, setSelectedSubtopic] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [missingSourceOnly, setMissingSourceOnly] = useState(false);
  const [missingImageOnly, setMissingImageOnly] = useState(false);
  const [tierFilter, setTierFilter] = useState<'all' | SourceQualityTier>('all');

  // Active Tab: 'places' | 'cities' | 'states'
  const [activeTab, setActiveTab] = useState<'places' | 'cities' | 'states'>('places');

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceFormData | null>(null);

  // Action status message
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load metrics, audit summary, and list
  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, pRes, cRes, sRes, aRes] = await Promise.all([
        fetch('/api/v1/admin/metrics'),
        fetch('/api/v1/admin/places?limit=200'),
        fetch('/api/v1/admin/cities'),
        fetch('/api/v1/admin/states'),
        fetch('/api/v1/admin/audit/summary'),
      ]);

      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData.data);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setPlaces(pData.data || pData.places || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCities(cData.data || []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setStates(sData.data || []);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        if (aData.data) {
          setAuditSummary(aData.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('Failed to connect to admin API', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      setIsAuditing(true);
      showToast('Running live HTTP source validation audit...', 'success');
      const res = await fetch('/api/v1/admin/audit/run', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Live source audit failed');
      }
      setAuditSummary(data.data);
      showToast('Live source audit completed and database updated successfully!');
      await fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchCity = (p.city_id || '').toLowerCase().includes(q);
        const matchState = (p.state_id || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchState) return false;
      }

      // State
      if (selectedState !== 'all' && p.state_id?.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // City
      if (selectedCity !== 'all' && p.city_id?.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Topic
      if (selectedTopic !== 'all') {
        const matchTopic =
          p.topic?.toLowerCase() === selectedTopic.toLowerCase() ||
          (Array.isArray(p.category_links) &&
            p.category_links.some((cl: any) => cl.topic?.toLowerCase() === selectedTopic.toLowerCase()));
        if (!matchTopic) return false;
      }

      // Subtopic
      if (selectedSubtopic !== 'all') {
        const matchSub =
          p.subtopic?.toLowerCase() === selectedSubtopic.toLowerCase() ||
          (Array.isArray(p.category_links) &&
            p.category_links.some((cl: any) => cl.subtopic?.toLowerCase() === selectedSubtopic.toLowerCase()));
        if (!matchSub) return false;
      }

      // Status
      if (statusFilter !== 'all') {
        const st = (p.verification_status || 'draft').toLowerCase();
        if (st !== statusFilter.toLowerCase()) return false;
      }

      // Missing source
      if (missingSourceOnly) {
        const hasSource =
          (p.source_url && p.source_url.trim() !== '') ||
          (Array.isArray(p.sources) && p.sources.length > 0);
        if (hasSource) return false;
      }

      // Missing image
      if (missingImageOnly) {
        const hasImage = p.thumbnail_url && p.thumbnail_url.trim() !== '';
        if (hasImage) return false;
      }

      // Quality Tier filter
      if (tierFilter !== 'all') {
        const primaryUrl = p.source_url || (Array.isArray(p.sources) && p.sources[0]?.source_url) || '';
        const quality = p.source_quality || computeSourceQuality(primaryUrl);
        if (quality !== tierFilter) return false;
      }

      return true;
    });
  }, [
    places,
    searchQuery,
    selectedState,
    selectedCity,
    selectedTopic,
    selectedSubtopic,
    statusFilter,
    missingSourceOnly,
    missingImageOnly,
    tierFilter,
  ]);

  // Handle Quick Status Change
  const handleQuickStatusChange = async (placeId: string, newStatus: string) => {
    try {
      if (newStatus === 'verified') {
        const targetPlace = places.find((p) => p.id === placeId);
        const primaryUrl = targetPlace?.source_url || (Array.isArray(targetPlace?.sources) && targetPlace?.sources[0]?.source_url) || '';
        const quality = targetPlace?.source_quality || computeSourceQuality(primaryUrl);
        if (quality === 'generic_homepage' || quality === 'missing') {
          showToast(
            'Policy Violation: Cannot verify place with generic homepage domain (Tier 3) or missing URL. Tier 1 deep link or Tier 2 official site required.',
            'error'
          );
          return;
        }
      }

      const res = await fetch(`/api/v1/admin/places/${placeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Status update failed');
      }
      showToast(`Place status updated to ${newStatus}`);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Handle Delete
  const handleDeletePlace = async (placeId: string, placeName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${placeName}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/places/${placeId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Delete failed');
      }
      showToast(`Deleted "${placeName}" successfully`);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Handle Save from Modal
  const handleSavePlace = async (formData: PlaceFormData) => {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/v1/admin/places/${formData.id}` : '/api/v1/admin/places';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || data.message || 'Failed to save place');
    }

    showToast(isEdit ? 'Place updated successfully' : 'Place created successfully');
    fetchData();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-slide-up ${
            toastMessage.type === 'success'
              ? 'bg-emerald-800 text-white'
              : 'bg-rose-800 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Government & Verified Records Console
                </span>
                <span className="text-stone-400 text-xs font-mono">v1.2 Policy Standard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
                Virasat Tourism & Heritage Admin Console
              </h1>
              <p className="text-stone-400 text-sm mt-1 max-w-2xl">
                Enforcing strict official-source verification policy across 28 states, 8 union territories,
                and all 11 core heritage & tourism topics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800/60 text-white text-xs font-semibold shadow-md shadow-indigo-950/30 transition-all flex items-center gap-1.5"
                title="Perform live HTTP GET requests and content validation against all verified sources"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                {isAuditing ? 'Auditing Sources...' : 'Run Source Audit'}
              </button>
              <button
                onClick={fetchData}
                className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5"
                title="Refresh metrics and records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingPlace(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Place
              </button>
            </div>
          </div>

          {/* Metrics Strip */}
          {metrics && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-stone-800">
                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 font-medium block">Total States</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">{metrics.total_states}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 font-medium block">Total Cities</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">{metrics.total_cities}</span>
                </div>
                <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
                  <span className="text-[11px] text-stone-400 font-medium block">Total Places</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">{metrics.total_places}</span>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
                  <span className="text-[11px] text-emerald-400 font-medium block">Verified (Tier 1+2)</span>
                  <span className="text-xl font-bold text-emerald-300 mt-0.5 block">
                    {metrics.verified_places}
                  </span>
                </div>
                <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/60">
                  <span className="text-[11px] text-amber-400 font-medium block">Needs Review</span>
                  <span className="text-xl font-bold text-amber-300 mt-0.5 block">
                    {metrics.pending_places + metrics.needs_review_places}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border ${
                    metrics.places_without_sources > 0
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : 'bg-stone-800/80 border-stone-700/60 text-stone-400'
                  }`}
                >
                  <span className="text-[11px] font-medium block">Missing Source</span>
                  <span className="text-xl font-bold mt-0.5 block">
                    {metrics.places_without_sources}
                  </span>
                </div>
              </div>

              {/* Source Quality Tier Sub-Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="bg-emerald-900/30 border border-emerald-600/50 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Tier 1: Place-Specific</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">Deep links (UNESCO/NIC/District) — Verified</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-300">{metrics.tier1_places ?? 0}</span>
                </div>
                <div className="bg-blue-900/30 border border-blue-600/50 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Tier 2: Official Site</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">Trust/Temple/Museum allowlist — Verified</span>
                  </div>
                  <span className="text-xl font-bold text-blue-300">{metrics.tier2_places ?? 0}</span>
                </div>
                <div className="bg-amber-900/30 border border-amber-600/50 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Tier 3: Generic Homepage</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">asi.nic.in / generic domains — Needs Review</span>
                  </div>
                  <span className="text-xl font-bold text-amber-300">{metrics.tier3_generic_places ?? 0}</span>
                </div>
              </div>

              {/* Live Source Audit Status Panel */}
              {auditSummary && (
                <div className="mt-4 p-4 rounded-xl bg-stone-950/80 border border-indigo-500/30 shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Live Source Validation Audit Status
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 font-mono">
                      Last Audited: <span className="text-stone-200 font-semibold">{new Date(auditSummary.audited_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* 1. Verified and live */}
                    <div className="bg-emerald-950/40 border border-emerald-700/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-300">Verified and Live</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl font-extrabold text-emerald-200 mt-1">
                        {auditSummary.metrics.final_verified_and_live}
                      </div>
                      <span className="text-[10px] text-emerald-400/80">HTTP 200 + Content Matched</span>
                    </div>

                    {/* 2. Failed / dead source */}
                    <div className="bg-rose-950/40 border border-rose-700/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-300">Failed / Dead Source</span>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="text-xl font-extrabold text-rose-200 mt-1">
                        {auditSummary.metrics.http_failed}
                      </div>
                      <span className="text-[10px] text-rose-400/80">HTTP 404 / 418 / Dead</span>
                    </div>

                    {/* 3. URL mismatch */}
                    <div className="bg-amber-950/40 border border-amber-700/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-amber-300">URL Mismatch</span>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl font-extrabold text-amber-200 mt-1">
                        {auditSummary.metrics.http_200_mismatch}
                      </div>
                      <span className="text-[10px] text-amber-400/80">HTTP 200 Content Mismatch</span>
                    </div>

                    {/* 4. Needs review */}
                    <div className="bg-orange-950/40 border border-orange-700/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-orange-300">Needs Review</span>
                        <Clock className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="text-xl font-extrabold text-orange-200 mt-1">
                        {auditSummary.metrics.downgraded_to_needs_review}
                      </div>
                      <span className="text-[10px] text-orange-400/80">Downgraded from Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Admin Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-2 mb-6">
          <button
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'places'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Tourist Places & Verification ({filteredPlaces.length})
          </button>
          <button
            onClick={() => setActiveTab('cities')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'cities'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Cities & Destinations ({cities.length})
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'states'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            States & Union Territories ({states.length})
          </button>
        </div>

        {/* TAB 1: PLACES MANAGEMENT & VERIFICATION */}
        {activeTab === 'places' && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              {/* Row 1: Search & Geographic Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search place by name, city or state..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity('all');
                    }}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="all">All States & UTs</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="all">All Cities / Valleys</option>
                    {cities
                      .filter((c) => selectedState === 'all' || c.state_id === selectedState)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.entity_type ? `(${c.entity_type})` : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Topic Taxonomy & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <select
                    value={selectedTopic}
                    onChange={(e) => {
                      setSelectedTopic(e.target.value);
                      setSelectedSubtopic('all');
                    }}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="all">All Topics (11 Core)</option>
                    {Object.keys(TOPICS_AND_SUBTOPICS).map((top) => (
                      <option key={top} value={top}>
                        {top}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedSubtopic}
                    onChange={(e) => setSelectedSubtopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="all">All Subtopics</option>
                    {selectedTopic !== 'all' &&
                      TOPICS_AND_SUBTOPICS[selectedTopic as TopicName]?.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Status Tabs */}
                <div className="md:col-span-2 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1">
                    {(['all', 'verified', 'pending', 'needs_review', 'draft', 'rejected'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                            statusFilter === st
                              ? st === 'verified'
                                ? 'bg-emerald-700 text-white'
                                : st === 'needs_review'
                                ? 'bg-amber-600 text-white'
                                : st === 'rejected'
                                ? 'bg-rose-700 text-white'
                                : 'bg-stone-800 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      )
                    )}
                  </div>

                  {/* Quick Toggles */}
                  <div className="flex items-center gap-3 text-xs text-stone-600 font-medium pl-2 border-l border-stone-200">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={missingSourceOnly}
                        onChange={(e) => setMissingSourceOnly(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Missing Source</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={missingImageOnly}
                        onChange={(e) => setMissingImageOnly(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Missing Image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 3: Quality Tier Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">Source Quality Tier:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'All Tiers' },
                      { id: 'place_specific', label: 'Tier 1: Deep Link' },
                      { id: 'official_site', label: 'Tier 2: Official Site' },
                      { id: 'generic_homepage', label: 'Tier 3: Generic (Needs Review)' },
                      { id: 'missing', label: 'Missing' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTierFilter(t.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          tierFilter === t.id
                            ? t.id === 'place_specific'
                              ? 'bg-emerald-700 text-white'
                              : t.id === 'official_site'
                              ? 'bg-blue-700 text-white'
                              : t.id === 'generic_homepage'
                              ? 'bg-amber-600 text-white'
                              : t.id === 'missing'
                              ? 'bg-rose-700 text-white'
                              : 'bg-stone-800 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Places List Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-12">Media</th>
                      <th className="py-3 px-4">Place & Designation</th>
                      <th className="py-3 px-4">City / State</th>
                      <th className="py-3 px-4">Topic & Subtopic</th>
                      <th className="py-3 px-4">Official Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredPlaces.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No tourist places match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPlaces.map((p) => {
                        const status = (p.verification_status || 'draft').toLowerCase();
                        const hasSource =
                          (p.source_url && p.source_url.trim() !== '') ||
                          (Array.isArray(p.sources) && p.sources.length > 0);

                        return (
                          <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                            {/* Media thumbnail */}
                            <td className="py-3 px-4">
                              {p.thumbnail_url && p.thumbnail_url.trim() !== '' ? (
                                <img
                                  src={p.thumbnail_url}
                                  alt={p.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-stone-200 shadow-sm"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400" title="Official image pending">
                                  <CameraOff className="w-5 h-5" />
                                </div>
                              )}
                            </td>

                            {/* Place Name */}
                            <td className="py-3 px-4 font-medium text-stone-900">
                              <div className="font-semibold text-sm">{p.name}</div>
                              <div className="text-[11px] text-stone-500 line-clamp-1">
                                {p.short_description || p.summary}
                              </div>
                              {p.place_type && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-stone-100 text-stone-600">
                                  {p.place_type}
                                </span>
                              )}
                            </td>

                            {/* City / State */}
                            <td className="py-3 px-4">
                              <div className="font-medium text-stone-800 capitalize">
                                {p.city_id?.replace(/-/g, ' ')}
                              </div>
                              <div className="text-[11px] text-stone-500 capitalize">
                                {p.state_id?.replace(/-/g, ' ')}
                              </div>
                            </td>

                            {/* Topics & Subtopics */}
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {p.category_links && p.category_links.length > 0 ? (
                                  p.category_links.slice(0, 2).map((cl: any, i: number) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-medium border border-amber-200/80"
                                    >
                                      {cl.topic}: {cl.subtopic}
                                    </span>
                                  ))
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px]">
                                    {p.topic || p.category}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Official Source & Quality Tier */}
                            <td className="py-3 px-4">
                              {hasSource ? (
                                <div>
                                  <a
                                    href={p.source_url || p.sources?.[0]?.source_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium hover:underline max-w-[180px] truncate"
                                  >
                                    <span className="truncate">{p.source_name || p.sources?.[0]?.source_name || 'Official Source'}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                  {/* Quality Tier Badge */}
                                  {(() => {
                                    const primaryUrl = p.source_url || p.sources?.[0]?.source_url || '';
                                    const quality = p.source_quality || computeSourceQuality(primaryUrl);
                                    if (quality === 'place_specific') {
                                      return (
                                        <div className="mt-1">
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                            Tier 1: Deep Link
                                          </span>
                                        </div>
                                      );
                                    }
                                    if (quality === 'official_site') {
                                      return (
                                        <div className="mt-1">
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                            Tier 2: Official Site
                                          </span>
                                        </div>
                                      );
                                    }
                                    if (quality === 'generic_homepage') {
                                      return (
                                        <div className="mt-1">
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title="Generic domain — verified forbidden">
                                            Tier 3: Generic (Needs Review)
                                          </span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <div className="mt-1">
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                                          Missing
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Missing Source
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                                  status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : status === 'needs_review'
                                    ? 'bg-amber-100 text-amber-800'
                                    : status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {status === 'verified' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                                {status.replace('_', ' ')}
                              </span>
                              {p.audit_note && (
                                <div
                                  className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded px-1.5 py-0.5 mt-1 max-w-[200px] truncate"
                                  title={p.audit_note}
                                >
                                  ⚠️ {p.audit_note}
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick verification toggle */}
                                <select
                                  value={status}
                                  onChange={(e) => handleQuickStatusChange(p.id, e.target.value)}
                                  className="text-[11px] font-medium border border-stone-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
                                >
                                  {(() => {
                                    const primaryUrl = p.source_url || p.sources?.[0]?.source_url || '';
                                    const quality = p.source_quality || computeSourceQuality(primaryUrl);
                                    const canVerify = quality === 'place_specific' || quality === 'official_site';
                                    return (
                                      <option value="verified" disabled={!canVerify}>
                                        Verify {!canVerify ? '(Tier 3 Blocked)' : ''}
                                      </option>
                                    );
                                  })()}
                                  <option value="needs_review">Needs Review</option>
                                  <option value="pending">Pending</option>
                                  <option value="draft">Draft</option>
                                  <option value="rejected">Reject</option>
                                </select>

                                <button
                                  onClick={() => {
                                    setEditingPlace({
                                      id: p.id,
                                      name: p.name,
                                      slug: p.slug,
                                      city_id: p.city_id,
                                      state_id: p.state_id,
                                      place_type: p.place_type,
                                      short_description: p.short_description || p.summary,
                                      detailed_description: p.detailed_description || p.description,
                                      address: p.address,
                                      lat: p.lat,
                                      lng: p.lng,
                                      visiting_hours: p.visiting_hours,
                                      entry_fee_domestic: p.entry_fee_domestic,
                                      entry_fee_intl: p.entry_fee_intl,
                                      best_time_to_visit: p.best_time_to_visit,
                                      contact_information: p.contact_information,
                                      official_website: p.official_website,
                                      verification_status: p.verification_status || 'draft',
                                      thumbnail_url: p.thumbnail_url,
                                      category_links: p.category_links || [],
                                      sources: p.sources || [],
                                    });
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                                  title="Edit place details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeletePlace(p.id, p.name)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete place"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CITIES & DESTINATIONS MANAGEMENT */}
        {activeTab === 'cities' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Registered Cities, Valleys, Districts & Destinations
                </h3>
                <p className="text-xs text-stone-500">
                  Rule: Do not treat Goa, Kutch, Spiti Valley or National Parks as ordinary cities without explicit entity_type.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4">Coordinates</th>
                    <th className="py-3 px-4">Official Portal</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {cities.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {c.name}
                        {c.district && (
                          <span className="text-stone-400 font-normal ml-1">
                            ({c.district} Dist.)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                          {c.entity_type || 'city'}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize">{c.state_id?.replace(/-/g, ' ')}</td>
                      <td className="py-3 px-4 font-mono text-stone-500">
                        {Number(c.lat).toFixed(4)}, {Number(c.lng).toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        {c.official_url ? (
                          <a
                            href={c.official_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-700 hover:underline inline-flex items-center gap-1 max-w-[200px] truncate"
                          >
                            <span className="truncate">{c.official_url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STATES & UTS */}
        {activeTab === 'states' && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              States & Union Territories Directory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {states.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">{s.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {s.type || s.region_type || 'State'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600">
                    <div>Capital: <strong>{s.capital || 'N/A'}</strong></div>
                    <div>Region: <strong>{s.region}</strong></div>
                  </div>
                  {s.official_tourism_url && (
                    <a
                      href={s.official_tourism_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1 pt-1 truncate max-w-full"
                    >
                      <span className="truncate">{s.official_tourism_url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Place Edit / Create Modal */}
      <PlaceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlace}
        initialData={editingPlace}
        cities={cities}
        states={states}
      />
    </div>
  );
};
