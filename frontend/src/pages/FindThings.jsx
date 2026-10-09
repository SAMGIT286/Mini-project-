<<<<<<< HEAD
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  RotateCcw,
  Search,
  Upload,
  Video,
  X,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Eye,
  Sparkles,
  Plus,
  AlertCircle,
  RefreshCw,
  Layers,
  ShieldCheck,
  Tag,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  ListFilter
} from "lucide-react";
import {
  analyzeFrame,
  analyzeImage,
  getObservations,
  deleteObservation,
  clearObservations,
  addObservation,
  getSupportedClasses
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const PRESET_ROOMS = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Study Desk",
  "Dining Table",
  "Hallway",
  "Bag / Pocket"
];

const QUICK_CATEGORIES = [
  { id: "", label: "All Items", icon: "🔍" },
  { id: "phone", label: "Phone", icon: "📱" },
  { id: "keys", label: "Keys", icon: "🔑" },
  { id: "glasses", label: "Glasses", icon: "👓" },
  { id: "wallet", label: "Wallet", icon: "💳" },
  { id: "charger", label: "Charger", icon: "🔌" },
  { id: "earphones", label: "Earphones", icon: "🎧" },
  { id: "watch", label: "Watch", icon: "⌚" },
  { id: "bottle", label: "Bottle/Cup", icon: "☕" },
  { id: "laptop", label: "Laptop", icon: "💻" },
  { id: "backpack", label: "Bag", icon: "🎒" },
  { id: "book", label: "Book", icon: "📖" }
];

export default function FindThings() {
  const { t, language, transliterateName } = useAuth();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const frameInFlightRef = useRef(false);

  const [activeTab, setActiveTab] = useState("scanner"); // "scanner" | "timeline" | "catalog"
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [successNote, setSuccessNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Living Room");
  const [customLocation, setCustomLocation] = useState("");
  const [lastSeen, setLastSeen] = useState([]);
  const [allSightings, setAllSightings] = useState([]);
  const [liveDetections, setLiveDetections] = useState(null);
  const [liveScanActive, setLiveScanActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedClasses, setSupportedClasses] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualObj, setManualObj] = useState("");
  const [manualLoc, setManualLoc] = useState("");

  const effectiveLocation = customLocation.trim() || location;

  // Cleanup preview URL
=======
import { Camera, RotateCcw, Search, Upload, Video, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeFrame, analyzeImage, getObservations } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function FindThings() {
  const { t, transliterateName } = useAuth();
  const input = useRef(null);
  const video = useRef(null);
  const stream = useRef(null);
  const canvas = useRef(null);
  const frameInFlight = useRef(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [lastSeen, setLastSeen] = useState([]);
  const [liveDetections, setLiveDetections] = useState(null);
  const liveMatches = (liveDetections?.detections || []).filter((item) =>
    !query.trim() || item.object.toLowerCase().includes(query.trim().toLowerCase())
  );

>>>>>>> 793ac7deb2b90b53cd66eaa442c60ada77921602
  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

<<<<<<< HEAD
  // Load supported classes on mount
  useEffect(() => {
    getSupportedClasses()
      .then((data) => {
        if (data?.common_classes) setSupportedClasses(data.common_classes);
      })
      .catch(() => {});
  }, []);

  // Fetch observations
  const fetchSightings = useCallback(async (searchQuery = query) => {
    try {
      if (searchQuery.trim()) {
        const filtered = await getObservations(searchQuery.trim());
        setLastSeen(filtered || []);
      } else {
        const all = await getObservations(null, null, 30);
        setLastSeen(all || []);
      }
      const fullList = await getObservations(null, null, 50);
      setAllSightings(fullList || []);
    } catch (err) {
      setError(err.message);
    }
  }, [query]);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  // Camera Management
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
    setLiveDetections(null);
  }, []);

  const openCamera = useCallback(async (facing = facingMode) => {
    setError("");
    setSuccessNote("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser. Please upload an image instead.");
      return;
    }
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access or upload an image."
          : "Could not open camera. Please use image upload instead."
      );
      stopCamera();
    }
  }, [facingMode, stopCamera]);

  // Connect stream to video element when mounted
  useEffect(() => {
    if (cameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);

  // Cleanup camera on unmount
  useEffect(() => {
    return stopCamera;
  }, [stopCamera]);

  // Toggle Front/Back Camera
  const toggleFacingMode = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    if (cameraOpen) openCamera(next);
  };

  // Live Frame Auto-Analysis
  const analyzeLiveFrame = useCallback(async () => {
    if (!liveScanActive || !cameraOpen || frameInFlightRef.current) return;
    const curVideo = videoRef.current;
    if (!curVideo || !curVideo.videoWidth || !canvasRef.current) return;

    frameInFlightRef.current = true;
    const canvas = canvasRef.current;
    canvas.width = curVideo.videoWidth;
    canvas.height = curVideo.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      frameInFlightRef.current = false;
      return;
    }
    ctx.drawImage(curVideo, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        frameInFlightRef.current = false;
        return;
      }
      try {
        const next = await analyzeFrame(
          new File([blob], "live-frame.jpg", { type: "image/jpeg" }),
          { location: effectiveLocation, include_people: "false" }
        );
        setLiveDetections(next);
      } catch {
        // Silently tolerate single frame drops in live scan
      } finally {
        frameInFlightRef.current = false;
      }
    }, "image/jpeg", 0.75);
  }, [liveScanActive, cameraOpen, effectiveLocation]);

  useEffect(() => {
    if (!cameraOpen || !liveScanActive) return undefined;
    const interval = window.setInterval(analyzeLiveFrame, 3500);
    return () => window.clearInterval(interval);
  }, [cameraOpen, liveScanActive, analyzeLiveFrame]);

  // Capture & Analyze Photo
  const captureAndAnalyze = async () => {
    const curVideo = videoRef.current;
    if (!curVideo || !canvasRef.current || !curVideo.videoWidth) {
      setError("Camera is still warming up. Please try in a moment.");
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = curVideo.videoWidth;
    canvas.height = curVideo.videoHeight;
    canvas.getContext("2d").drawImage(curVideo, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreview(dataUrl);
    stopCamera();

    // Auto-analyze and persist
    canvas.toBlob(async (blob) => {
      if (blob) {
        await processImageFile(
          new File([blob], "captured-item.jpg", { type: "image/jpeg" })
        );
      }
    }, "image/jpeg", 0.92);
  };

  const processImageFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccessNote("");
    setResult(null);
    try {
      const next = await analyzeImage(file, {
        location: effectiveLocation,
        persist: "true",
        include_people: "false"
      });
      setResult(next);
      if (next.detections && next.detections.length > 0) {
        setSuccessNote(
          `Detected ${next.detections.length} item(s) and saved to location: ${effectiveLocation}`
        );
      }
      fetchSightings(query);
    } catch (err) {
      setError(err.message || "Failed to analyze image.");
=======
  const refreshHistory = async (value = query) => {
    if (!value.trim()) return setLastSeen([]);
    try {
      setLastSeen(await getObservations(value.trim()));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (cameraOpen && video.current && stream.current) {
      video.current.srcObject = stream.current;
    }
  }, [cameraOpen]);

  const stopCamera = useCallback(() => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCameraOpen(false);
  }, []);

  const openCamera = useCallback(async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser. Use image upload instead.");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraOpen(true);
    } catch (err) {
      setError(err.name === "NotAllowedError"
        ? "Camera permission was denied. You can still upload an image."
        : "The camera could not be opened. You can still upload an image.");
      stopCamera();
    }
  }, [stopCamera]);

  useEffect(() => {
    openCamera();
    return stopCamera;
  }, [openCamera, stopCamera]);

  const capture = () => {
    const currentVideo = video.current;
    if (!currentVideo || !canvas.current || !currentVideo.videoWidth) {
      setError("The camera is not ready yet. Please try again.");
      return;
    }
    canvas.current.width = currentVideo.videoWidth;
    canvas.current.height = currentVideo.videoHeight;
    canvas.current.getContext("2d").drawImage(currentVideo, 0, 0);
    setPreview(canvas.current.toDataURL("image/jpeg", 0.9));
    stopCamera();
  };

  const analyze = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const next = await analyzeImage(file, { location, include_people: "false" });
      setResult(next);
      if (query.trim()) refreshHistory(query);
    } catch (err) {
      setError(err.message);
>>>>>>> 793ac7deb2b90b53cd66eaa442c60ada77921602
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Match live detections against query
  const liveMatches = (liveDetections?.detections || []).filter((item) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    const obj = item.object.toLowerCase();
    return obj.includes(q) || q.includes(obj);
  });

  // Text to Speech
  const speakInfo = (textToSpeak) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (language === "Hindi") utterance.lang = "hi-IN";
    else if (language === "Marathi") utterance.lang = "mr-IN";
    else utterance.lang = "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Speech to Text Voice Search
  const toggleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      if (language === "Hindi") recognition.lang = "hi-IN";
      else if (language === "Marathi") recognition.lang = "mr-IN";
      else recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // Clean standard phrases like "where is my"
          let cleaned = transcript
            .replace(/where is my|where are my|find my|find|locate|kahan hai|kuthe aahe/gi, "")
            .trim();
          setQuery(cleaned || transcript);
          fetchSightings(cleaned || transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Delete Observation
  const handleDeleteSighting = async (id, e) => {
    e?.stopPropagation();
    try {
      await deleteObservation(id);
      fetchSightings(query);
      setSuccessNote("Sighting deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  // Clear All Observations
  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear the sightings history?")) return;
    try {
      await clearObservations(query.trim() || undefined);
      fetchSightings(query);
      setSuccessNote("Sightings cleared.");
    } catch (err) {
      setError(err.message);
    }
  };

  // Add Manual Sighting
  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualObj.trim()) return;
    try {
      await addObservation({
        object: manualObj.trim(),
        location: manualLoc.trim() || effectiveLocation,
        confidence: 1.0
      });
      setManualObj("");
      setManualLoc("");
      setShowManualForm(false);
      setSuccessNote("Observation added manually!");
      fetchSightings(query);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sighting text generator for TTS
  const getSightingSpeakText = (item) => {
    const loc = item.location ? `in the ${item.location}` : "nearby";
    if (language === "Hindi") {
      return `आपका ${item.object} ${item.location ? item.location + " में" : ""} देखा गया था।`;
    }
    if (language === "Marathi") {
      return `तुमचे ${item.object} ${item.location ? item.location + " येथे" : ""} सापडले होते.`;
    }
    return `Your ${item.object} was last recorded ${loc}.`;
  };

  // Format relative date
  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " · " + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="page find-things-page">
      {/* Header Section */}
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow-badge">
            <Sparkles size={12} /> {t?.lostAndFoundEyebrow || "LOST-AND-FOUND ASSISTANT"}
          </div>
          <h1>{t?.navFindThings || "Find My Things"}</h1>
          <p>
            {t?.findThingsDesc ||
              "Scan with live camera or search your saved sightings. MemoMind detects your essentials and remembers where they were left."}
          </p>
        </div>
        <div className="header-status-pill">
          <div className="status-live-dot" />
          <span>AI Vision Ready</span>
        </div>
      </div>

      {/* Hidden Offscreen Canvas for Snapshotting */}
      <canvas ref={canvasRef} className="camera-canvas" />

      {/* Navigation Tabs */}
      <div className="find-tabs">
        <button
          className={`find-tab-btn ${activeTab === "scanner" ? "active" : ""}`}
          onClick={() => setActiveTab("scanner")}
        >
          <Camera size={16} /> {t?.scannerTab || "Live Scanner"}
        </button>
        <button
          className={`find-tab-btn ${activeTab === "timeline" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("timeline");
            fetchSightings();
          }}
        >
          <Clock size={16} /> {t?.timelineTab || "Sightings History"} ({allSightings.length})
        </button>
        <button
          className={`find-tab-btn ${activeTab === "catalog" ? "active" : ""}`}
          onClick={() => setActiveTab("catalog")}
        >
          <Layers size={16} /> {t?.catalogTab || "Supported Items"}
        </button>
      </div>

      {/* Main Container */}
      <div className="find-things-grid">
        {/* Left Column: Interactive Search & Camera / Scanner */}
        <div className="find-main-panel">
          {/* Smart Search Bar */}
          <div className="search-box-card">
            <div className="search-input-group">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  fetchSightings(e.target.value);
                }}
                placeholder={t?.searchPlaceholder || "Search item (e.g. keys, phone, glasses, wallet)..."}
                className="search-input"
              />
              {query && (
                <button
                  className="clear-query-btn"
                  onClick={() => {
                    setQuery("");
                    fetchSightings("");
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
              <button
                className={`voice-search-btn ${isListening ? "listening" : ""}`}
                onClick={toggleVoiceSearch}
                title={isListening ? "Listening..." : "Search with voice"}
                type="button"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            {/* Quick Category Chips */}
            <div className="category-chips-scroll">
              {QUICK_CATEGORIES.map((cat) => {
                const isSelected = query.toLowerCase() === cat.id;
                return (
                  <button
                    key={cat.id || "all"}
                    className={`category-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      const newQ = isSelected ? "" : cat.id;
                      setQuery(newQ);
                      fetchSightings(newQ);
                    }}
                  >
                    <span>{cat.icon}</span>
                    <b>{cat.label}</b>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Tagging Selector */}
          <div className="location-tag-bar">
            <div className="location-tag-label">
              <MapPin size={14} />
              <span>{t?.tagLocationPrompt || "Current Room:"}</span>
            </div>
            <div className="room-pills">
              {PRESET_ROOMS.map((rm) => (
                <button
                  key={rm}
                  type="button"
                  className={`room-pill ${location === rm && !customLocation ? "active" : ""}`}
                  onClick={() => {
                    setLocation(rm);
                    setCustomLocation("");
                  }}
                >
                  {rm}
                </button>
              ))}
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Other location..."
                className="custom-room-input"
              />
            </div>
          </div>

          {/* TAB 1: SCANNER & CAMERA */}
          {activeTab === "scanner" && (
            <div className="scanner-view-container">
              {/* Alert Feedback notes */}
              {error && (
                <div className="alert-box error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button onClick={() => setError("")}><X size={14} /></button>
                </div>
              )}
              {successNote && (
                <div className="alert-box success">
                  <CheckCircle2 size={16} />
                  <span>{successNote}</span>
                  <button onClick={() => setSuccessNote("")}><X size={14} /></button>
                </div>
              )}

              {/* Viewport Area */}
              <div className="viewfinder-card">
                {cameraOpen ? (
                  <div className="live-camera-wrapper">
                    <div className="video-viewport">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-video-feed"
                      />
                      {/* Live Scanning Laser Overlay */}
                      {liveScanActive && <div className="scanning-laser-line" />}

                      {/* Render Live Bounding Boxes */}
                      {liveMatches.map((item, index) => (
                        <BoundingBoxOverlay
                          key={`${item.object}-${index}`}
                          item={item}
                          imageSize={liveDetections?.image_size}
                          isMatch={Boolean(query.trim())}
                        />
                      ))}
                    </div>

                    {/* Live Scanner Controls Overlay Bar */}
                    <div className="camera-overlay-controls">
                      <div className="live-badge">
                        <span className="live-pulse" />
                        LIVE AI SCAN
                      </div>
                      <div className="camera-top-actions">
                        <button
                          className={`icon-pill-btn ${liveScanActive ? "active" : ""}`}
                          onClick={() => setLiveScanActive(!liveScanActive)}
                          title="Toggle Auto-Scan"
                        >
                          <Radio size={14} /> {liveScanActive ? "Auto Scan: ON" : "Auto Scan: OFF"}
                        </button>
                        <button
                          className="icon-pill-btn"
                          onClick={toggleFacingMode}
                          title="Switch Camera"
                        >
                          <RefreshCw size={14} /> Flip
                        </button>
                        <button
                          className="icon-pill-btn close"
                          onClick={stopCamera}
                          title="Close Camera"
                        >
                          <X size={14} /> Close
                        </button>
                      </div>
                    </div>

                    {/* Live Status Bar */}
                    <div className="camera-bottom-actions">
                      <button
                        className="btn btn-capture"
                        onClick={captureAndAnalyze}
                        disabled={loading}
                      >
                        <Camera size={20} />
                        <span>{t?.capture || "Capture & Save"}</span>
                      </button>
                    </div>
                  </div>
                ) : preview ? (
                  <div className="captured-preview-wrapper">
                    <div className="video-viewport">
                      <img src={preview} alt="Captured camera preview" className="camera-video-feed" />
                      {result?.detections?.map((item, index) => (
                        <BoundingBoxOverlay
                          key={`${item.object}-${index}`}
                          item={item}
                          imageSize={result.image_size}
                          isMatch={true}
                        />
                      ))}
                    </div>
                    <div className="preview-action-row">
                      <button
                        className="btn btn-primary"
                        onClick={() => openCamera(facingMode)}
                        disabled={loading}
                      >
                        <RotateCcw size={16} /> {t?.retake || "Scan Again"}
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setPreview(null);
                          setResult(null);
                        }}
                      >
                        <X size={16} /> Clear View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="camera-placeholder-hero">
                    <div className="hero-icon-ring">
                      <Camera size={38} />
                    </div>
                    <h3>Start Camera Scanner</h3>
                    <p>
                      Point your camera around the room to automatically recognize everyday essentials and record where they are placed.
                    </p>
                    <div className="hero-buttons">
                      <button className="btn btn-primary btn-lg" onClick={() => openCamera(facingMode)}>
                        <Camera size={18} /> {t?.openCamera || "Open Camera"}
                      </button>
                      <button
                        className="btn btn-outline btn-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={18} /> {t?.uploadImage || "Upload Photo"}
                      </button>
                      <input
                        ref={fileInputRef}
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreview(URL.createObjectURL(file));
                            processImageFile(file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Detections List Card */}
              {loading && (
                <div className="loading-shimmer-card">
                  <RefreshCw className="spin-icon" size={20} />
                  <span>{t?.analyzingImage || "Scanning image with AI object detection…"}</span>
                </div>
              )}

              {result && (
                <div className="detection-results-panel panel">
                  <div className="panel-header">
                    <div>
                      <h2>{t?.detectionResults || "Detected Items"}</h2>
                      <p>Saved under location: <b>{effectiveLocation}</b></p>
                    </div>
                    <span className="badge-count">{result.detections?.length || 0} found</span>
                  </div>

                  {result.detections?.length > 0 ? (
                    <div className="detected-cards-grid">
                      {result.detections.map((item, idx) => (
                        <div key={idx} className="detected-item-card">
                          <div className="detected-card-header">
                            <span className="item-icon-tag">🏷️</span>
                            <div>
                              <strong>{item.object}</strong>
                              <span className="item-conf">
                                {Math.round(item.confidence * 100)}% confidence
                              </span>
                            </div>
                            <button
                              className="tts-mini-btn"
                              onClick={() => speakInfo(getSightingSpeakText(item))}
                              title="Read Aloud"
                            >
                              <Volume2 size={15} />
                            </button>
                          </div>
                          <div className="detected-card-footer">
                            <span><MapPin size={12} /> {item.location || effectiveLocation}</span>
                            <time><Clock size={12} /> Just now</time>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-results-box">
                      <AlertCircle size={24} />
                      <p>{t?.noSupportedObjectsDetected || "No supported objects detected. Try another angle or brighter lighting."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SIGHTINGS TIMELINE */}
          {activeTab === "timeline" && (
            <div className="timeline-view-container panel">
              <div className="panel-header">
                <div>
                  <h2>{t?.timelineTab || "Sightings History"}</h2>
                  <p>All recorded object locations from scans and manual tags.</p>
                </div>
                <div className="timeline-header-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowManualForm(!showManualForm)}
                  >
                    <Plus size={14} /> {t?.manualLogBtn || "Log Location"}
                  </button>
                  {allSightings.length > 0 && (
                    <button
                      className="btn btn-danger-outline btn-sm"
                      onClick={handleClearHistory}
                    >
                      <Trash2 size={14} /> {t?.clearAll || "Clear History"}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Manual Entry Drawer */}
              {showManualForm && (
                <form className="manual-log-form" onSubmit={handleManualAdd}>
                  <h4>Log Where You Put Something</h4>
                  <div className="manual-form-row">
                    <input
                      type="text"
                      placeholder="Object name (e.g. Glasses, Keys, Wallet)"
                      value={manualObj}
                      onChange={(e) => setManualObj(e.target.value)}
                      required
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g. Nightstand, Dining table)"
                      value={manualLoc}
                      onChange={(e) => setManualLoc(e.target.value)}
                      className="form-input"
                    />
                    <button type="submit" className="btn btn-primary btn-sm">Save</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowManualForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {/* Timeline List */}
              {allSightings.length > 0 ? (
                <div className="timeline-items-list">
                  {allSightings.map((sighting) => (
                    <div key={sighting.id || sighting._id} className="timeline-item-card">
                      <div className="timeline-icon-col">
                        <div className="timeline-circle">📍</div>
                        <div className="timeline-stem" />
                      </div>
                      <div className="timeline-content-col">
                        <div className="timeline-card-header">
                          <div>
                            <strong>{sighting.object}</strong>
                            <span className="timeline-conf-tag">
                              {Math.round((sighting.confidence || 1.0) * 100)}% match · {sighting.model || "yolo"}
                            </span>
                          </div>
                          <div className="timeline-card-actions">
                            <button
                              className="icon-btn"
                              onClick={() => speakInfo(getSightingSpeakText(sighting))}
                              title="Read Aloud"
                            >
                              <Volume2 size={16} />
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={(e) => handleDeleteSighting(sighting.id || sighting._id, e)}
                              title="Delete Sighting"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="timeline-meta-row">
                          <span className="location-badge">
                            <MapPin size={12} /> {sighting.location || "Unspecified location"}
                          </span>
                          <span className="timestamp-badge">
                            <Clock size={12} /> {formatTime(sighting.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-timeline-state">
                  <Clock size={36} />
                  <h3>No recorded sightings yet</h3>
                  <p>Use the camera scanner or log locations to keep track of your everyday items.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPPORTED CATALOG */}
          {activeTab === "catalog" && (
            <div className="catalog-view-container panel">
              <div className="panel-header">
                <div>
                  <h2>{t?.catalogTab || "Supported Items"}</h2>
                  <p>MemoMind AI is trained to detect these everyday personal objects.</p>
                </div>
              </div>
              <div className="catalog-grid">
                {[
                  { name: "Keys", desc: "House, car, & drawer keys", icon: "🔑" },
                  { name: "Glasses", desc: "Reading glasses & spectacles", icon: "👓" },
                  { name: "Phone", desc: "Smartphones & mobile devices", icon: "📱" },
                  { name: "Wallet", desc: "Wallets, purses, & cardholders", icon: "💳" },
                  { name: "Charger", desc: "Power adapters & charging cables", icon: "🔌" },
                  { name: "Earphones", desc: "Headphones, AirPods, & earbuds", icon: "🎧" },
                  { name: "Watch", desc: "Wristwatches & smartwatches", icon: "⌚" },
                  { name: "Card", desc: "ID, debit, & credit cards", icon: "🪪" },
                  { name: "Pen", desc: "Pens, pencils, & markers", icon: "🖊️" },
                  { name: "Bottle", desc: "Water bottles & flasks", icon: "🍶" },
                  { name: "Cup", desc: "Mugs, teacups, & glasses", icon: "☕" },
                  { name: "Laptop", desc: "Laptops & keyboards", icon: "💻" },
                  { name: "Book", desc: "Books, notebooks, & diaries", icon: "📖" },
                  { name: "Backpack", desc: "Handbags & backpacks", icon: "🎒" },
                  { name: "Remote", desc: "TV & AC remotes", icon: "📺" },
                  { name: "Scissors", desc: "Scissors & cutters", icon: "✂️" },
                  { name: "Umbrella", desc: "Rain & sun umbrellas", icon: "☂️" }
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="catalog-card"
                    onClick={() => {
                      setQuery(cat.name.toLowerCase());
                      setActiveTab("scanner");
                      fetchSightings(cat.name.toLowerCase());
                    }}
                  >
                    <div className="catalog-icon">{cat.icon}</div>
                    <strong>{cat.name}</strong>
                    <span>{cat.desc}</span>
                    <button className="catalog-locate-btn">
                      <Search size={13} /> Find Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Search Spotlight & Last Sighting Card */}
        <div className="find-sidebar-panel">
          {/* Spotlight Alert Card */}
          <div className="spotlight-card panel">
            <div className="spotlight-header">
              <div className="spotlight-badge">
                <Sparkles size={14} /> SIGHTING SPOTLIGHT
              </div>
              {lastSeen.length > 0 && (
                <button
                  className="speech-speak-btn"
                  onClick={() => speakInfo(getSightingSpeakText(lastSeen[0]))}
                  title="Read Aloud"
                >
                  <Volume2 size={16} />
                  <span>{t?.speakLocation || "Listen"}</span>
                </button>
              )}
            </div>

            {query.trim() ? (
              lastSeen.length > 0 ? (
                <div className="spotlight-body found">
                  <div className="spotlight-item-badge">
                    <span className="spotlight-icon">📍</span>
                    <div>
                      <h3>{lastSeen[0].object}</h3>
                      <p className="spotlight-loc">{lastSeen[0].location || "Recorded nearby"}</p>
                    </div>
                  </div>
                  <div className="spotlight-details">
                    <div className="detail-row">
                      <span>Last Seen</span>
                      <strong>{formatTime(lastSeen[0].timestamp)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Match Confidence</span>
                      <strong>{Math.round((lastSeen[0].confidence || 1.0) * 100)}%</strong>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-full mt-3"
                    onClick={() => openCamera(facingMode)}
                  >
                    <Camera size={16} /> Verify with Camera
                  </button>
                </div>
              ) : (
                <div className="spotlight-body not-found">
                  <div className="not-found-icon">🔎</div>
                  <h3>No sightings yet for "{query}"</h3>
                  <p>
                    {t?.noSightingsYet || "No saved record for this item. Use the live camera scanner to locate and tag it."}
                  </p>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => openCamera(facingMode)}
                  >
                    <Camera size={16} /> Scan Room Now
                  </button>
                </div>
              )
            ) : lastSeen.length > 0 ? (
              <div className="spotlight-body">
                <div className="spotlight-item-badge">
                  <span className="spotlight-icon">🕒</span>
                  <div>
                    <h3>Most Recent Sighting</h3>
                    <p className="spotlight-loc">{lastSeen[0].object} in {lastSeen[0].location || "room"}</p>
                  </div>
                </div>
                <div className="spotlight-details">
                  <div className="detail-row">
                    <span>Recorded</span>
                    <strong>{formatTime(lastSeen[0].timestamp)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="spotlight-body idle">
                <p>Type an item name above or tap a category to check where it was last seen.</p>
              </div>
            )}
          </div>

          {/* Quick Recent Sightings Mini-List */}
          <div className="panel recent-sightings-panel">
            <div className="panel-header">
              <h2>Recent Sightings</h2>
              <button
                className="text-btn"
                onClick={() => setActiveTab("timeline")}
              >
                View All ({allSightings.length})
              </button>
            </div>
            {allSightings.length > 0 ? (
              <div className="recent-sightings-list">
                {allSightings.slice(0, 5).map((item) => (
                  <div
                    key={item.id || item._id}
                    className="recent-sighting-row"
                    onClick={() => {
                      setQuery(item.object.toLowerCase());
                      fetchSightings(item.object.toLowerCase());
                    }}
                  >
                    <div className="recent-icon">📍</div>
                    <div className="recent-info">
                      <strong>{item.object}</strong>
                      <span>{item.location || "Room"} · {formatTime(item.timestamp)}</span>
                    </div>
                    <ChevronRight size={15} className="chevron" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-small">No items logged yet.</p>
            )}
          </div>
        </div>
      </div>
=======
  const analyzeLiveFrame = useCallback(async () => {
    const currentVideo = video.current;
    if (!currentVideo?.videoWidth || !canvas.current || frameInFlight.current) return;
    frameInFlight.current = true;
    canvas.current.width = currentVideo.videoWidth;
    canvas.current.height = currentVideo.videoHeight;
    canvas.current.getContext("2d").drawImage(currentVideo, 0, 0);
    canvas.current.toBlob(async (blob) => {
      if (!blob) {
        frameInFlight.current = false;
        return;
      }
      try {
        const next = await analyzeFrame(
          new File([blob], "live-frame.jpg", { type: "image/jpeg" }),
          { location, include_people: "false" }
        );
        setLiveDetections(next);
      } catch (err) {
        setError(err.message);
      } finally {
        frameInFlight.current = false;
      }
    }, "image/jpeg", 0.75);
  }, [location]);

  useEffect(() => {
    if (!cameraOpen || !query.trim() || liveMatches.length > 0) return undefined;
    const timer = window.setTimeout(() => refreshHistory(query), 400);
    return () => window.clearTimeout(timer);
  }, [cameraOpen, query, liveDetections]);

  useEffect(() => {
    if (!cameraOpen) return undefined;
    const timer = window.setInterval(analyzeLiveFrame, 4000);
    return () => window.clearInterval(timer);
  }, [cameraOpen, analyzeLiveFrame]);

  const analyzeCaptured = () => {
    canvas.current?.toBlob((blob) => {
      if (blob) analyze(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="page">
      <div className="page-heading">
        <h1>{t?.navFindThings || "Find My Things"}</h1>
        <p>{t?.findThingsDesc || "Capture one image at a time. MemoMind detects supported objects and stores the observation."}</p>
      </div>

      <canvas ref={canvas} className="camera-canvas" />
      <section className="panel find-things-panel">
        <form className="inline-form" onSubmit={(event) => { event.preventDefault(); refreshHistory(); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for? e.g. glasses" />
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Current location" />
          <button className="btn btn-primary" type="submit"><Search size={15} /> Find</button>
        </form>
        {cameraOpen ? (
          <div className="camera-stage">
            <div className="detection-stage">
              <video ref={video} autoPlay playsInline muted className="camera-preview" />
              {liveMatches.map((item, index) => (
                <DetectionBox key={`${item.object}-${index}`} item={item} imageSize={liveDetections.image_size} />
              ))}
            </div>
            {query.trim() && <div className={liveMatches.length ? "live-find-status found" : "live-find-status"}>
              {liveMatches.length
                ? `${query} found in the live feed`
                : lastSeen.length
                  ? `${query} was last seen ${new Date(lastSeen[0].timestamp).toLocaleString()}${lastSeen[0].location ? ` at ${lastSeen[0].location}` : ""}`
                  : `${query} is not visible and has no saved sighting yet`}
            </div>}
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={capture}><Camera size={16} /> {t?.capture || "Capture"}</button>
              <button className="btn btn-outline" onClick={stopCamera}><X size={16} /> {t?.closeCamera || "Close camera"}</button>
            </div>
          </div>
        ) : preview ? (
          <div className="camera-stage">
            <img src={preview} alt="Captured camera preview" className="camera-preview" />
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={analyzeCaptured} disabled={loading}><Video size={16} /> {t?.analyzeCapture || "Analyze capture"}</button>
              <button className="btn btn-outline" onClick={() => setPreview(null)}><RotateCcw size={16} /> {t?.retake || "Retake"}</button>
            </div>
          </div>
        ) : (
          <div className="quick-actions">
            <button className="btn btn-primary" onClick={openCamera}><Camera size={16} /> {t?.openCamera || "Open camera"}</button>
            <button className="btn btn-outline" onClick={() => input.current?.click()}><Upload size={16} /> {t?.uploadImage || "Upload image"}</button>
            <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
                analyze(file);
              }
              event.target.value = "";
            }} />
          </div>
        )}

        {loading && <div className="empty-state">{t?.analyzingImage || "Analyzing image…"}</div>}
        {error && <div className="error-note">{error}</div>}
        {result && (
          <div className="detection-results">
            <h2>{t?.detectionResults || "Detection results"}</h2>
            {preview && (
              <div className="annotated-image">
                <img src={preview} alt="Analyzed image" className="camera-preview" />
                {result.detections.map((item, index) => (
                  <DetectionBox key={`${item.object}-${index}`} item={item} imageSize={result.image_size} />
                ))}
                {result.people?.map((person, index) => (
                  <DetectionBox key={`${person.person}-${index}`} item={{ ...person, object: person.person }} imageSize={result.image_size} person />
                ))}
              </div>
            )}
            {result.people?.length > 0 && (
              <>
                <h3>{t?.peopleDetected || "People"}</h3>
                {result.people.map((person, index) => (
                  <div className="list-row" key={`${person.person}-${index}`}>
                    <strong>{transliterateName ? transliterateName(person.person) : person.person}</strong>
                    <span>{Math.round(person.confidence * 100)}% {t?.faceSimilarity || "face similarity"}</span>
                  </div>
                ))}
              </>
            )}
            {result.detections.length ? (
              <>
                <h3>{t?.objectsDetected || "Objects"}</h3>
                {result.detections.map((item) => (
                  <div className="list-row" key={item.id}>
                    <strong>{item.object}</strong>
                    <span>
                      {Math.round(item.confidence * 100)}% {t?.confidence || "confidence"} · {item.person ? (transliterateName ? transliterateName(item.person) : item.person) : (t?.personNotIdentified || "Person not identified")} · {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-state">{t?.noSupportedObjectsDetected || "No supported objects were detected."}</div>
            )}
          </div>
        )}
        {query.trim() && (
          <div className="detection-results">
            <h2>Last seen: {query}</h2>
            {lastSeen.length ? lastSeen.slice(0, 10).map((item) => (
              <div className="list-row" key={item.id || `${item.timestamp}-${item.object}`}>
                <strong>{item.object} · {Math.round(item.confidence * 100)}%</strong>
                <span>{new Date(item.timestamp).toLocaleString()} {item.location ? `· ${item.location}` : ""}</span>
              </div>
            )) : <div className="empty-state">No saved sightings yet. Scan the live feed or upload an image.</div>}
          </div>
        )}
      </section>
>>>>>>> 793ac7deb2b90b53cd66eaa442c60ada77921602
    </div>
  );
}

<<<<<<< HEAD
// Precise Bounding Box Component
function BoundingBoxOverlay({ item, imageSize, isMatch }) {
  if (!imageSize?.width || !imageSize?.height || !item.bounding_box) return null;
  const [x1, y1, x2, y2] = item.bounding_box;
  const left = (x1 / imageSize.width) * 100;
  const top = (y1 / imageSize.height) * 100;
  const width = ((x2 - x1) / imageSize.width) * 100;
  const height = ((y2 - y1) / imageSize.height) * 100;

  return (
    <div
      className={`detection-box-overlay ${isMatch ? "match-highlight" : ""}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`
      }}
    >
      <div className="detection-box-label">
        <span className="box-name">{item.object}</span>
        <span className="box-conf">{Math.round(item.confidence * 100)}%</span>
      </div>
    </div>
  );
=======
function DetectionBox({ item, imageSize, person = false }) {
  if (!imageSize?.width || !imageSize?.height || !item.bounding_box) return null;
  const [x1, y1, x2, y2] = item.bounding_box;
  return <div className={`detection-box${person ? " person-box" : ""}`} style={{ left: `${x1 / imageSize.width * 100}%`, top: `${y1 / imageSize.height * 100}%`, width: `${(x2 - x1) / imageSize.width * 100}%`, height: `${(y2 - y1) / imageSize.height * 100}%` }}><span>{item.object} {Math.round(item.confidence * 100)}%</span></div>;
>>>>>>> 793ac7deb2b90b53cd66eaa442c60ada77921602
}
