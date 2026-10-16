import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  ShieldAlert,
  MapPin,
  Ambulance,
  Phone,
  Flame,
  Train,
  HeartHandshake,
  AlertOctagon,
  Copy,
  Check,
  Navigation,
  Loader2,
} from 'lucide-react';

interface TouristSafetySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: string;
}

export const TouristSafetySOSModal: React.FC<TouristSafetySOSModalProps> = ({
  isOpen,
  onClose,
  selectedCity = 'Mumbai',
}) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Detect approximate GPS location for emergency sharing
      if ('geolocation' in navigator) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setGpsLocation({
              lat: Number(pos.coords.latitude.toFixed(5)),
              lng: Number(pos.coords.longitude.toFixed(5)),
            });
            setIsLocating(false);
          },
          () => setIsLocating(false),
          { timeout: 8000 }
        );
      }

      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(num);
      setCopiedNumber(num);
      setTimeout(() => setCopiedNumber(null), 2500);
    }
  };

  const emergencyContacts = [
    {
      title: 'National Emergency Number',
      number: '112',
      badge: 'All-in-One Emergency',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    {
      title: 'Incredible India Tourist Helpline',
      number: '1363',
      badge: '24x7 Multi-lingual Guidance',
      icon: <PhoneCall className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200 text-orange-950',
      btnColor: 'bg-[#FF671F] hover:bg-[#E65100] text-white',
    },
    {
      title: 'Police Assistance',
      number: '100',
      badge: 'Local Police & Safety',
      icon: <ShieldAlert className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-950',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      title: 'Medical Ambulance Service',
      number: '108',
      badge: 'National Ambulance / 102',
      icon: <Ambulance className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      title: 'Indian Railways Security Helpline',
      number: '139',
      badge: 'Railway Protection Force',
      icon: <Train className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-950',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    {
      title: 'Fire Emergency Service',
      number: '101',
      badge: 'Rescue & Fire Brigade',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  ];

  return (
    <div
      id="tourist-safety-modal-backdrop"
      className="fixed inset-0 z-[2200] flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="tourist-safety-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
        className="relative w-full max-w-xl my-auto bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col animate-scaleUp max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="sos-modal-title" className="text-lg sm:text-xl font-bold font-serif">
                Tourist Safety &amp; Emergency SOS
              </h3>
              <p className="text-xs text-rose-100">
                Official Indian Government 24x7 Emergency Helplines for Travelers
              </p>
            </div>
          </div>

          {/* Current GPS Position Card */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-between text-xs text-rose-50">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {isLocating ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Detecting GPS Coordinates…</span>
                  </span>
                ) : gpsLocation ? (
                  <span>
                    Your Coordinates: <strong>{gpsLocation.lat}, {gpsLocation.lng}</strong> ({selectedCity})
                  </span>
                ) : (
                  <span>Location: <strong>{selectedCity}, India</strong></span>
                )}
              </span>
            </div>

            {gpsLocation && (
              <button
                type="button"
                onClick={() => handleCopy(`${gpsLocation.lat}, ${gpsLocation.lng}`)}
                className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded font-bold cursor-pointer transition"
              >
                {copiedNumber === `${gpsLocation.lat}, ${gpsLocation.lng}` ? 'Copied GPS' : 'Copy GPS'}
              </button>
            )}
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyContacts.map((c) => (
              <div
                key={c.number}
                className={`p-3.5 rounded-2xl border ${c.color} flex flex-col justify-between space-y-2.5 shadow-2xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{c.title}</div>
                      <div className="text-[10px] text-stone-500 font-medium">{c.badge}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xl font-bold font-mono tracking-tight">
                    {c.number}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(c.number)}
                      className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition shadow-2xs cursor-pointer"
                      title="Copy Number"
                    >
                      {copiedNumber === c.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={`tel:${c.number}`}
                      className={`px-3 py-1.5 rounded-xl ${c.btnColor} font-bold text-xs flex items-center gap-1 shadow-xs transition active:scale-95`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines & Safety Advice */}
          <div className="pt-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-orange-600" />
              <span>Ministry of Tourism Safety Guidelines</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Always use registered prepaid taxi booths or official ride-hailing apps at stations/airports.
              Keep your emergency contacts and digital passport easily accessible on your phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
