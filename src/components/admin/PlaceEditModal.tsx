import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Link as LinkIcon,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import {
  TOPICS_AND_SUBTOPICS,
  TopicName,
  SubtopicName,
  ALLOWED_SOURCE_TYPES,
  VerificationStatus,
  SourceType,
  SourceQualityTier,
  computeSourceQuality,
} from '../../types/taxonomy';

interface SourceItem {
  id?: string;
  source_name: string;
  source_url: string;
  source_type: SourceType;
  evidence_note?: string;
  accessed_on?: string;
}

interface CategoryLinkItem {
  topic: string;
  subtopic: string;
}

export interface PlaceFormData {
  id?: string;
  name: string;
  slug?: string;
  city_id: string;
  state_id: string;
  place_type?: string;
  short_description: string;
  detailed_description?: string;
  address?: string;
  lat: number;
  lng: number;
  visiting_hours: string;
  entry_fee_domestic: number;
  entry_fee_intl: number;
  best_time_to_visit?: string;
  contact_information?: string;
  official_website?: string;
  verification_status: VerificationStatus;
  source_quality?: SourceQualityTier;
  thumbnail_url?: string;
  category_links: CategoryLinkItem[];
  sources: SourceItem[];
}

interface PlaceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlaceFormData) => Promise<void>;
  initialData?: Partial<PlaceFormData> | null;
  cities: Array<{ id: string; name: string; state_id: string }>;
  states: Array<{ id: string; name: string }>;
}

export const PlaceEditModal: React.FC<PlaceEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  cities,
  states,
}) => {
  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    slug: '',
    city_id: cities[0]?.id || 'jaipur',
    state_id: states[0]?.id || 'rajasthan',
    place_type: 'Monument',
    short_description: '',
    detailed_description: '',
    address: '',
    lat: 26.9124,
    lng: 75.7873,
    visiting_hours: '09:00 AM - 05:00 PM',
    entry_fee_domestic: 50,
    entry_fee_intl: 200,
    best_time_to_visit: 'October to March',
    contact_information: '',
    official_website: '',
    verification_status: 'draft',
    thumbnail_url: '',
    category_links: [{ topic: 'Heritage', subtopic: 'Historical Sites' }],
    sources: [],
  });

  const [selectedTopic, setSelectedTopic] = useState<TopicName>('Heritage');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(
    TOPICS_AND_SUBTOPICS['Heritage'][0]
  );

  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<SourceType>('state_tourism');
  const [newEvidenceNote, setNewEvidenceNote] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || '',
        slug: initialData.slug || '',
        city_id: initialData.city_id || cities[0]?.id || '',
        state_id: initialData.state_id || states[0]?.id || '',
        place_type: initialData.place_type || 'Monument',
        short_description: initialData.short_description || '',
        detailed_description: initialData.detailed_description || '',
        address: initialData.address || '',
        lat: Number(initialData.lat) || 26.9124,
        lng: Number(initialData.lng) || 75.7873,
        visiting_hours: initialData.visiting_hours || '09:00 AM - 05:00 PM',
        entry_fee_domestic: Number(initialData.entry_fee_domestic) || 0,
        entry_fee_intl: Number(initialData.entry_fee_intl) || 0,
        best_time_to_visit: initialData.best_time_to_visit || 'October to March',
        contact_information: initialData.contact_information || '',
        official_website: initialData.official_website || '',
        verification_status: (initialData.verification_status as VerificationStatus) || 'draft',
        thumbnail_url: initialData.thumbnail_url || '',
        category_links:
          initialData.category_links && initialData.category_links.length > 0
            ? initialData.category_links
            : [{ topic: 'Heritage', subtopic: 'Historical Sites' }],
        sources: initialData.sources || [],
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        slug: '',
        city_id: cities[0]?.id || 'jaipur',
        state_id: states[0]?.id || 'rajasthan',
        place_type: 'Monument',
        short_description: '',
        detailed_description: '',
        address: '',
        lat: 26.9124,
        lng: 75.7873,
        visiting_hours: '09:00 AM - 05:00 PM',
        entry_fee_domestic: 50,
        entry_fee_intl: 200,
        best_time_to_visit: 'October to March',
        contact_information: '',
        official_website: '',
        verification_status: 'draft',
        thumbnail_url: '',
        category_links: [{ topic: 'Heritage', subtopic: 'Historical Sites' }],
        sources: [],
      });
    }
    setValidationError(null);
  }, [initialData, isOpen, cities, states]);

  if (!isOpen) return null;

  const handleTopicChange = (topic: TopicName) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(TOPICS_AND_SUBTOPICS[topic][0]);
  };

  const handleAddCategory = () => {
    const exists = formData.category_links.some(
      (c) => c.topic === selectedTopic && c.subtopic === selectedSubtopic
    );
    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        category_links: [...prev.category_links, { topic: selectedTopic, subtopic: selectedSubtopic }],
      }));
    }
  };

  const handleRemoveCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      category_links: prev.category_links.filter((_, i) => i !== index),
    }));
  };

  const handleAddSource = () => {
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      setValidationError('Source name and Source URL are required.');
      return;
    }
    if (!newSourceUrl.startsWith('http')) {
      setValidationError('Source URL must begin with http:// or https://');
      return;
    }

    const newSrc: SourceItem = {
      source_name: newSourceName.trim(),
      source_url: newSourceUrl.trim(),
      source_type: newSourceType,
      evidence_note: newEvidenceNote.trim(),
      accessed_on: new Date().toISOString().split('T')[0],
    };

    setFormData((prev) => ({
      ...prev,
      sources: [...prev.sources, newSrc],
    }));

    setNewSourceName('');
    setNewSourceUrl('');
    setNewEvidenceNote('');
    setValidationError(null);
  };

  const handleRemoveSource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Basic validation
    if (!formData.name.trim()) {
      setValidationError('Place name is required.');
      return;
    }
    if (!formData.city_id) {
      setValidationError('City is required.');
      return;
    }
    if (!formData.short_description.trim()) {
      setValidationError('Short factual description is required.');
      return;
    }

    // 2. Latitude / Longitude validation within India
    if (isNaN(formData.lat) || formData.lat < 6.0 || formData.lat > 38.5) {
      setValidationError('Latitude must be a valid number between 6.0 and 38.5 within India.');
      return;
    }
    if (isNaN(formData.lng) || formData.lng < 68.0 || formData.lng > 98.5) {
      setValidationError('Longitude must be a valid number between 68.0 and 98.5 within India.');
      return;
    }

    // 3. Strict Source Policy Check for 'verified' status
    const primaryUrl = formData.sources?.[0]?.source_url || formData.official_website || '';
    const computedTier = computeSourceQuality(primaryUrl);

    if (formData.verification_status === 'verified') {
      if (computedTier === 'generic_homepage') {
        setValidationError(
          'DATA POLICY VIOLATION (Tier 3 Generic Homepage): A place cannot be marked as "verified" with a domain-only generic homepage (e.g. asi.nic.in, whc.unesco.org). Only Tier 1 (place-specific deep links) or Tier 2 (official site allowlist) are eligible for verification. Please set status to "needs_review" or attach a place-specific deep link.'
        );
        return;
      }
      if (computedTier === 'missing') {
        setValidationError(
          'DATA POLICY VIOLATION: A place cannot be marked as "verified" without at least one valid official source URL. Add an official source deep link before verifying, or save as "draft" or "needs_review".'
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSave({ ...formData, source_quality: computedTier });
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save place.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold">
              {initialData?.id ? '✏️' : '✨'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {initialData?.id ? 'Edit Tourist Place' : 'Add New Tourist Place'}
              </h2>
              <p className="text-xs text-stone-500">
                Adhering to Virasat source-backed verified data policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">{validationError}</div>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              1. Basic Identity & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Place Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Amber Palace (Amer Fort)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Place Type / Designation
                </label>
                <input
                  type="text"
                  value={formData.place_type}
                  onChange={(e) => setFormData({ ...formData, place_type: e.target.value })}
                  placeholder="e.g. UNESCO Hill Fort, Temple Complex, Wildlife Sanctuary"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  State / Union Territory *
                </label>
                <select
                  value={formData.state_id}
                  onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / Destination *
                </label>
                <select
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {cities
                    .filter((c) => !formData.state_id || c.state_id === formData.state_id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Latitude (India Bounds: 6.0 to 38.5) *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Longitude (India Bounds: 68.0 to 98.5) *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postal Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Devisinghpura, Amer, Jaipur, Rajasthan 302001"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Short Factual Description * (No promotional fluff, factual & concise)
              </label>
              <textarea
                rows={2}
                required
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="1-2 factual sentences describing what the place is and its primary historical or natural significance."
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Detailed Description (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Detailed historical, architectural, or ecological background."
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Categories & Topics (Many-to-Many) */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              2. Topics & Subtopics (Multi-Category Taxonomy)
            </h3>

            <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Topic</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => handleTopicChange(e.target.value as TopicName)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                >
                  {Object.keys(TOPICS_AND_SUBTOPICS).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Subtopic
                </label>
                <select
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                >
                  {TOPICS_AND_SUBTOPICS[selectedTopic].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Attach Category
                </button>
              </div>
            </div>

            {/* Attached Category Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.category_links.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium"
                >
                  <span className="font-semibold text-amber-700">{cat.topic}</span>
                  <span className="text-amber-400">›</span>
                  <span>{cat.subtopic}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    className="ml-1 text-amber-600 hover:text-rose-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Sources & Evidence (Mandatory for verification) */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                3. Official Sources & Provenance (Quality Tiers)
              </h3>
              <span className="text-xs text-amber-700 font-medium">
                * Tier 1 or Tier 2 required for verified status
              </span>
            </div>

            {/* Quality Tier Indicator Card */}
            {(() => {
              const primaryUrl = formData.sources?.[0]?.source_url || formData.official_website || '';
              const tier = computeSourceQuality(primaryUrl);
              return (
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  tier === 'place_specific'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : tier === 'official_site'
                    ? 'bg-blue-50 border-blue-300 text-blue-900'
                    : tier === 'generic_homepage'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-stone-100 border-stone-300 text-stone-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <span className="font-bold">
                        {tier === 'place_specific' && 'TIER 1: Place-Specific Deep Link'}
                        {tier === 'official_site' && 'TIER 2: Official Site Allowlist'}
                        {tier === 'generic_homepage' && 'TIER 3: Generic Homepage (Domain Only)'}
                        {tier === 'missing' && 'MISSING SOURCE'}
                      </span>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        {tier === 'place_specific' && 'Deep link provided (e.g. UNESCO list item, district tourist place). Eligible for "Verified".'}
                        {tier === 'official_site' && 'Dedicated temple/museum/trust website. Eligible for "Verified".'}
                        {tier === 'generic_homepage' && 'Generic domain (e.g. asi.nic.in). VERIFIED FORBIDDEN — Must remain "needs_review".'}
                        {tier === 'missing' && 'No source attached. Place cannot be marked verified.'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tier === 'place_specific' || tier === 'official_site'
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-amber-200 text-amber-900'
                  }`}>
                    {tier === 'place_specific' || tier === 'official_site' ? 'VERIFIED ALLOWED' : 'NEEDS REVIEW'}
                  </span>
                </div>
              );
            })()}

            {/* Add Source Box */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Source Name *
                  </label>
                  <input
                    type="text"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g. Archaeological Survey of India"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Source URL *
                  </label>
                  <input
                    type="url"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://asi.nic.in/..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Source Type *
                  </label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as SourceType)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  >
                    {ALLOWED_SOURCE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newEvidenceNote}
                  onChange={(e) => setNewEvidenceNote(e.target.value)}
                  placeholder="Evidence note (e.g. Centrally protected monument record)"
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Source
                </button>
              </div>
            </div>

            {/* List of Attached Sources */}
            <div className="space-y-2">
              {formData.sources.length === 0 ? (
                <div className="text-xs text-stone-400 italic p-2 border border-dashed border-stone-200 rounded-lg text-center">
                  No sources attached yet. Add at least one source before setting status to "Verified".
                </div>
              ) : (
                formData.sources.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-stone-200 shadow-sm text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-700 uppercase text-[10px]">
                        {src.source_type}
                      </span>
                      <span className="font-semibold text-stone-900">{src.source_name}</span>
                      <a
                        href={src.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-600 hover:underline inline-flex items-center gap-0.5 truncate max-w-[280px]"
                      >
                        <span className="truncate">{src.source_url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(i)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 4: Media & Image Policy */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              4. Media & Image Policy
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hero Image URL (Leave blank to use neutral "Official image pending" placeholder)
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Rule: Do not use random copyrighted or uncredited stock photos. If no reliable official image exists, leave empty.
              </p>
            </div>
          </div>

          {/* Section 5: Verification Status */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              5. Verification Status & Publication Control
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {(['draft', 'pending', 'needs_review', 'verified', 'rejected'] as VerificationStatus[]).map(
                (status) => {
                  const isSelected = formData.verification_status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, verification_status: status })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center capitalize ${
                        isSelected
                          ? status === 'verified'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : status === 'needs_review'
                            ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                            : status === 'rejected'
                            ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                            : 'bg-stone-800 border-stone-800 text-white shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  );
                }
              )}
            </div>
            {(() => {
              const primaryUrl = formData.sources?.[0]?.source_url || formData.official_website || '';
              const tier = computeSourceQuality(primaryUrl);
              if (tier === 'generic_homepage') {
                return (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>
                      <strong>Tier 3 Generic Homepage Detected:</strong> Setting status to <strong>Verified</strong> is forbidden for domain-only URLs (e.g. asi.nic.in). Please keep as <strong>needs_review</strong> until a place-specific deep link is attached.
                    </span>
                  </div>
                );
              }
              return null;
            })()}
            <p className="text-[11px] text-stone-500">
              Only records marked as <strong>"verified"</strong> with <strong>Tier 1 (place-specific)</strong> or <strong>Tier 2 (official site)</strong> will be displayed to public visitors on Explore & City pages.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
