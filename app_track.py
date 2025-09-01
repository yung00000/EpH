from fastapi import FastAPI, Request, Form, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional
import re
import os
import uvicorn

app = FastAPI(
    title="400m Track Calculator",
    description="A specialized 400m track calculator for running pace and time calculations",
    version="1.0.0"
)

# Mount static files and templates
templates = Jinja2Templates(directory="templates")

# Translation dictionary for English and Traditional Chinese
TRANSLATIONS = {
    'en': {
        'title': '400m Track Calculator',
        'subtitle': 'Calculate 400m time and splits from your pace',
        'pace_label': 'Enter your pace (min:sec per km):',
        'pace_placeholder': 'e.g., 4:30 or 7:00',
        'submit_button': 'Calculate',
        'language_label': 'Language:',
        'result_title': '400m Results',
        'total_time': 'Total Time for 400m:',
        'splits_title': 'Split Times:',
        'split_100m': '100m:',
        'split_200m': '200m:',
        'split_300m': '300m:',
        'split_400m': '400m:',
        'error_pace_format': 'Invalid pace format. Use M:SS (e.g., 4:30) or M (e.g., 7)',
        'pace_info': 'Enter your pace in minutes:seconds per kilometer format',
        'pace_examples': 'Examples: 4:30 (4 min 30 sec), 7:00 (7 min), 5:15 (5 min 15 sec)'
    },
    'zh': {
        'title': '400米賽道計算器',
        'subtitle': '根據配速計算400米時間和分段時間',
        'pace_label': '輸入配速 (分:秒/公里)：',
        'pace_placeholder': '例如：4:30 或 7:00',
        'submit_button': '計算',
        'language_label': '語言：',
        'result_title': '400米結果',
        'total_time': '400米總時間：',
        'splits_title': '分段時間：',
        'split_100m': '100米：',
        'split_200m': '200米：',
        'split_300m': '300米：',
        'split_400m': '400米：',
        'error_pace_format': '無效的配速格式。請使用 M:SS 格式（例如：4:30）或 M 格式（例如：7）',
        'pace_info': '請以分:秒/公里的格式輸入配速',
        'pace_examples': '範例：4:30（4分30秒）、7:00（7分）、5:15（5分15秒）'
    }
}

# Pydantic models for request validation
class PaceRequest(BaseModel):
    pace: str

class PaceResponse(BaseModel):
    total_time_min: str
    total_time_sec: int
    split_100m: int
    split_200m: int
    split_300m: int
    split_400m: int
    error: Optional[str] = None

def parse_pace(pace_str: str) -> int:
    """Convert pace string (M:SS or M) to seconds per kilometer."""
    try:
        if ":" in pace_str:
            minutes, seconds = map(int, pace_str.split(":"))
            
            # Validate minutes and seconds
            if minutes < 0:
                raise ValueError("Minutes cannot be negative")
            if minutes > 60:
                raise ValueError("Minutes cannot exceed 60")
            if seconds < 0 or seconds > 59:
                raise ValueError("Seconds must be between 0 and 59")
            
            return minutes * 60 + seconds
        else:
            minutes = int(pace_str)
            if minutes < 0:
                raise ValueError("Minutes cannot be negative")
            if minutes > 60:
                raise ValueError("Minutes cannot exceed 60")
            return minutes * 60
    except ValueError as e:
        if "invalid literal" in str(e):
            raise ValueError("Invalid pace format. Use M:SS (e.g., '4:30') or M (e.g., '7').")
        raise e

def calculate_times(pace_seconds: int, distance_km: float = 0.4, split_distance_km: float = 0.1):
    """Calculate total time for 400m and time per 100m."""
    # Total time for 400 meters
    total_seconds = pace_seconds * distance_km
    total_minutes = int(total_seconds // 60)
    total_rem_seconds = int(total_seconds % 60)
    
    # Time per 100 meters
    split_seconds = pace_seconds * split_distance_km
    
    return total_seconds, total_minutes, total_rem_seconds, split_seconds

def format_time(minutes: int, seconds: int) -> str:
    """Format time as M:SS."""
    return f"{minutes}:{seconds:02d}"

@app.get("/", response_class=HTMLResponse)
async def index(request: Request, lang: str = Query("zh", description="Language preference")):
    """Main page endpoint"""
    if lang not in ['en', 'zh']:
        lang = 'zh'
    translations = TRANSLATIONS[lang]
    
    return templates.TemplateResponse(
        "index_track.html", 
        {"request": request, "translations": translations, "lang": lang}
    )

@app.post("/calculate", response_model=PaceResponse)
async def calculate(request: Request, pace: str = Form(...)):
    """Calculate 400m time and splits from pace"""
    try:
        pace_seconds = parse_pace(pace)
        total_seconds, total_minutes, total_rem_seconds, split_seconds = calculate_times(pace_seconds)
        
        # Calculate split times
        split_100m = int(split_seconds)
        split_200m = split_100m * 2
        split_300m = split_100m * 3
        split_400m = int(total_seconds)
        
        return PaceResponse(
            total_time_min=format_time(total_minutes, total_rem_seconds),
            total_time_sec=int(total_seconds),
            split_100m=split_100m,
            split_200m=split_200m,
            split_300m=split_300m,
            split_400m=split_400m
        )
        
    except ValueError as e:
        return PaceResponse(
            total_time_min="",
            total_time_sec=0,
            split_100m=0,
            split_200m=0,
            split_300m=0,
            split_400m=0,
            error=str(e)
        )
    
    except Exception as e:
        return PaceResponse(
            total_time_min="",
            total_time_sec=0,
            split_100m=0,
            split_200m=0,
            split_300m=0,
            split_400m=0,
            error="An error occurred during calculation"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "400m Track Calculator"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8081))  # Different port from main app
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    
    uvicorn.run(
        "app_track:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
