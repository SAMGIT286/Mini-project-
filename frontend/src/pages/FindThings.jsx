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

  useEffect(() => () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
  }, [preview]);

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
    } finally {
      setLoading(false);
    }
  };

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
    </div>
  );
}

function DetectionBox({ item, imageSize, person = false }) {
  if (!imageSize?.width || !imageSize?.height || !item.bounding_box) return null;
  const [x1, y1, x2, y2] = item.bounding_box;
  return <div className={`detection-box${person ? " person-box" : ""}`} style={{ left: `${x1 / imageSize.width * 100}%`, top: `${y1 / imageSize.height * 100}%`, width: `${(x2 - x1) / imageSize.width * 100}%`, height: `${(y2 - y1) / imageSize.height * 100}%` }}><span>{item.object} {Math.round(item.confidence * 100)}%</span></div>;
}
