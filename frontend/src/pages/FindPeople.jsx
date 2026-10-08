import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FindPeople() {
  const { t } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError("");
    setLoading(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported in this browser.");
      setLoading(false);
      return;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch {
          // Autoplay will proceed for muted video element
        }
      }
      setIsLive(true);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission is required to use Find My People.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Camera is currently unavailable.");
      } else {
        setError("Camera initialization error. Please check your camera settings.");
      }
      stopCamera();
    } finally {
      setLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (isLive && videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLive]);

  return (
    <div className="page">
      <div className="page-heading">
        <h1>{t?.navFindPeople || "Find My People"}</h1>
        <p>{t?.findPeopleDesc || "Live camera feed for finding and monitoring people."}</p>
      </div>

      <section className="panel find-things-panel">
        <div className="camera-stage">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-preview"
          />
        </div>

        {loading && <div className="empty-state">Starting live camera feed…</div>}
        {error && (
          <div className="error-note" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "4px 10px", fontSize: "11px", marginLeft: "12px" }}
              onClick={startCamera}
            >
              <RefreshCw size={13} style={{ marginRight: "4px" }} />
              Retry
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
