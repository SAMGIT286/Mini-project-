from pathlib import Path
from typing import Any

MODEL_PATH = Path(__file__).with_name("best.pt")


class ObjectDetector:
    def __init__(self, confidence: float = 0.35):
        self.confidence = confidence
        self.model: Any = None
        self.error: str | None = None
        try:
            from ultralytics import YOLO
            self.model = YOLO(str(MODEL_PATH))
        except (ImportError, OSError, RuntimeError) as exc:
            self.error = str(exc)

    def detect(self, image) -> list[dict[str, Any]]:
        if self.model is None:
            raise RuntimeError(self.error or "YOLO model is unavailable")
        results = self.model.predict(image, conf=self.confidence, verbose=False)
        detections = []
        for result in results:
            names = result.names
            for box in result.boxes:
                confidence = float(box.conf[0])
                coords = [float(value) for value in box.xyxy[0].tolist()]
                class_id = int(box.cls[0])
                detections.append({
                    "object": str(names[class_id]),
                    "confidence": confidence,
                    "bounding_box": coords,
                })
        return detections
