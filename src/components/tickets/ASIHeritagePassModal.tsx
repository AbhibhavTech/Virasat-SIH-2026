import React, { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ASIHeritagePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  monumentName: string;
  cityName?: string;
  stateName?: string;
  standardFeeDomestic?: number;
  standardFeeForeign?: number;
  visitingHours?: string;
}

export const ASIHeritagePassModal: React.FC<ASIHeritagePassModalProps> = ({
  isOpen,
  onClose,
  monumentName,
  cityName = 'India',
  stateName = '',
  standardFeeDomestic = 50,
  standardFeeForeign = 500,
  visitingHours = '06:00 AM - 06:00 PM',
}) => {
  // Step 1: Form, Step 2: Generated E-Ticket Pass
  const [step, setStep] = useState<'form' | 'pass'>('form');

  // Form State
  const [visitDate, setVisitDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState<'forenoon' | 'afternoon'>('forenoon');
  const [indianAdults, setIndianAdults] = useState<number>(1);
  const [foreignAdults, setForeignAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);

  const [leadName, setLeadName] = useState<string>('');
  const [idType, setIdType] = useState<string>('Aadhaar Card');
  const [idNumber, setIdNumber] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Generated Ticket Info
  const [ticketId, setTicketId] = useState<string>('');
  const [bookingTimestamp, setBookingTimestamp] = useState<string>('');

  if (!isOpen) return null;

  const totalAmount =
    indianAdults * (standardFeeDomestic || 50) +
    foreignAdults * (standardFeeForeign || 500);

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      alert('Please enter the primary visitor name');
      return;
    }
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newTicketId = `ASI-VRST-${new Date().getFullYear()}-${randomSuffix}`;
    setTicketId(newTicketId);
    setBookingTimestamp(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    setStep('pass');
  };

  const handleCopyTicketId = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(ticketId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setStep('form');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-fadeIn">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#FF671F] via-amber-700 to-stone-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Ticket className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                Archaeological Survey of India
              </div>
              <h3 className="text-base font-serif font-black tracking-tight leading-tight">
                Virasat Official Heritage E-Pass
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'form' ? (
            <form onSubmit={handleGeneratePass} className="space-y-5">
              {/* Monument Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                    Selected Heritage Site
                  </div>
                  <h4 className="font-bold text-stone-900 text-base">{monumentName}</h4>
                  <div className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                    <span>
                      {cityName}
                      {stateName ? `, ${stateName}` : ''}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> ASI Protected
                  </span>
                  <div className="text-[11px] text-stone-500 mt-1 font-mono">{visitingHours}</div>
                </div>
              </div>

              {/* Date & Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF671F]" /> Date of Visit
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF671F]" /> Entry Time Slot
                  </label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value as 'forenoon' | 'afternoon')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                  >
                    <option value="forenoon">Forenoon (06:00 AM – 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM – 06:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Visitor Quantities */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF671F]" /> Number of Visitors
                </label>

                {/* Indian Citizen */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Indian / SAARC Citizens</div>
                    <div className="text-[11px] text-stone-500 font-semibold">₹{standardFeeDomestic} / person</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIndianAdults((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-stone-900 text-sm">{indianAdults}</span>
                    <button
                      type="button"
                      onClick={() => setIndianAdults((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Foreign Tourist */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Foreign Tourists</div>
                    <div className="text-[11px] text-stone-500 font-semibold">₹{standardFeeForeign} / person</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForeignAdults((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-stone-900 text-sm">{foreignAdults}</span>
                    <button
                      type="button"
                      onClick={() => setForeignAdults((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children (<15 years) */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Children (Under 15 Years)</div>
                    <div className="text-[11px] text-emerald-600 font-bold">FREE Entry (ASI Policy)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold text-stone-900 text-sm">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-stone-700 text-sm flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Visitor Info */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Primary Visitor Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Full Name (as per ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Identity Proof Type *
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID Card">Voter ID Card</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ID Number (Last 4 digits or Number)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5421"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Mobile Number (for SMS Pass)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-800 bg-stone-50 focus:bg-white focus:border-[#FF671F] focus:outline-hidden transition"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Action Bar */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">
                    Total Entrance Fee
                  </div>
                  <div className="text-xl font-black text-stone-900">₹{totalAmount}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Includes ASI Monument Heritage Cess</div>
                </div>
                <button
                  type="submit"
                  disabled={indianAdults + foreignAdults + children === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-orange-700 disabled:bg-stone-300 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Generate E-Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Digital E-Ticket Pass Display */
            <div className="space-y-5 animate-fadeIn">
              {/* Printable Ticket Card */}
              <div
                id="printable-asi-ticket"
                className="relative rounded-2xl border-2 border-stone-800 bg-stone-900 text-white p-5 shadow-xl overflow-hidden"
              >
                {/* Watermark Emblem */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none text-9xl">
                  🏛️
                </div>

                {/* Top Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇮🇳</span>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                        Government of India • Ministry of Culture
                      </div>
                      <div className="text-xs font-serif font-black tracking-wide text-stone-100">
                        ARCHAEOLOGICAL SURVEY OF INDIA
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED ACCESS
                    </span>
                  </div>
                </div>

                {/* Monument & Pass ID */}
                <div className="py-4 border-b border-stone-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Monument</div>
                    <h3 className="text-xl font-serif font-black text-amber-300">{monumentName}</h3>
                    <div className="text-xs text-stone-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FF671F]" />
                      <span>{cityName}</span>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Pass Reference</div>
                    <div className="text-base font-mono font-black text-white tracking-widest">{ticketId}</div>
                    <div className="text-[10px] text-stone-400">{bookingTimestamp}</div>
                  </div>
                </div>

                {/* Entry Details & QR Grid */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-stone-400">Lead Visitor: </span>
                      <strong className="text-white">{leadName}</strong> ({idType})
                    </div>
                    <div>
                      <span className="text-stone-400">Visit Date: </span>
                      <strong className="text-amber-300">{visitDate}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400">Entry Window: </span>
                      <strong className="text-stone-200">
                        {slot === 'forenoon' ? 'Forenoon (06:00 AM – 12:00 PM)' : 'Afternoon (12:00 PM – 06:00 PM)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400">Admit Count: </span>
                      <strong className="text-white">
                        {indianAdults + foreignAdults + children} Person(s)
                      </strong>{' '}
                      <span className="text-stone-400">
                        (Ind: {indianAdults}, For: {foreignAdults}, Ch: {children})
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">Total Fee Paid: </span>
                      <strong className="text-emerald-400">₹{totalAmount}</strong> (Paid Online via Virasat Pass)
                    </div>
                  </div>

                  {/* Scannable SVG QR Code */}
                  <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl text-stone-900 shadow-inner">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-24 h-24"
                      shapeRendering="crispEdges"
                    >
                      {/* Stylized authentic QR code pattern */}
                      <rect width="100" height="100" fill="#ffffff" />
                      <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

                      <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

                      <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

                      <rect x="42" y="12" width="6" height="12" fill="#0f172a" />
                      <rect x="52" y="16" width="8" height="6" fill="#0f172a" />
                      <rect x="40" y="38" width="20" height="6" fill="#0f172a" />
                      <rect x="44" y="48" width="12" height="12" fill="#0f172a" />
                      <rect x="64" y="42" width="12" height="8" fill="#0f172a" />
                      <rect x="80" y="48" width="10" height="6" fill="#0f172a" />
                      <rect x="40" y="68" width="10" height="14" fill="#0f172a" />
                      <rect x="56" y="64" width="8" height="18" fill="#0f172a" />
                      <rect x="70" y="72" width="18" height="12" fill="#0f172a" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold tracking-tight text-stone-600 mt-1">
                      SCAN AT TURNSTILE
                    </span>
                  </div>
                </div>

                {/* Footer instructions */}
                <div className="pt-3 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
                  <span>Show this digital pass on your phone or print at monument entrance.</span>
                  <span className="font-mono text-stone-300">VIRASAT-GOV-VERIFIED</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print / Save Pass</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyTicketId}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
                  <span>{isCopied ? 'Copied' : 'Copy ID'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition cursor-pointer"
                >
                  Book Another Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
