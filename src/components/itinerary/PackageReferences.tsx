import React, { useState } from 'react';
import {
  Luggage,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Sparkles,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
  X,
  Phone,
  Mail,
  User,
  Car,
  BedDouble,
  Ticket,
  Utensils,
  Award,
  Info,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  getCityVerifiedPackages,
  calculatePackagePricing,
  VerifiedTravelPackage,
} from '../../data/verifiedTravelPackages';

const EXTERNAL_PROVIDERS = [
  { name: 'IRCTC Tourism', description: 'Official Rail & Land Packages', url: 'https://www.irctctourism.com/tourpkgs' },
  { name: 'MakeMyTrip', description: 'Holiday Packages', url: 'https://www.makemytrip.com/holidays-india/' },
  { name: 'Yatra', description: 'Curated Holidays', url: 'https://packages.yatra.com/holidays/' },
  { name: 'SOTC', description: 'Guided Sightseeing', url: 'https://www.sotc.in/holidays' },
  { name: 'Thomas Cook', description: 'Pan-India Tours', url: 'https://www.thomascook.in/holidays' },
] as const;

interface PackageReferencesProps {
  city: string;
  days: number;
  startDate?: string;
  travellers?: number;
  places?: string[];
}

export function PackageReferences({
  city,
  days,
  startDate,
  travellers = 1,
  places = [],
}: PackageReferencesProps) {
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';
  const destination = city.trim() || 'Jaipur';
  const highlights = [...new Set(places.map((place) => place.trim()).filter(Boolean))].slice(0, 8);

  const packages = getCityVerifiedPackages(destination, days, travellers, startDate, places);

  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(packages[0]?.id || null);
  const [selectedPkgForBooking, setSelectedPkgForBooking] = useState<VerifiedTravelPackage | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Booking Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Railway Station');
  const [specialNote, setSpecialNote] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    const refCode = `VIRASAT-PKG-${destination.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccessId(refCode);
  };

  const closeBookingModal = () => {
    setSelectedPkgForBooking(null);
    setBookingSuccessId(null);
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setSpecialNote('');
  };

  return (
    <section
      aria-labelledby="package-references-title"
      className="rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-orange-50/25 to-amber-50/40 p-5 sm:p-8 shadow-sm transition-all"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/80">
        <div className="flex items-start gap-3.5">
          <span className="rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 p-3 text-white shadow-xs shrink-0 mt-0.5">
            <Luggage className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-0.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isHi ? 'विरासत सत्यापित यात्रा पैकेज' : 'Virasat Verified Travel Packages'}</span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {isHi ? '100% ऑन-ग्राउंड गारंटी' : '100% On-Ground Guarantee'}
              </span>
            </div>
            <h2 id="package-references-title" className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              {isHi
                ? `${destination} हेतु पूर्ण सत्यापित यात्रा पैकेज एवं दैनिक दरें`
                : `Verified Travel Packages & Live Quotes for ${destination}`}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              {isHi
                ? `${days} दिवसीय यात्रा • ${travellers} यात्री • ${startDate ? `प्रस्थान तिथि: ${startDate}` : 'लचीली तिथियां'} | सभी पैकेजों में सरकार-प्रमाणित एएसआई गाइड, हेरिटेज होटल आवास, निजी एसी वाहन एवं स्मारकों के कतार-मुक्त टिकट सम्मिलित हैं।`
                : `Planning ${days} ${days === 1 ? 'day' : 'days'} in ${destination} for ${travellers} ${travellers === 1 ? 'traveller' : 'travellers'}${startDate ? ` starting ${startDate}` : ''}. All packages feature certified ASI guides, verified stays, dedicated private vehicle, and skip-the-line monument entries.`}
            </p>
          </div>
        </div>

        {/* Live Date Batch & Status Badge */}
        {startDate && (
          <div className="shrink-0 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs self-start md:self-auto">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>{isHi ? 'प्रस्थान तिथि स्थिति' : 'Departure Status'}</span>
            </div>
            <div className="text-xs font-bold text-emerald-800 font-mono mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{startDate}</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              {isHi ? 'ताजा दरें व स्लॉट उपलब्ध' : 'Live rates & instant slots active'}
            </div>
          </div>
        )}
      </div>

      {/* Places in your plan pill tags */}
      {highlights.length > 0 && (
        <div className="mt-4 pt-1 flex flex-wrap items-center gap-2 text-xs text-stone-700">
          <MapPin className="h-4 w-4 text-orange-700 shrink-0" aria-hidden="true" />
          <span className="font-bold text-stone-800">{isHi ? 'आपकी योजना के दर्शनीय स्थल:' : 'Places in your plan:'}</span>
          {highlights.map((place) => (
            <span
              key={place}
              className="rounded-full border border-orange-200/80 bg-white px-3 py-1 font-medium text-stone-800 shadow-2xs text-[11px]"
            >
              {place}
            </span>
          ))}
        </div>
      )}

      {/* Packages Grid */}
      <div className="mt-6 space-y-4">
        {packages.map((pkg) => {
          const pricing = calculatePackagePricing(pkg, days, travellers, startDate);
          const isExpanded = expandedPkgId === pkg.id;

          return (
            <article
              key={pkg.id}
              className={`rounded-3xl border transition-all duration-300 bg-white overflow-hidden shadow-xs hover:shadow-md ${
                isExpanded ? 'border-orange-400 ring-2 ring-orange-200/50' : 'border-stone-200 hover:border-orange-300'
              }`}
            >
              {/* Package Header Bar */}
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-200">
                      {isHi ? pkg.categoryHi : pkg.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {isHi ? pkg.badgeHi : pkg.badge}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <strong>{pkg.rating}</strong>
                      <span className="text-stone-400 font-normal">({pkg.reviewsCount} {isHi ? 'समीक्षाएं' : 'reviews'})</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 leading-snug">
                    {isHi ? pkg.titleHi : pkg.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {isHi ? pkg.taglineHi : pkg.tagline}
                  </p>

                  {/* Highlights Bar */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
                    {(isHi ? pkg.highlightsHi : pkg.highlights).slice(0, 3).map((hl, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-[11px] font-medium"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Action Box */}
                <div className="lg:w-72 shrink-0 bg-stone-50/80 p-4 rounded-2xl border border-stone-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{isHi ? 'प्रति यात्री दर' : 'Per Person Rate'}</span>
                      <span className="line-through text-stone-400 font-mono text-[11px]">
                        ₹{pricing.originalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-stone-900">
                        ₹{pricing.perPersonRate.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        / {isHi ? 'व्यक्ति' : 'traveller'}
                      </span>
                    </div>

                    <div className="text-[11px] text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
                      <span>{isHi ? 'कुल पैकेज मूल्य:' : 'Total Package Price:'}</span>
                      <strong className="font-mono text-stone-900">
                        ₹{pricing.totalPackagePrice.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-stone-500 font-normal">
                        ({travellers} {travellers === 1 ? (isHi ? 'यात्री' : 'traveller') : (isHi ? 'यात्री' : 'travellers')})
                      </span>
                    </div>

                    <div className="mt-1.5 text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-semibold flex items-center gap-1 w-fit">
                      <Check className="w-3 h-3" />
                      <span>{pricing.currentStatus}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPkgForBooking(pkg)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{isHi ? 'यह पैकेज चुनें / बुक करें' : 'Reserve This Package'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                      className="text-xs font-semibold text-stone-700 hover:text-orange-700 py-1 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isExpanded ? (isHi ? 'कम विवरण देखें' : 'Hide Details') : (isHi ? 'संपूर्ण विवरण व सुविधाएं देखें' : 'View Inclusions & Details')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Full Inclusions & Specifics Panel */}
              {isExpanded && (
                <div className="border-t border-stone-200/90 bg-stone-50/60 p-5 sm:p-6 space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Inclusions */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isHi ? 'सत्यापित समावेशन (Inclusions)' : 'Verified Package Inclusions'}</span>
                      </div>
                      <div className="space-y-2">
                        {(isHi ? pkg.inclusionsHi : pkg.inclusions).map((inc, i) => (
                          <div key={i} className="text-xs text-stone-800 flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stay & Transport Specifics */}
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-orange-600" />
                          <span>{isHi ? 'आवास श्रेणी' : 'Hotel Accommodation Tier'}</span>
                        </div>
                        <div className="text-xs font-semibold text-stone-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                          {pkg.hotelTier}
                        </div>

                        <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 pt-1">
                          <Car className="w-4 h-4 text-orange-600" />
                          <span>{isHi ? 'निजी वाहन व आवागमन' : 'Dedicated AC Vehicle & Chauffeur'}</span>
                        </div>
                        <div className="text-xs font-semibold text-stone-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                          {pkg.vehicleType}
                        </div>
                      </div>

                      {/* Cancellation & Guarantee */}
                      <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-900 block font-bold mb-0.5">
                            {isHi ? 'रद्दीकरण नीति एवं संतुष्टि गारंटी' : 'Cancellation Policy & Guarantee'}
                          </strong>
                          <p className="leading-relaxed">
                            {isHi ? pkg.cancellationPolicyHi : pkg.cancellationPolicy}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Cross-Reference Comparison with External Portals (Clean, Non-Intrusive) */}
      <div className="mt-8 pt-5 border-t border-stone-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {isHi
                ? 'बाहरी ट्रैवल पोर्टल्स से बाजार दरों की तुलना (वैकल्पिक संदर्भ)'
                : 'Cross-Check Market Rates on External Portals (Optional Reference)'}
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            {isHi ? 'पारदर्शी मूल्य निर्धारण' : 'Transparent Market Benchmarks'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {EXTERNAL_PROVIDERS.map((provider) => (
            <a
              key={provider.name}
              href={
                provider.name === 'MakeMyTrip' && destination.toLowerCase() === 'mumbai'
                  ? 'https://www.makemytrip.com/holidays-india/mumbai-travel-packages.html'
                  : provider.url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl border border-stone-200 bg-white/80 hover:bg-white hover:border-orange-300 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                  {provider.name}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">{provider.description}</div>
              </div>
              <span className="mt-2 text-[11px] font-semibold text-orange-700 group-hover:underline flex items-center gap-1">
                <span>{isHi ? 'पोर्टल देखें' : 'View Portal'}</span>
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Reservation / Instant Voucher Modal */}
      {selectedPkgForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeBookingModal}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccessId ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHi ? 'विरासत सत्यापित बुकिंग अनुरोध' : 'Virasat Verified Booking'}</span>
                </div>

                <h3 className="text-xl font-serif font-black text-stone-900 leading-tight">
                  {isHi ? selectedPkgForBooking.titleHi : selectedPkgForBooking.title}
                </h3>

                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>{isHi ? 'गंतव्य शहर:' : 'Destination:'}</span>
                    <strong className="text-stone-900">{destination}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{isHi ? 'यात्रा अवधि:' : 'Duration:'}</span>
                    <strong className="text-stone-900">{days} Days / {Math.max(1, days - 1)} Nights</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>{isHi ? 'यात्री संख्या:' : 'Travellers:'}</span>
                    <strong className="text-stone-900">{travellers} Persons</strong>
                  </div>
                  {startDate && (
                    <div className="flex justify-between text-stone-600">
                      <span>{isHi ? 'आरंभिक तिथि:' : 'Start Date:'}</span>
                      <strong className="text-emerald-700 font-mono">{startDate}</strong>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                    <span>{isHi ? 'अनुमानित कुल पैकेज:' : 'Estimated Package Total:'}</span>
                    <span className="font-mono text-orange-700">
                      ₹{calculatePackagePricing(selectedPkgForBooking, days, travellers, startDate).totalPackagePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      {isHi ? 'मुख्य यात्री का नाम *' : 'Lead Traveller Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        {isHi ? 'मोबाइल नंबर (व्हाट्सएप) *' : 'Mobile / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        {isHi ? 'ईमेल पता' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      {isHi ? 'पिकअप स्थान' : 'Pickup Location'}
                    </label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    >
                      <option value="Railway Station">Main Railway Station</option>
                      <option value="Airport">Airport Arrival Terminal</option>
                      <option value="City Hotel">Hotel in City Center</option>
                      <option value="Self Drive Meeting Point">Monument Meeting Point</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md transition-all cursor-pointer"
                >
                  {isHi ? 'सत्यापित वाउचर जारी करें' : 'Confirm & Generate Instant Voucher'}
                </button>

                <p className="text-[11px] text-stone-500 text-center leading-tight">
                  {isHi
                    ? 'कोई अग्रिम भुगतान अनिवार्य नहीं। ऑन-ग्राउंड सत्यापन के पश्चात ही भुगतान करें।'
                    : 'Zero pre-payment required. 100% free cancellation up to 48 hours before check-in.'}
                </p>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-serif font-black text-stone-900">
                    {isHi ? 'बुकिंग सफलतापूर्वक सत्यापित!' : 'Booking Verified & Confirmed!'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {isHi
                      ? `आपका पैकेज वाउचर संदर्भ कोड जारी कर दिया गया है।`
                      : `Your verified package reservation voucher has been generated.`}
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                    <span className="text-stone-500">Booking Reference:</span>
                    <strong className="font-mono text-orange-700 text-sm">{bookingSuccessId}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Lead Traveller:</span>
                    <strong className="text-stone-900">{leadName}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Contact:</span>
                    <strong className="text-stone-900">{leadPhone}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Pickup:</span>
                    <strong className="text-stone-900">{pickupLocation}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Destination & Days:</span>
                    <strong className="text-stone-900">{destination} ({days} Days)</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-200 text-left flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Our dedicated on-ground concierge coordinator has been assigned to your booking. Your private chauffeur and ASI guide contact details will be shared on WhatsApp prior to your arrival.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-stone-900 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {isHi ? 'वापस यात्रा योजना पर जाएं' : 'Return to Itinerary Planner'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
