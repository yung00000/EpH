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
    title="EpH Calculator",
    description="A professional EpH (Effort Points per Hour) calculator for running and cycling",
    version="1.0.0"
)

# Mount static files and templates
templates = Jinja2Templates(directory="templates")

# Translation dictionary for English and Traditional Chinese
TRANSLATIONS = {
    'en': {
        'title': 'EpH Calculator',
        'mode_label': 'Calculation Mode:',
        'mode_select': 'Select',
        'mode_eph': 'Calculate EpH',
        'mode_time': 'Calculate Estimated Time',
        'distance_label': 'Distance (km):',
        'elevation_label': 'Elevation Gain (m):',
        'time_label': 'Time (hh:mm:ss or hh:mm):',
        'eph_label': 'EpH Value:',
        'submit_button': 'Calculate',
        'language_label': 'Language:',
        'result_eph': 'EpH = {:.2f}',
        'result_time': 'Estimated Completion Time = {}',
        'error_mode': 'Please select a valid calculation mode',
        'error_invalid': 'Please enter valid values',
        'error_time_format': 'Invalid time format',
        'time_placeholder': 'e.g., 3:30:00'
    },
    'zh': {
        'title': 'EpH計算器',
        'mode_label': '計算模式：',
        'mode_select': '請選擇',
        'mode_eph': '計算EpH',
        'mode_time': '計算預計時間',
        'distance_label': '距離 (公里)：',
        'elevation_label': '爬升高度 (米)：',
        'time_label': '耗時 (hh:mm:ss 或 hh:mm)：',
        'eph_label': 'EpH值：',
        'submit_button': '計算',
        'language_label': '語言：',
        'result_eph': 'EpH = {:.2f}',
        'result_time': '預計完成時間 = {}',
        'error_mode': '請選擇有效的計算模式',
        'error_invalid': '請輸入有效的數值',
        'error_time_format': '無效的時間格式',
        'time_placeholder': '例如：3:30:00'
    }
}

# Pydantic models for request validation
class EpHRequest(BaseModel):
    mode: str
    distance: float
    elevation: float
    time: Optional[str] = None
    eph: Optional[float] = None

class EpHResponse(BaseModel):
    result: str
    error: Optional[str] = None

def calculate_ep(distance_km: float, elevation_gain_m: float) -> float:
    """Calculate total Ep value (Effort Points)"""
    return distance_km + elevation_gain_m / 100

def calculate_eph(distance_km: float, elevation_gain_m: float, time_str: str) -> float:
    """Calculate EpH (Effort Points per Hour)"""
    hours = hms_to_hours(time_str)
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    return total_ep / hours

def calculate_time(distance_km: float, elevation_gain_m: float, eph: float) -> str:
    """Calculate estimated completion time and return in hh:mm:ss format"""
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    hours_decimal = total_ep / eph
    return hours_to_hms(hours_decimal)

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

@app.get("/", response_class=HTMLResponse)
async def index(request: Request, lang: str = Query("zh", description="Language preference")):
    """Main page endpoint"""
    if lang not in ['en', 'zh']:
        lang = 'zh'
    translations = TRANSLATIONS[lang]
    
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "translations": translations, "lang": lang}
    )

@app.post("/calculate", response_model=EpHResponse)
async def calculate(request: Request, mode: str = Form(...), distance: float = Form(...), 
                   elevation: float = Form(...), time: Optional[str] = Form(None), 
                   eph: Optional[float] = Form(None)):
    """Calculate EpH or estimated time based on input parameters"""
    try:
        if mode == 'eph':
            if not time:
                return EpHResponse(result="", error="Time is required for EpH calculation")
            result = calculate_eph(distance, elevation, time)
            return EpHResponse(result=f"EpH = {result:.2f}")
        elif mode == 'time':
            if not eph:
                return EpHResponse(result="", error="EpH value is required for time calculation")
            result = calculate_time(distance, elevation, eph)
            return EpHResponse(result=f"Estimated Completion Time = {result}")
        else:
            return EpHResponse(result="", error="Invalid calculation mode")
    except ValueError as e:
        if "Invalid time format" in str(e):
            return EpHResponse(result="", error="Invalid time format")
        return EpHResponse(result="", error="Please enter valid values")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "EpH Calculator"}

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