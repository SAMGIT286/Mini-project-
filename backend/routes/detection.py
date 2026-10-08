from datetime import datetime, timezone
from io import BytesIO
from functools import lru_cache

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from services.observation_service import create_observations
from ai.face_recognition.recognizer import FaceRecognizer

router = APIRouter(prefix="/api/detection", tags=["detection"])


@lru_cache(maxsize=1)
def detector():
    from ai.object_detection.detector import ObjectDetector
    return ObjectDetector()


@lru_cache(maxsize=1)
def recognizer():
    return FaceRecognizer()


@router.post("/image")
async def analyze_image(file: UploadFile = File(...),
                        location: str | None = Form(default=None),
                        person: str | None = Form(default=None),
                        camera_id: str | None = Form(default=None)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(415, "Upload a JPEG, PNG, or WebP image.")
    payload = await file.read()
    if len(payload) > 10 * 1024 * 1024:
        raise HTTPException(413, "Image must be smaller than 10 MB.")
    try:
        image = Image.open(BytesIO(payload)).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "The uploaded file is not a valid image.")
    try:
        detections = detector().detect(image)
    except RuntimeError as exc:
        raise HTTPException(503, f"Object detection is unavailable: {exc}")
    try:
        people = recognizer().recognize(__import__("numpy").array(image))
    except RuntimeError as exc:
        raise HTTPException(503, f"Face recognition is unavailable: {exc}")
    timestamp = datetime.now(timezone.utc)
    recognized_person = next((item["person"] for item in people if item["person"] != "Unknown"), person)
    observations = create_observations([
        {**item, "person": recognized_person, "location": location, "camera_id": camera_id, "timestamp": timestamp}
        for item in detections
    ])
    return {"timestamp": timestamp, "people": people, "detections": observations}


@router.post("/frame")
async def analyze_frame(file: UploadFile = File(...), location: str | None = Form(default=None)):
    return await analyze_image(file, location=location)
