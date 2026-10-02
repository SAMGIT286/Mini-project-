
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load the .env file located beside main.py
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)

API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")

print("Environment file found:", ENV_FILE.is_file())
print("OpenRouter key loaded:", bool(API_KEY))
print("Model configured:", MODEL)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

app = FastAPI(title="MemoMind API")

# Allow requests from the local React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Message(BaseModel):
    role: str
    content: str = Field(min_length=1, max_length=10000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)
    history: list[Message] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def home():
    return {
        "message": "MemoMind backend is running!"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    # Check whether the API key is configured.
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenRouter API key is not configured.",
        )

    # Validate conversation history.
    for item in request.history:
        if item.role not in ("user", "assistant"):
            raise HTTPException(
                status_code=400,
                detail="Invalid role in conversation history.",
            )

    # Use only recent conversation context.
    recent_history = request.history[-10:]

    system_prompt = (
        "You are MemoMind, a personal memory and daily-life "
        "assistant. Be friendly, patient, clear, and concise. "
        "Use simple language and short paragraphs.\n\n"

        "Your responsibilities:\n"
        "- Help users understand and organize information.\n"
        "- Answer questions using conversation context and "
        "personal records explicitly provided to you.\n"
        "- Help with daily routines, medicines, appointments, "
        "and personal memories.\n\n"

        "Important rules:\n"
        "- Never invent personal memories, medicine records, "
        "appointments, dates, or events.\n"
        "- If required information is missing, say so clearly "
        "and ask the user for it.\n"
        "- Never claim that a medicine was taken unless a "
        "supplied record confirms it.\n"
        "- Do not diagnose medical conditions or change "
        "prescribed medicines or dosages.\n"
        "- Distinguish confirmed records from suggestions "
        "or assumptions.\n"
        "- Keep answers relevant to the user's question.\n"
        "- Do not claim to have saved information permanently "
        "unless the application confirms it."
    )

    messages = [
        {
            "role": "system",
            "content": system_prompt,
        }
    ]

    messages.extend(
        item.model_dump() for item in recent_history
    )

    messages.append({
        "role": "user",
        "content": request.message,
    })

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 500,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OPENROUTER_URL,
                headers=headers,
                json=payload,
            )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="The AI request timed out. Please try again.",
        )

    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to the AI service.",
        )

    # Handle common API errors without exposing the API key.
    if response.status_code == 401:
        raise HTTPException(
            status_code=502,
            detail="OpenRouter rejected the API key. "
                   "Please check your configuration.",
        )

    if response.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="The AI service is busy or the rate limit "
                   "has been reached. Please try again later.",
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail="The AI service returned an error. "
                   "Check your model configuration and account.",
        )

    # Extract the assistant's response.
    try:
        data = response.json()
        reply = data["choices"][0]["message"]["content"]

        if not isinstance(reply, str) or not reply.strip():
            raise ValueError("Empty response")

    except (ValueError, KeyError, IndexError, TypeError):
        raise HTTPException(
            status_code=502,
            detail="The AI service returned an invalid response.",
        )

    return ChatResponse(reply=reply.strip())