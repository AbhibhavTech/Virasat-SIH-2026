import React from 'react';
import { Compass, Landmark, Navigation, Heart, ShieldCheck, ExternalLink, Sparkles, Database } from 'lucide-react';
import { NavTab } from './Sidebar';
import { VirasatBrand, FlowingTricolourRibbon, HeritageSkylineSilhouette } from '../common/TricolourBranding';

interface SimpleFooterProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectCity?: (city: string) => void;
  onOpenDatabaseStatus?: () => void;
}

export const SimpleFooter: React.FC<SimpleFooterProps> = ({
  onNavigateTab,
  onSelectCity,
  onOpenDatabaseStatus,
}) => {
  return (
    <footer className="mt-20 border-t border-[#EFE8DF] bg-white text-[#0B192C] relative overflow-hidden">
      {/* Subtle Flowing Tricolour Accent in Background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-40">
        <FlowingTricolourRibbon variant="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <VirasatBrand onClick={() => onNavigateTab('home')} size="lg" />

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm pt-1">
              Discover India&apos;s living heritage. Explore monuments, cultures, natural wonders, and sacred sanctuaries across every region of India with digital innovation and verified transit.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-xs text-stone-700 italic">
              &quot;वसुधैव कुटुम्बकम् — The World is One Family. Exploring India with reverence for history, local artisans, and sustainable travel.&quot;
            </div>
          </div>

          {/* Quick Discover Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Explore India
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Destinations & City Hubs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('heritage')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Major Monuments & Famous Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('map')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Interactive GIS Heritage Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('3d')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  3D WebGL Museum
                </button>
              </li>
            </ul>
          </div>

          {/* Planning & Transit Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Journey Planning
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Day Circuit Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Multimodal Route Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('india')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  All India States & Cities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('map')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Interactive GIS Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('ai')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Ask Virasat AI Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Planning & Saved Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Planning & Trips
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  AI City Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('routes')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Multimodal Transit Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('trips')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  Saved Trips & Circuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="text-stone-600 hover:text-amber-800 transition"
                >
                  My Travel Profile
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDatabaseStatus}
                  className="text-stone-600 hover:text-amber-800 transition flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-amber-700" />
                  <span>Master Database Status</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Heritage Skyline Silhouette Baseline */}
        <div className="pt-6 border-t border-stone-100 flex flex-col items-center">
          <HeritageSkylineSilhouette className="w-full max-w-4xl h-14 sm:h-18" fillColor="#0B192C" opacity={0.12} />
          
          <div className="mt-4 flex flex-col items-center space-y-1.5 text-center">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-serif font-bold tracking-wider text-[#0B192C]">
              <span>Explore</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
              <span>Respect</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#046A38]" />
              <span>Preserve</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium tracking-tight">
              Incredible India. For Generations.
            </p>
          </div>
        </div>

        {/* Bottom Bar with Credits */}
        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 Virasat. Developed for Smart India Hackathon 2026. Archaeological Survey of India & Ministry of Tourism data alignment.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDatabaseStatus}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-amber-50 hover:text-amber-900 px-3 py-1 rounded-full border border-stone-200 hover:border-amber-300 transition"
              title="Inspect Master Tourism Database Layer"
            >
              <Database className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Master Database Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#046A38]"></span>
            </button>
            <span className="text-[11px] font-semibold text-[#046A38] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              National Heritage Repository
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
