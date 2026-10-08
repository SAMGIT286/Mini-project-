import { Camera, RotateCcw, Upload, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { analyzeImage } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function FindThings() {
  const { t, transliterateName } = useAuth();
  const input = useRef(null);
  const video = useRef(null);
  const stream = useRef(null);
  const canvas = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (cameraOpen && video.current && stream.current) {
      video.current.srcObject = stream.current;
    }
  }, [cameraOpen]);

  const stopCamera = () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCameraOpen(false);
  };

  const openCamera = async () => {
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
  };

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
      setResult(await analyzeImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        {cameraOpen ? (
          <div className="camera-stage">
            <video ref={video} autoPlay playsInline muted className="camera-preview" />
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
            <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => analyze(event.target.files?.[0])} />
          </div>
        )}

        {loading && <div className="empty-state">{t?.analyzingImage || "Analyzing image…"}</div>}
        {error && <div className="error-note">{error}</div>}
        {result && (
          <div className="detection-results">
            <h2>{t?.detectionResults || "Detection results"}</h2>
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
      </section>
    </div>
  );
}
