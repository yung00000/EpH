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
    title="RunCals Pro",
    description="Professional EpH and 400m Track Calculator for running",
    version="1.2.0"
)

# Mount static files and templates
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Translation dictionary for English and Traditional Chinese
TRANSLATIONS = {
    'en': {
        'title': 'EpH Calculator',
        'subtitle': 'Professional EpH calculator for trailrunning performance analysis',
        'mode_label': 'Calculation Mode:',
        'mode_select': 'Select',
        'mode_eph': 'Calculate EpH',
        'mode_time': 'Calculate Estimated Time',
        'distance_label': 'Distance (km):',
        'elevation_label': 'Elevation Gain (m):',
        'time_label': 'Time (hh:mm:ss or hh:mm):',
        'eph_label': 'Target EpH:',
        'submit_button': 'Calculate',
        'language_label': 'Language:',
        'result_eph': 'EpH = {:.2f}',
        'result_time': 'Estimated Time = {}',
        'error_mode': 'Please select a valid calculation mode',
        'error_invalid': 'Please enter valid values',
        'error_time_format': 'Invalid time format',
        'time_placeholder': 'e.g., 2:30:00 or 2:30'
    },
    'zh': {
        'title': 'EpH計算器',
        'subtitle': '專業的EpH計算器，用於越野跑步表現分析',
        'mode_label': '計算模式：',
        'mode_select': '請選擇',
        'mode_eph': '計算EpH',
        'mode_time': '計算預估時間',
        'distance_label': '距離 (公里)：',
        'elevation_label': '海拔增益 (米)：',
        'time_label': '時間 (hh:mm:ss 或 hh:mm)：',
        'eph_label': '目標EpH：',
        'submit_button': '計算',
        'language_label': '語言：',
        'result_eph': 'EpH = {:.2f}',
        'result_time': '預估時間 = {}',
        'error_mode': '請選擇有效的計算模式',
        'error_invalid': '請輸入有效的數值',
        'error_time_format': '無效的時間格式',
        'time_placeholder': '例如：2:30:00 或 2:30'
    }
}

# Track Calculator Translations
TRACK_TRANSLATIONS = {
    'en': {
        'title': '400m Track Calculator',
        'subtitle': 'Calculate 400m time and splits from your pace',
        'pace_label': 'Enter your pace (min:sec per km):',
        'pace_placeholder': 'e.g., 4:30 or 7:00',
        'submit_button': 'Calculate',
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
class EpHRequest(BaseModel):
    mode: str                    # 'eph' or 'time'
    distance: float             # Distance in kilometers
    elevation: float            # Elevation gain in meters
    time: Optional[str]         # Time in hh:mm:ss format
    eph: Optional[float]        # EpH value

class EpHResponse(BaseModel):
    result: str                 # Calculation result
    error: str = ""            # Error message if any (empty string for no error)
    
    class Config:
        # Ensure all fields are properly handled
        extra = "forbid"
        validate_assignment = True
    
    def __init__(self, **data):
        # Ensure all fields are properly set
        if 'result' not in data:
            data['result'] = ""
        if 'error' not in data:
            data['error'] = ""
        super().__init__(**data)

# Track Calculator Models
class PaceRequest(BaseModel):
    pace: str

class PaceResponse(BaseModel):
    total_time_min: str = ""
    total_time_sec: int = 0
    split_100m: int = 0
    split_200m: int = 0
    split_300m: int = 0
    split_400m: int = 0
    error: str = ""
    
    class Config:
        # Ensure all fields are properly handled
        extra = "forbid"
        validate_assignment = True
    
    def __init__(self, **data):
        # Ensure all fields are properly set
        if 'total_time_min' not in data:
            data['total_time_min'] = ""
        if 'total_time_sec' not in data:
            data['total_time_sec'] = 0
        if 'split_100m' not in data:
            data['split_100m'] = 0
        if 'split_200m' not in data:
            data['split_200m'] = 0
        if 'split_300m' not in data:
            data['split_300m'] = 0
        if 'split_400m' not in data:
            data['split_400m'] = 0
        if 'error' not in data:
            data['error'] = ""
        super().__init__(**data)

def hms_to_hours(time_str: str) -> float:
    """Convert hh:mm:ss or hh:mm format to hours (decimal)"""
    pattern = r'^(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$'
    match = re.match(pattern, time_str.strip())
    if not match:
        raise ValueError("Invalid time format")
    
    hours = int(match.group(1))
    minutes = int(match.group(2)) if match.group(2) else 0
    seconds = int(match.group(3)) if match.group(3) else 0
    
    return hours + minutes/60 + seconds/3600

def hours_to_hms(hours_decimal: float) -> str:
    """Convert hours (decimal) to hh:mm:ss format"""
    total_seconds = int(round(hours_decimal * 3600))
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

# Track Calculator Functions
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

def calculate_eph(distance_km: float, elevation_m: float, time_str: str) -> float:
    """Calculate EpH given distance, elevation, and time"""
    hours = hms_to_hours(time_str)
    if hours <= 0:
        raise ValueError("Time must be greater than 0")
    
    total_ep = distance_km + elevation_m / 100
    return total_ep / hours

def calculate_time(distance_km: float, elevation_m: float, eph: float) -> str:
    """Calculate estimated time given distance, elevation, and EpH"""
    if eph <= 0:
        raise ValueError("EpH must be greater than 0")
    
    total_ep = distance_km + elevation_m / 100
    hours = total_ep / eph
    return hours_to_hms(hours)

@app.get("/", response_class=HTMLResponse)
async def index(request: Request, lang: str = Query("zh", description="Language preference")):
    """Main EpH Calculator page endpoint"""
    if lang not in ['en', 'zh']:
        lang = 'zh'
    translations = TRANSLATIONS[lang]
    
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "translations": translations, "lang": lang}
    )

@app.get("/track", response_class=HTMLResponse)
async def track_index(request: Request, lang: str = Query("zh", description="Language preference")):
    """400m Track Calculator page endpoint"""
    if lang not in ['en', 'zh']:
        lang = 'zh'
    translations = TRACK_TRANSLATIONS[lang]
    
    return templates.TemplateResponse(
        "index_track.html", 
        {"request": request, "translations": translations, "lang": lang}
    )

@app.post("/calculate", response_model=EpHResponse)
async def calculate(request: Request, mode: str = Form(...), 
                   distance: float = Form(...), 
                   elevation: float = Form(...),
                   time: Optional[str] = Form(None),
                   eph: Optional[float] = Form(None)):
    """Calculate EpH or estimated time"""
    try:
        if mode == 'eph':
            if not time:
                return EpHResponse(result="", error="Time is required for EpH calculation")
            result = calculate_eph(distance, elevation, time)
            return EpHResponse(result=f"EpH = {result:.2f}", error="")
        
        elif mode == 'time':
            if not eph:
                return EpHResponse(result="", error="EpH value is required for time calculation")
            result = calculate_time(distance, elevation, eph)
            return EpHResponse(result=f"Estimated Time = {result}", error="")
        
        else:
            return EpHResponse(result="", error="Invalid calculation mode")
    
    except ValueError as e:
        if "Invalid time format" in str(e):
            return EpHResponse(result="", error="Invalid time format")
        return EpHResponse(result="", error=str(e))
    
    except Exception as e:
        return EpHResponse(result="", error="Please enter valid values")

@app.post("/track/calculate", response_model=PaceResponse)
async def track_calculate(request: Request, pace: str = Form(...)):
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
    return {"status": "healthy", "service": "EpH Calculator Suite"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )