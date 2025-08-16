from flask import Flask, render_template, request
import re

app = Flask(__name__)

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

def calculate_ep(distance_km, elevation_gain_m):
    """Calculate total Ep value (Effort Points)"""
    return distance_km + elevation_gain_m / 100

def calculate_eph(distance_km, elevation_gain_m, time_str):
    """Calculate EpH (Effort Points per Hour)"""
    hours = hms_to_hours(time_str)
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    return total_ep / hours

def calculate_time(distance_km, elevation_gain_m, eph):
    """Calculate estimated completion time and return in hh:mm:ss format"""
    total_ep = calculate_ep(distance_km, elevation_gain_m)
    hours_decimal = total_ep / eph
    return hours_to_hms(hours_decimal)

def hms_to_hours(time_str):
    """Convert hh:mm:ss or hh:mm format to hours (decimal)"""
    pattern = r'^(\d+)(?::(\d{1,2}))?(?::(\d{1,2}))?$'
    match = re.match(pattern, time_str.strip())
    if not match:
        raise ValueError("Invalid time format")
    
    hours = int(match.group(1))
    minutes = int(match.group(2)) if match.group(2) else 0
    seconds = int(match.group(3)) if match.group(3) else 0
    
    return hours + minutes/60 + seconds/3600

def hours_to_hms(hours_decimal):
    """Convert hours (decimal) to hh:mm:ss format"""
    total_seconds = int(round(hours_decimal * 3600))
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

@app.route('/', methods=['GET', 'POST'])
def index():
    # Get language from query parameter, default to 'zh' (Traditional Chinese)
    lang = request.args.get('lang', 'zh')
    if lang not in ['en', 'zh']:
        lang = 'zh'
    translations = TRANSLATIONS[lang]

    result = None
    error = None
    mode = None
    
    if request.method == 'POST':
        mode = request.form.get('mode')
        try:
            distance = float(request.form.get('distance'))
            elevation = float(request.form.get('elevation'))
            
            if mode == 'eph':
                time_str = request.form.get('time')
                result = calculate_eph(distance, elevation, time_str)
                result = translations['result_eph'].format(result)
            elif mode == 'time':
                eph = float(request.form.get('eph'))
                result = calculate_time(distance, elevation, eph)
                result = translations['result_time'].format(result)
            else:
                error = translations['error_mode']
                
        except ValueError as e:
            error = translations['error_time_format'] if "Invalid time format" in str(e) else translations['error_invalid']
    
    return render_template('index.html', result=result, error=error, mode=mode, translations=translations, lang=lang)