from flask import Flask, render_template, request
import re

app = Flask(__name__)

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
                result = f"EpH = {result:.2f}"
            elif mode == 'time':
                eph = float(request.form.get('eph'))
                result = calculate_time(distance, elevation, eph)
                result = f"预计完成时间 = {result}"
            else:
                error = "请选择有效的计算模式"
                
        except ValueError as e:
            error = str(e) if "Invalid time format" in str(e) else "请输入有效的数值"
    
    return render_template('index.html', result=result, error=error, mode=mode)

if __name__ == '__main__':
    app.run(debug=True)