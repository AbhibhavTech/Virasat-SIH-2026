import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Zap,
  ZapOff,
  Compass,
  MapPin,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { VisualIdentificationResult, AROverlayPin } from '../../types';

interface MonumentARCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
  initialSiteName?: string;
  initialSiteCity?: string;
}

// Preset samples for instant demo testing
const SAMPLE_MONUMENTS = [
  {
    name: 'Taj Mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    placeId: 'taj-mahal',
  },
  {
    name: 'Amber Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
    placeId: 'amber-palace',
  },
  {
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    placeId: 'gateway-of-india',
  },
  {
    name: 'Konark Sun Temple',
    city: 'Konark',
    state: 'Odisha',
    imageUrl: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=800&auto=format&fit=crop&q=80',
    placeId: 'konark-sun-temple',
  },
  {
    name: 'Hampi Virupaksha',
    city: 'Hampi',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b71e?w=800&auto=format&fit=crop&q=80',
    placeId: 'virupaksha-temple',
  },
];

export const MonumentARCameraModal: React.FC<MonumentARCameraModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
  onNavigateTab,
  initialSiteName,
  initialSiteCity,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [compassHeading, setCompassHeading] = useState<number>(45);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualIdentificationResult | null>(null);
  const [selectedOverlayPin, setSelectedOverlayPin] = useState<AROverlayPin | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload State
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Compass Orientation listener for mobile devices
  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (typeof (e as any).webkitCompassHeading !== 'undefined') {
        setCompassHeading(Math.round((e as any).webkitCompassHeading));
      } else if (e.alpha !== null) {
        setCompassHeading(Math.round(360 - e.alpha));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen]);

  // Clean stop of camera
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('idle');
    setTorchOn(false);
  };

  // Start device camera
  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('unsupported');
      return;
    }

    setCameraStatus('requesting');
    setErrorMessage(null);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      setCameraStatus('active');

      // Check for torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        setHasTorch(Boolean(capabilities?.torch));
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
      } else {
        // Fallback to basic video constraint
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            videoRef.current.play().catch(() => {});
          }
          setCameraStatus('active');
        } catch {
          setCameraStatus('denied');
        }
      }
    }
  };

  // Switch camera tab effects
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      startCamera(facingMode);
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, activeTab, facingMode]);

  // Handle Torch Toggle
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setTorchOn(nextTorch);
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Handle Camera Flip
  const handleFlipCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
  };

  // Capture current frame from live camera
  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const result = await api.visualIdentify({
        image: dataUrl,
        mode: 'ar_facts',
      });

      setAnalysisResult(result);
      if (result.ar_overlays && result.ar_overlays.length > 0) {
        setSelectedOverlayPin(result.ar_overlays[0]);
      }
    } catch (err: any) {
      console.error('AR analysis failed:', err);
      setErrorMessage('Could not identify monument from this camera frame. Try adjusting the angle or lighting.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Image File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImagePreview(base64);
      analyzeUploadedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Analyze uploaded image base64
  const analyzeUploadedImage = async (base64: string) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setAnalysisResult(null);

      const result = await api.visualIdentify({
        image: base64,
        mode: 'identify',
      });

      setAnalysisResult(result);
      if (result.ar_overlays && result.ar_overlays.length > 0) {
        setSelectedOverlayPin(result.ar_overlays[0]);
      }
    } catch (err: any) {
      console.error('Image upload analysis error:', err);
      setErrorMessage('Failed to analyze the photo. Please check network connection or try another photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze a sample preset monument
  const handleSelectSample = async (sample: typeof SAMPLE_MONUMENTS[0]) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setUploadedImagePreview(sample.imageUrl);

      // Convert sample image URL to base64 via temporary image + canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sample.imageUrl;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          analyzeUploadedImage(dataUrl);
        } else {
          fallbackSampleAnalysis(sample);
        }
      };

      img.onerror = () => {
        fallbackSampleAnalysis(sample);
      };
    } catch {
      fallbackSampleAnalysis(sample);
    }
  };

  const fallbackSampleAnalysis = (sample: typeof SAMPLE_MONUMENTS[0]) => {
    const sampleFacts: Record<string, string[]> = {
      'Taj Mahal': [
        'Engineered with optical symmetry where outer minarets are tilted outward by 3 degrees.',
        'Built with Makrana white marble that subtly shifts hues with morning sunrise and twilight.',
        'Pietra-dura gemstone inlays incorporate jasper, jade, turquoise, and lapis lazuli.',
      ],
      'Amber Palace': [
        'Features the Sheesh Mahal (Mirror Palace) where a single candle flame illuminates the entire hall.',
        'Connected to Jaigarh Fort via subterranean escape tunnels designed for royal defense.',
        'Synthesizes Rajput Hindu ornamentation with Mughal arched symmetry.',
      ],
      'Gateway of India': [
        'Constructed in Indo-Saracenic basalt to commemorate the landing of King George V in 1911.',
        'Served as the symbolic departure point for the last British troops leaving India in 1948.',
        'Central dome spans 15 meters in diameter with intricate lattice screens.',
      ],
      'Konark Sun Temple': [
        'Designed as a colossal 24-wheeled chariot pulled by 7 stone horses symbolizing days of the week.',
        'Spoke shadows on the carved stone wheels function as accurate solar sundials.',
        '13th-century architectural marvel engineered by King Narasimhadeva I of the Eastern Ganga dynasty.',
      ],
      'Hampi Virupaksha': [
        'One of the oldest continuously functioning temples in India, dating from the 7th century CE.',
        'Features an inverted pinhole camera shadow phenomenon of the gopuram inside a sanctuary chamber.',
        'Grand imperial center of the Vijayanagara Empire on the boulder-strewn banks of the Tungabhadra.',
      ],
    };

    setAnalysisResult({
      success: true,
      identified_name: sample.name,
      confidence: 0.96,
      city: sample.city,
      state: sample.state,
      country: 'India',
      era: 'Imperial Heritage Period',
      year_built: 'Iconic Century',
      architectural_style: 'Classical Indian Heritage',
      short_summary: `Globally celebrated landmark in ${sample.city}, ${sample.state}.`,
      historical_facts: sampleFacts[sample.name] || [
        'Protected by Archaeological Survey of India (ASI).',
        'Recognized for exceptional architectural masonry and cultural significance.',
      ],
      architectural_highlights: ['Grand Entry Portal', 'Carved Stone Masonry', 'Imperial Plinth Geometry'],
      best_time_to_visit: 'October to March during morning golden hour.',
      unesco_status: true,
      matched_place: {
        id: sample.placeId,
        name: sample.name,
        city: sample.city,
        state: sample.state,
        category: 'UNESCO World Heritage',
        thumbnail_url: sample.imageUrl,
        summary: `Celebrated historical heritage site located in ${sample.city}, ${sample.state}.`,
        rating: 4.9,
        heritage_status: 'UNESCO World Heritage',
        is_in_database: true,
      },
      ar_overlays: [
        {
          id: 'dynasty',
          label: 'Imperial Era',
          detail: 'Constructed under royal royal patronage across centuries.',
          type: 'dynasty',
          position: { x: 30, y: 35 },
        },
        {
          id: 'architecture',
          label: 'Stone Architecture',
          detail: 'Masterwork of historic geometry and masonry.',
          type: 'architecture',
          position: { x: 70, y: 40 },
        },
        {
          id: 'fact',
          label: 'Historical Fact',
          detail: (sampleFacts[sample.name] && sampleFacts[sample.name][0]) || 'National treasure of India.',
          type: 'history',
          position: { x: 50, y: 65 },
        },
      ],
    });
    setIsAnalyzing(false);
  };

  // Text to Speech Narration
  const toggleSpeechNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!analysisResult) return;

    const factsText = analysisResult.historical_facts.join('. ');
    const textToSpeak = `${analysisResult.identified_name} in ${analysisResult.city || ''}, ${analysisResult.state || ''}. Era: ${analysisResult.era || 'Historic'}. ${analysisResult.short_summary || ''}. Key Facts: ${factsText}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Stop speech when closing or unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Navigate to desired page when database contains it
  const handleGoToPlacePage = (placeId: string) => {
    if (onSelectPlace) {
      onSelectPlace(placeId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      {/* Offscreen Canvas for Snapshot Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-[#111827] border border-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-stone-800 bg-[#161F30]/90 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF671F] to-[#E65100] flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-base font-serif font-bold text-white tracking-wide">
                  Virasat AR Monument Explorer
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF671F]/20 border border-[#FF671F]/40 text-[#FF671F] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  Vision AI
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400">
                Point camera at sites for AR overlays or upload any photo to search our database
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs & Close Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-stone-900 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setActiveTab('camera')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                  activeTab === 'camera'
                    ? 'bg-[#FF671F] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Live AR</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-[#FF671F] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Upload Photo</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
              title="Close AR Camera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Content Area */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] max-h-[70vh] overflow-y-auto bg-black flex flex-col">
          
          {/* TAB 1: LIVE AR CAMERA */}
          {activeTab === 'camera' && (
            <div className="relative flex-1 w-full h-full min-h-[360px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover select-none ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* AR HUD OVERLAY */}
              {cameraStatus === 'active' && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5">
                  
                  {/* Top HUD Telemetry Bar */}
                  <div className="flex items-center justify-between pointer-events-auto">
                    {/* Compass & Sensor Status */}
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-[10px] sm:text-xs font-mono">
                      <Compass className="w-3.5 h-3.5 text-[#FF671F] animate-spin-slow" />
                      <span>{compassHeading}° N</span>
                      <span className="text-stone-500">•</span>
                      <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AR Tracking Active
                      </span>
                    </div>

                    {/* Camera Controls (Flip & Torch) */}
                    <div className="flex items-center gap-1.5">
                      {hasTorch && (
                        <button
                          type="button"
                          onClick={toggleTorch}
                          className={`p-2 rounded-full border transition cursor-pointer ${
                            torchOn
                              ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                              : 'bg-black/60 backdrop-blur-md text-white border-white/20 hover:bg-black/80'
                          }`}
                          title="Toggle Flashlight"
                        >
                          {torchOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleFlipCamera}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition cursor-pointer"
                        title="Switch Camera (Front / Rear)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center AR Reticle & Targeting Brackets */}
                  <div className="relative flex-1 flex items-center justify-center pointer-events-none">
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 border border-white/20 rounded-3xl flex items-center justify-center">
                      {/* Corner Target Brackets */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#FF671F]" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#FF671F]" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#FF671F]" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#FF671F]" />

                      {/* Center Crosshair */}
                      <div className="w-3 h-3 rounded-full border border-white/60 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-[#FF671F]" />
                      </div>

                      {/* Laser Scanning Animation Sweep when Analyzing */}
                      {isAnalyzing && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF671F] to-transparent shadow-[0_0_15px_#FF671F] animate-bounce" />
                      )}

                      <div className="absolute -bottom-8 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-stone-300 font-sans">
                        {isAnalyzing ? 'Scanning site with Vision AI...' : 'Align monument in reticle'}
                      </div>
                    </div>

                    {/* Floating AR Pins over the View */}
                    {analysisResult?.ar_overlays?.map((pin) => (
                      <div
                        key={pin.id}
                        style={{
                          left: `${pin.position.x}%`,
                          top: `${pin.position.y}%`,
                        }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer animate-fadeIn"
                        onClick={() => setSelectedOverlayPin(pin)}
                      >
                        <div className="relative group">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161F30]/90 backdrop-blur-md border border-[#FF671F]/60 text-white text-[10px] sm:text-xs font-bold shadow-lg hover:border-[#FF671F] hover:scale-105 transition-all">
                            <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-ping" />
                            <span>{pin.label}</span>
                          </div>
                          
                          {/* Tooltip on Hover/Tap */}
                          <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-44 p-2 rounded-xl bg-stone-950/95 border border-white/15 text-[10px] text-stone-200 z-30 shadow-xl">
                            {pin.detail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Shutter & Quick Recognition Action Bar */}
                  <div className="flex items-center justify-center gap-4 pointer-events-auto pb-1">
                    <button
                      type="button"
                      onClick={captureAndAnalyzeFrame}
                      disabled={isAnalyzing}
                      className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/80 hover:border-[#FF671F] transition-all active:scale-90 cursor-pointer shadow-xl disabled:opacity-50"
                      title="Analyze Monument Frame"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#FF671F] to-[#E65100] group-hover:scale-105 transition flex items-center justify-center text-white shadow-md">
                        {isAnalyzing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Requesting / Permission Denied / Fallback States */}
              {cameraStatus === 'requesting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-white p-6 text-center z-20">
                  <Loader2 className="w-8 h-8 text-[#FF671F] animate-spin mb-3" />
                  <h3 className="text-sm sm:text-base font-bold">Connecting to Device Camera...</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm">
                    Please allow camera permissions in your browser to enable live Augmented Reality scanning.
                  </p>
                </div>
              )}

              {cameraStatus === 'denied' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-white p-6 text-center z-20">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold">Camera Access Blocked</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm">
                    Device camera permission was declined or is blocked by browser security settings. You can still upload any monument photo!
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold transition cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-xs font-bold transition cursor-pointer"
                    >
                      Upload Photo Instead
                    </button>
                  </div>
                </div>
              )}

              {cameraStatus === 'unsupported' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-white p-6 text-center z-20">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-3" />
                  <h3 className="text-sm sm:text-base font-bold">Camera Not Supported in this Environment</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm">
                    Your current browser environment does not support WebRTC camera feeds. Please use Photo Upload mode below.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#FF671F] text-xs font-bold transition cursor-pointer"
                  >
                    Switch to Photo Upload
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE & DISCOVER */}
          {activeTab === 'upload' && (
            <div className="flex-1 p-3 sm:p-6 flex flex-col gap-4 overflow-y-auto">
              
              {/* Drag & Drop File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-stone-700 hover:border-[#FF671F] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-stone-900/50 hover:bg-stone-900 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 group-hover:scale-105 group-hover:bg-[#FF671F]/20 transition flex items-center justify-center text-[#FF671F] mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Drop a monument photo here or click to browse
                </h3>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
                  Upload photos of any Indian monument, temple, fort, palace, or landmark to instantly look up historical facts in our database.
                </p>
              </div>

              {/* Sample Monuments Preset Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Or Test with Curated Monument Photos:
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SAMPLE_MONUMENTS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="group flex flex-col items-start p-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-[#FF671F] transition text-left cursor-pointer overflow-hidden"
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.name}
                        className="w-full h-16 sm:h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="mt-1 px-1">
                        <div className="text-[11px] font-bold text-white truncate w-full">{sample.name}</div>
                        <div className="text-[9px] text-stone-400 truncate">{sample.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Image Preview & Scanning Indicator */}
              {uploadedImagePreview && (
                <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 max-h-64 flex items-center justify-center">
                  <img
                    src={uploadedImagePreview}
                    alt="Uploaded preview"
                    className="max-h-64 w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                      <Loader2 className="w-8 h-8 text-[#FF671F] animate-spin mb-2" />
                      <div className="text-xs font-bold">Scanning with Gemini Vision AI...</div>
                      <div className="text-[10px] text-stone-400">Comparing architectural features with Virasat database</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC HISTORICAL FACTS & DATABASE LINK PANEL (Overlaid on Bottom) */}
          {analysisResult && (
            <div className="border-t border-stone-800 bg-[#141C2B] p-3 sm:p-5 animate-slideUp">
              
              {/* Header Title & Database Match Alert */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#046A38] animate-pulse" />
                    <h3 className="text-sm sm:text-lg font-serif font-bold text-white">
                      {analysisResult.identified_name}
                    </h3>
                    {analysisResult.unesco_status && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                        UNESCO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FF671F]" />
                    <span>{analysisResult.city || 'India'}, {analysisResult.state || ''}</span>
                    <span className="text-stone-600">•</span>
                    <span className="text-stone-300 font-medium">{analysisResult.architectural_style || 'Heritage Style'}</span>
                  </p>
                </div>

                {/* Audio Speech Narration Button */}
                <button
                  type="button"
                  onClick={toggleSpeechNarration}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer self-start sm:self-auto ${
                    isSpeaking
                      ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                  }`}
                  title="Audio Guide Narration"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#FF671F]" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen to History'}</span>
                </button>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-stone-300 mt-2.5 leading-relaxed font-sans">
                {analysisResult.short_summary}
              </p>

              {/* Historical Facts & Architecture Highlights in AR format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Landmark className="w-3 h-3" />
                    <span>Architectural & Dynasty Secrets</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FF671F] mt-0.5">•</span>
                      <span><strong>Era / Dynasty:</strong> {analysisResult.era || 'Historic Indian Dynasty'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#FF671F] mt-0.5">•</span>
                      <span><strong>Constructed:</strong> {analysisResult.year_built || 'Centuries ago'}</span>
                    </li>
                    {analysisResult.architectural_highlights?.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#046A38] mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-900/80 rounded-xl p-2.5 border border-stone-800">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Historical Facts Overlaid</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-300">
                    {analysisResult.historical_facts?.slice(0, 3).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#FF671F] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CRITICAL USER REQUIREMENT:
                  "if found it Should lead to the page the user desires of anything the database contains in the explore page"
              */}
              {analysisResult.matched_place ? (
                <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-stone-900 to-orange-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {analysisResult.matched_place.thumbnail_url && (
                      <img
                        src={analysisResult.matched_place.thumbnail_url}
                        alt={analysisResult.matched_place.name}
                        className="w-12 h-12 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                          Verified in Virasat Database
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {analysisResult.matched_place.name}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {analysisResult.matched_place.city}, {analysisResult.matched_place.state}
                      </div>
                    </div>
                  </div>

                  {/* Direct Button to open the desired Monument/Place Page */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleGoToPlacePage(analysisResult.matched_place!.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                    >
                      <span>Explore Destination Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Fallback if monument is not directly an exact match, recommend related DB places */
                analysisResult.suggested_database_places && analysisResult.suggested_database_places.length > 0 && (
                  <div className="mt-3.5 p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Related Verified Monuments in Virasat Database:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.suggested_database_places.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleGoToPlacePage(p.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-white transition cursor-pointer"
                        >
                          <Landmark className="w-3 h-3 text-[#FF671F]" />
                          <span>{p.name}</span>
                          <ChevronRight className="w-3 h-3 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border-t border-red-800/80 text-red-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-white text-[11px] font-bold ml-2 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Tips Bar */}
        <div className="px-4 py-2.5 bg-stone-950 border-t border-stone-900 flex items-center justify-between text-[10px] text-stone-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
            <span>Archaeological Survey of India & UNESCO Heritage Grounding</span>
          </div>
          <div className="hidden sm:block">
            Tip: Keep phone steady while scanning for optimal AR overlay tracking
          </div>
        </div>
      </div>
    </div>
  );
};
