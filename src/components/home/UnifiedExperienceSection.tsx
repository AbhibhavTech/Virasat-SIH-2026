import React, { useState } from 'react';
import { UtensilsCrossed, Palette, Sparkles, Flame, Compass, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { GuideIllustration } from '../cultural-guides/GuideIllustrations';

interface UnifiedExperienceSectionProps {
  onNavigateTab: (tab: NavTab) => void;
  selectedCity?: string;
}

type ExperienceCategory = 'Food' | 'Culture' | 'Crafts' | 'Festivals';

interface ExperienceItem {
  id: string;
  category: ExperienceCategory;
  title: string;
  hindiTitle: string;
  region: string;
  description: string;
  giTagOrTradition?: string;
  imageUrl: string;
}

export const UnifiedExperienceSection: React.FC<UnifiedExperienceSectionProps> = ({
  onNavigateTab,
  selectedCity = 'All India',
}) => {
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory>('Food');

  const categories: { id: ExperienceCategory; label: string; icon: any }[] = [
    { id: 'Food', label: 'Food', icon: UtensilsCrossed },
    { id: 'Culture', label: 'Culture', icon: Palette },
    { id: 'Crafts', label: 'Crafts', icon: Sparkles },
    { id: 'Festivals', label: 'Festivals', icon: Flame },
  ];

  const experienceData: ExperienceItem[] = [
    // Food
    {
      id: 'food-awadhi',
      category: 'Food',
      title: 'Awadhi & Mughlai Dum Pukht Traditions',
      hindiTitle: 'अवधी दम पुख्त',
      region: 'Lucknow / Delhi / Agra',
      description: 'Slow-cooking in sealed heavy-bottomed clay degchis over low charcoal embers, infusing cardamom, saffron, and tender cuts.',
      giTagOrTradition: 'Centuries-Old Royal Nizami & Nawabi Recipe',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'food-mumbai-street',
      category: 'Food',
      title: 'Mumbai Coastal Street Culinary Culture',
      hindiTitle: 'मुंबई स्ट्रीट फूड',
      region: 'Mumbai, Maharashtra',
      description: 'Freshly fried spicy batata vada in pav, pav bhaji sizzling on giant cast-iron tawas, and tangy Pani Puri along Chowpatty.',
      giTagOrTradition: 'Iconic Urban Culinary Phenomenon',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'food-south-dosa',
      category: 'Food',
      title: 'Kerala Ghee Roast & Filter Coffee',
      hindiTitle: 'केरल घी रोस्ट',
      region: 'Kochi, Kerala',
      description: 'Crisp golden fermented rice-lentil crepes served with freshly ground coconut chutneys, vegetable sambar, and chicory filter brew.',
      giTagOrTradition: 'Traditional Morning Temple Breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
    },

    // Culture
    {
      id: 'culture-kathakali',
      category: 'Culture',
      title: 'Kathakali Classical Dance Drama',
      hindiTitle: 'कथकली नृत्य',
      region: 'Kochi, Kerala',
      description: 'A 17th-century classical synthesis of literature, vocal music, percussion, and elaborate mineral-based facial chutti makeup.',
      giTagOrTradition: 'UNESCO Intangible Cultural Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'culture-lavani',
      category: 'Culture',
      title: 'Lavani Rhythm & Dholki Folk',
      hindiTitle: 'लावणी लोकनृत्य',
      region: 'Maharashtra',
      description: 'Fast-paced, vibrant Maharashtrian folk dance accompanied by the thunderous beats of the dholki and nine-yard Nauvari sarees.',
      giTagOrTradition: 'Living Folk Expression',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'culture-sufi',
      category: 'Culture',
      title: 'Nizamuddin Sufi Qawwali Tradition',
      hindiTitle: 'सूफी कव्वाली',
      region: 'New Delhi',
      description: 'Soulful mystic verses penned by Hazrat Amir Khusrau sung in the open marble courtyards of Dargah Nizamuddin Auliya for over 700 years.',
      giTagOrTradition: 'Living Medieval Spiritual Heritage',
      imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
    },

    // Crafts
    {
      id: 'craft-banarasi',
      category: 'Crafts',
      title: 'Banarasi Handloom Silk & Real Zari',
      hindiTitle: 'बनारसी रेशम व ज़री',
      region: 'Varanasi, Uttar Pradesh',
      description: 'Finely woven mulberry silk textiles embellished with intricate Mughal floral jal designs and metallic silver-gilt thread.',
      giTagOrTradition: 'GI-Certified Geographical Indication',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'craft-jaipur-pottery',
      category: 'Crafts',
      title: 'Jaipur Cobalt Blue Pottery',
      hindiTitle: 'जयपुर ब्लू पॉटरी',
      region: 'Jaipur, Rajasthan',
      description: 'A distinctive non-clay ceramic craft prepared from quartz stone powder, Fuller’s earth, and glass frit, hand-painted with cobalt oxides.',
      giTagOrTradition: 'GI-Certified Traditional Craft Guild',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'craft-warli',
      category: 'Crafts',
      title: 'Warli Indigenous Geometric Pigment Art',
      hindiTitle: 'वारली आदिवासी कला',
      region: 'North Sahyadri, Maharashtra',
      description: 'Indigenous tribal wall art utilizing simple geometric forms—circle, triangle, and square—depicting the Mother Goddess and harvest harmony.',
      giTagOrTradition: 'GI-Certified Indigenous Tribal Art',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80',
    },

    // Festivals
    {
      id: 'festival-chhath',
      category: 'Festivals',
      title: 'Bihar Chhath Mahaparv & Surya Arghya',
      hindiTitle: 'बिहार छठ महापर्व एवं सूर्य अर्घ्य',
      region: 'Ganga Ghats, Patna & Bihar',
      description: 'The sublime four-day solar thanksgiving where devotees stand in sacred river waters to offer Sandhya and Usha Arghya with bamboo soops laden with thekua, sugarcane, and seasonal harvest.',
      giTagOrTradition: 'Ancient Vedic Solar Thanksgiving',
      imageUrl: '/images/bihar-chhath-puja.jpg',
    },
    {
      id: 'festival-holi',
      category: 'Festivals',
      title: 'Braj Mathura Holi & Lathmar Carnival',
      hindiTitle: 'ब्रज मथुरा होली एवं लठमार महोत्सव',
      region: 'Barsana, Mathura & Vrindavan, Uttar Pradesh',
      description: 'The world-famous carnival of colors where streets erupt in swirling clouds of organic abir and gulal, temple courtyard flower showers, and folk Krishna-Radha rasleela traditions.',
      giTagOrTradition: 'Traditional Spring Carnival of Colors',
      imageUrl: '/images/braj-holi-celebration.jpg',
    },
    {
      id: 'festival-diwali',
      category: 'Festivals',
      title: 'Diwali Festival of Lights & Deepotsav',
      hindiTitle: 'दीपावली दीपोत्सव एवं प्रकाश पर्व',
      region: 'Ayodhya, Varanasi & Pan-India',
      description: 'The sublime pan-India celebration of light conquering darkness, featuring tens of thousands of golden earthen oil lamps illuminating ancient river ghats and homes, accompanied by Lakshmi puja and twilight fireworks.',
      giTagOrTradition: 'Pan-India Festival of Lights',
      imageUrl: '/images/diwali-lamps-diyas.jpg',
    },
    {
      id: 'festival-lohri',
      category: 'Festivals',
      title: 'Punjabi Lohri Winter Harvest Celebration',
      hindiTitle: 'पंजाबी लोहड़ी शीतकालीन फसल उत्सव',
      region: 'Amritsar & Heritage Punjab',
      description: 'The premier winter solstice festival of Punjab celebrated around roaring community bonfires with pulsating dhol beats, spontaneous bhangra and giddha, and traditional offerings of til-rewri, gajak, and peanuts.',
      giTagOrTradition: 'Traditional North Indian Winter Solstice',
      imageUrl: '/images/punjab-lohri.jpg',
    },
    {
      id: 'festival-onam',
      category: 'Festivals',
      title: 'Kerala Onam Harvest & Vallamkali',
      hindiTitle: 'केरल ओणम फसल उत्सव एवं नौका दौड़',
      region: 'Punnamada Lake & Aranmula, Kerala',
      description: 'The premier harvest festival of God’s Own Country celebrating King Mahabali’s homecoming with thunderous Chundan Vallam snake boat races, Athapookkalam floral carpets, and multi-course Onam Sadhya.',
      giTagOrTradition: 'Traditional Kerala Harvest Thanksgiving',
      imageUrl: '/images/kerala-onam-boatrace.jpg',
    },
    {
      id: 'festival-pongal',
      category: 'Festivals',
      title: 'Tamil Thai Pongal Harvest Festival',
      hindiTitle: 'थाई पोंगल फसल उत्सव',
      region: 'Madurai & Thanjavur, Tamil Nadu',
      description: 'The ancient four-day Tamil harvest celebration centering on freshly boiled sweet milk rice overflowing from decorated earthen pots, accompanied by sugarcane, kolam, and Mattu Pongal veneration.',
      giTagOrTradition: 'Traditional Tamil Harvest Thanksgiving',
      imageUrl: '/images/tamil-nadu-pongal.jpg',
    },
    {
      id: 'festival-makar-sankranti',
      category: 'Festivals',
      title: 'Makar Sankranti & International Kite Festival',
      hindiTitle: 'मकर संक्रांति एवं उत्तरायण पतंगोत्सव',
      region: 'Sabarmati Riverfront, Ahmedabad, Gujarat',
      description: 'The world-famous Uttarayan skies filled with giant designer kites, rooftop festivities across Gujarat, harvest thanksgiving, and sweet sesame-jaggery feasts.',
      giTagOrTradition: 'Traditional Harvest & Solar Festival',
      imageUrl: '/images/makar-sankranti-kites.jpg',
    },
    {
      id: 'festival-republic-day',
      category: 'Festivals',
      title: 'Republic Day Grand Parade',
      hindiTitle: 'गणतंत्र दिवस भव्य परेड',
      region: 'Kartavya Path & India Gate, New Delhi',
      description: 'The ceremonial march past featuring the iconic BSF camel regiment, Indian Armed Forces contingents, 28 states cultural tableaux, and flypasts under the shadow of India Gate.',
      giTagOrTradition: 'National Sovereign Observance',
      imageUrl: '/images/republic-day-parade.jpg',
    },
    {
      id: 'festival-independence-day',
      category: 'Festivals',
      title: 'Independence Day National Ceremony',
      hindiTitle: 'स्वतंत्रता दिवस राष्ट्रीय समारोह',
      region: 'Lahori Gate, Red Fort, Old Delhi',
      description: 'The Prime Minister hoists the national Tricolour on the ramparts of Red Fort, followed by a 21-gun salute, floral helicopter showers, and the historic address to the nation.',
      giTagOrTradition: 'National Sovereign Observance',
      imageUrl: '/images/independence-day-red-fort.jpg',
    },
    {
      id: 'festival-ganga-aarti',
      category: 'Festivals',
      title: 'Varanasi Ganga Maha Aarti',
      hindiTitle: 'काशी गंगा आरती',
      region: 'Dashashwamedh Ghat, Varanasi',
      description: 'Daily twilight ceremonial offering where priests draped in saffron robes manipulate tiered brass lamps weighing over 4.5kg to hymn chants.',
      giTagOrTradition: 'Daily Living Riverfront Ritual',
      imageUrl: '/images/varanasi-ganga-aarti.jpg',
    },
    {
      id: 'festival-ganesh',
      category: 'Festivals',
      title: 'Ganesh Utsav Sarvajanik Celebrations',
      hindiTitle: 'गणेशोत्सव',
      region: 'Mumbai & Pune, Maharashtra',
      description: 'A grand 10-day community cultural celebration inaugurated in 1893, featuring public artisan pandals, dhol-tasha beats, and sea immersions.',
      giTagOrTradition: 'Historic Freedom Era Movement',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const filteredItems = experienceData.filter((item) => item.category === activeCategory);

  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Living Traditions</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Experience India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1">
            Immerse yourself in centuries of culinary wisdom, master artisan guilds, and sacred celebrations.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('india')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto active:scale-98"
        >
          <span>Explore All Regional Highlights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rasika Digital Guide Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-amber-50/50 border border-rose-200/80 shadow-2xs">
        <div className="shrink-0">
          <GuideIllustration characterId="rasika" size="md" animated={true} />
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold text-rose-950">Rasika (रसिका)</span>
            <span className="text-[10px] font-semibold bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Arts & Culinary Connoisseur
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl">
            "To truly touch India, one must savor its slow-cooked claypot recipes, hear the resonance of temple dholkis, and meet the generational weavers whose hands weave living poetry."
          </p>
        </div>
      </div>

      {/* Single Unified Category Filter (Not 5 Separate Dashboard Panels) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-rose-800 text-white shadow-xs scale-102'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigateTab('india')}
            className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

              {item.giTagOrTradition && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-rose-900 uppercase tracking-wide shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-rose-700" />
                  <span>{item.giTagOrTradition}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-amber-200 font-medium mb-0.5">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{item.region}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-rose-100 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-semibold text-rose-800 group-hover:text-rose-950">
                <span>Explore Artisan & Origin</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
