import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, MapPin, Sparkles } from 'lucide-react';

export interface HeritageBackgroundVideo {
  id: string;
  title: string;
  shortTitle: string;
  location: string;
  stateOrUT: string;
  category: 'Union Territory' | 'Indian Festival';
  videoUrl: string;
  fallbackImageUrl: string;
  description: string;
}

export const HERITAGE_BACKGROUND_VIDEOS: HeritageBackgroundVideo[] = [
  // --- UNION TERRITORIES ---
  {
    id: 'ut-delhi',
    title: 'Delhi: Qutub Minar & Historic Red Sandstone Corridors',
    shortTitle: 'Delhi: Qutub Minar',
    location: 'Mehrauli & Central Delhi',
    stateOrUT: 'Delhi (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-over-the-mountains-42997-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&auto=format&fit=crop&q=90',
    description: 'Towering 72.5m fluted red sandstone minaret and Mughal domes bathed in brilliant afternoon sunshine.',
  },
  {
    id: 'ut-ladakh',
    title: 'Ladakh: Thiksey Monastic Gompa & Pangong Azure Waters',
    shortTitle: 'Ladakh: Thiksey Gompa',
    location: 'Leh & Pangong Tso, Ladakh',
    stateOrUT: 'Ladakh (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-resort-with-palm-trees-42488-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1920&auto=format&fit=crop&q=90',
    description: 'High-altitude crystal daylight reflecting on whitewashed stupas and turquoise saline lake waters.',
  },
  {
    id: 'ut-jammu-kashmir',
    title: 'Jammu & Kashmir: Dal Lake Shikaras & Shalimar Mughal Gardens',
    shortTitle: 'Kashmir: Dal Lake',
    location: 'Srinagar, Kashmir Valley',
    stateOrUT: 'Jammu & Kashmir (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-turquoise-water-43187-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1920&auto=format&fit=crop&q=90',
    description: 'Sparkling morning sunshine dancing across tranquil Dal Lake with handcrafted cedar Shikara boats.',
  },
  {
    id: 'ut-puducherry',
    title: 'Puducherry: French Colonial Quarter & Promenade Beach',
    shortTitle: 'Puducherry: White Town',
    location: 'Goubert Avenue & French Quarter',
    stateOrUT: 'Puducherry (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-calm-sea-water-under-a-clear-blue-sky-43189-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1920&auto=format&fit=crop&q=90',
    description: 'Sunlit mustard yellow neoclassical colonial villas and bougainvillea avenues along the Bay of Bengal.',
  },
  {
    id: 'ut-andaman',
    title: 'Andaman & Nicobar: Cellular Jail Memorial & Radhanagar Coast',
    shortTitle: 'Andamans: Radhanagar',
    location: 'Port Blair & Havelock Island',
    stateOrUT: 'Andaman & Nicobar (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blue-sea-water-and-waves-rolling-on-the-shore-43188-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&auto=format&fit=crop&q=90',
    description: 'Sun-kissed turquoise waters and pristine white coral shorelines beneath clear blue equatorial skies.',
  },
  {
    id: 'ut-daman-diu',
    title: 'Daman & Diu: Portuguese Sea Fort Bastions & Coastal Ramparts',
    shortTitle: 'Daman & Diu: Sea Fort',
    location: 'Diu Island, Arabian Sea',
    stateOrUT: 'Dadra and Nagar Haveli and Daman and Diu (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-calm-sea-water-under-a-clear-blue-sky-43189-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1920&auto=format&fit=crop&q=90',
    description: '16th-century stone ramparts overlooking radiant Arabian Sea waves in golden coastal sunshine.',
  },
  {
    id: 'ut-chandigarh',
    title: 'Chandigarh: UNESCO Le Corbusier Capitol Complex & Sukhna Lake',
    shortTitle: 'Chandigarh: Capitol Complex',
    location: 'Sector 1, Chandigarh',
    stateOrUT: 'Chandigarh (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-over-the-mountains-42997-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1920&auto=format&fit=crop&q=90',
    description: 'Modernist concrete architectural geometry and serene shimmering waters under crisp bright skies.',
  },
  {
    id: 'ut-lakshadweep',
    title: 'Lakshadweep: Bangaram Coral Lagoon & Minicoy Lighthouse',
    shortTitle: 'Lakshadweep: Coral Atolls',
    location: 'Bangaram & Minicoy',
    stateOrUT: 'Lakshadweep (UT)',
    category: 'Union Territory',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-turquoise-water-43187-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&auto=format&fit=crop&q=90',
    description: 'Blinding white coral sands and crystal lagoons glowing beneath radiant tropical sun.',
  },

  // --- INDIAN FESTIVALS ---
  {
    id: 'fest-diwali',
    title: 'Diwali: Grand Deepavali Illuminations & Festival of Lights',
    shortTitle: 'Diwali: Festival of Lights',
    location: 'Celebrated Pan-India',
    stateOrUT: 'Pan-India',
    category: 'Indian Festival',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-over-the-mountains-42997-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=90',
    description: 'Radiant golden diyas, illuminated historic courtyards, and celebratory lights banishing darkness.',
  },
  {
    id: 'fest-holi',
    title: 'Holi: Festival of Colours & Spring Sunlight Celebration',
    shortTitle: 'Holi: Festival of Colours',
    location: 'Delhi (UT), Mathura & Nationwide',
    stateOrUT: 'Pan-India',
    category: 'Indian Festival',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-resort-with-palm-trees-42488-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1615886753866-79396abc446e?w=1920&auto=format&fit=crop&q=90',
    description: 'Explosions of organic saffron, crimson, magenta, and cyan colors under bright blue spring skies.',
  },
  {
    id: 'fest-hemis',
    title: 'Hemis Festival: Sacred Cham Masked Dance of Ladakh',
    shortTitle: 'Ladakh: Hemis Cham Dance',
    location: 'Hemis Gompa, Ladakh (UT)',
    stateOrUT: 'Ladakh (UT)',
    category: 'Indian Festival',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bright-sun-over-the-mountains-42997-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&auto=format&fit=crop&q=90',
    description: 'Sacred monastic Cham masked dances and vibrant silk dragon robes in the sunny Himalayan monastery courtyard.',
  },
  {
    id: 'fest-tulip-kashmir',
    title: 'Srinagar Tulip & Shikara Spring Festival',
    shortTitle: 'Kashmir: Tulip Festival',
    location: 'Zabarwan Hills, Srinagar, J&K (UT)',
    stateOrUT: 'Jammu & Kashmir (UT)',
    category: 'Indian Festival',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-turquoise-water-43187-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=1920&auto=format&fit=crop&q=90',
    description: 'Vibrant kaleidoscope of blooming tulips and decorated Shikara boats under clear Himalayan skies.',
  },
  {
    id: 'fest-eid-delhi',
    title: 'Eid Celebrations at Historic Jama Masjid',
    shortTitle: 'Delhi: Jama Masjid Eid',
    location: 'Old Delhi, Delhi (UT)',
    stateOrUT: 'Delhi (UT)',
    category: 'Indian Festival',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-resort-with-palm-trees-42488-large.mp4',
    fallbackImageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1920&auto=format&fit=crop&q=90',
    description: 'Morning prayer gathering within the grand red sandstone and white marble courtyard bathed in sunshine.',
  },
];

interface HeritageBackgroundVideoManagerProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const HeritageBackgroundVideoManager: React.FC<HeritageBackgroundVideoManagerProps> = ({
  currentIndex,
  onIndexChange,
  isPlaying,
  onTogglePlay,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = HERITAGE_BACKGROUND_VIDEOS[currentIndex] || HERITAGE_BACKGROUND_VIDEOS[0];
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Set 0.5x physical playback speed and control play/pause
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // Make the video gallery move automatically: Auto-cycle every 14 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onIndexChange((currentIndex + 1) % HERITAGE_BACKGROUND_VIDEOS.length);
    }, 14000);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, onIndexChange]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FIXED BACKGROUND VIDEO LAYER ACROSS COMPLETE HERITAGE SECTION          */}
      {/* While user scrolls anywhere in Heritage, this video continuously plays!   */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Full-bleed HTML5 Video playing at 0.5x speed */}
        <video
          ref={videoRef}
          key={`bg-video-${activeVideo.id}`}
          src={activeVideo.videoUrl}
          poster={activeVideo.fallbackImageUrl}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-center filter brightness-105 contrast-105 saturate-110 transition-opacity duration-1000"
        />

        {/* Fallback image with 0.5x gentle pan in case video is buffering */}
        {!videoLoaded && (
          <img
            src={activeVideo.fallbackImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-105 contrast-105 animate-slow-pan-05x"
          />
        )}

        {/* Lightweight translucent scrim allowing the 0.5x background video to be vividly visible */}
        <div className="absolute inset-0 bg-stone-950/25 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 via-transparent to-stone-900/35" />

        {/* Subtle Warm Sunlight Glare */}
        <div className="absolute inset-0 bg-radial-at-tr from-amber-400/10 via-transparent to-transparent mix-blend-screen" />
      </div>
    </>
  );
};
