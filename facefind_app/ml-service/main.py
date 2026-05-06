from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import io
from PIL import Image
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FaceFind ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global face analysis model
face_app = None

def get_face_app():
    global face_app
    if face_app is None:
        try:
            import insightface
            from insightface.app import FaceAnalysis
            logger.info("Loading InsightFace model...")
            face_app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
            face_app.prepare(ctx_id=0, det_size=(640, 640))
            logger.info("✅ InsightFace model loaded!")
        except Exception as e:
            logger.error(f"Failed to load InsightFace: {e}")
            raise RuntimeError(f"ML model loading failed: {e}")
    return face_app


def read_image_from_bytes(file_bytes: bytes) -> np.ndarray:
    """Convert bytes to OpenCV image."""
    image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two embedding vectors."""
    a = np.array(a)
    b = np.array(b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FaceFind ML Service"}


@app.post("/process-photo")
async def process_photo(file: UploadFile = File(...), photo_id: str = ""):
    """
    Process an event photo: detect faces and return embeddings.
    Called by backend when admin uploads event photos.
    """
    try:
        app_model = get_face_app()
        file_bytes = await file.read()
        img = read_image_from_bytes(file_bytes)
        
        faces = app_model.get(img)
        
        embeddings = []
        for face in faces:
            if face.embedding is not None:
                embeddings.append(face.embedding.tolist())
        
        logger.info(f"Photo {photo_id}: detected {len(faces)} faces, extracted {len(embeddings)} embeddings")
        
        return {
            "success": True,
            "photo_id": photo_id,
            "face_count": len(embeddings),
            "embeddings": embeddings
        }
    except Exception as e:
        logger.error(f"Error processing photo: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-embedding")
async def get_selfie_embedding(file: UploadFile = File(...)):
    """
    Get face embedding from a guest selfie.
    Returns single embedding for matching.
    """
    try:
        app_model = get_face_app()
        file_bytes = await file.read()
        img = read_image_from_bytes(file_bytes)
        
        faces = app_model.get(img)
        
        if not faces:
            raise HTTPException(
                status_code=400,
                detail="No face detected in the selfie. Please take a clearer photo."
            )
        
        # Use the largest/most prominent face
        largest_face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
        
        if largest_face.embedding is None:
            raise HTTPException(status_code=400, detail="Could not extract face features.")
        
        return {
            "success": True,
            "embedding": largest_face.embedding.tolist(),
            "face_count": len(faces)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting selfie embedding: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class PhotoEmbeddings(BaseModel):
    photo_id: str
    embeddings: List[List[float]]


class MatchRequest(BaseModel):
    selfie_embedding: List[float]
    photo_embeddings: List[PhotoEmbeddings]
    threshold: float = 0.45


@app.post("/match-faces")
async def match_faces(request: MatchRequest):
    """
    Match selfie embedding against all event photo embeddings.
    Returns list of photo IDs where the person appears.
    """
    try:
        selfie_emb = np.array(request.selfie_embedding)
        matched_ids = []
        
        for photo in request.photo_embeddings:
            for emb in photo.embeddings:
                sim = cosine_similarity(selfie_emb, emb)
                if sim >= request.threshold:
                    matched_ids.append(photo.photo_id)
                    break  # Already matched this photo, move on
        
        logger.info(f"Matched {len(matched_ids)} photos out of {len(request.photo_embeddings)}")
        
        return {
            "success": True,
            "matched_photo_ids": matched_ids,
            "total_searched": len(request.photo_embeddings)
        }
    except Exception as e:
        logger.error(f"Match error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
