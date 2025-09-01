# EpH Calculator Suite

A comprehensive suite of professional calculators built with FastAPI, designed for running and cycling performance analysis.

## Applications

1. **EpH Calculator** - Calculate Effort Points per Hour for running/cycling
2. **400m Track Calculator** - Specialized calculator for 400m track time and split calculations

## Features

### EpH Calculator
- **Dual Calculation Modes**: Calculate EpH from time or estimate completion time from EpH
- **Bilingual Support**: English and Traditional Chinese interfaces
- **Professional UI**: Modern, responsive design with intuitive user experience
- **Calculation History**: Local storage for tracking previous calculations
- **Real-time Validation**: Input validation and error handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 400m Track Calculator
- **Pace Input**: Enter pace in min:sec per km format (e.g., 4:30, 7:00)
- **400m Total Time**: Calculate total time to complete 400m
- **Split Times**: Calculate split times for 100m, 200m, 300m, and 400m
- **Formula-based**: Uses exact formulas from test.py for accurate calculations
- **Professional UI**: Consistent design language with the EpH calculator
- **Calculation History**: Local storage for tracking previous calculations
- **Real-time Validation**: Input validation and error handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## What is EpH?

EpH (Effort Points per Hour) is a metric that combines distance and elevation gain to measure the intensity of a route. It's calculated as:

```
EpH = (Distance + Elevation/100) / Time
```

Where:
- Distance is in kilometers
- Elevation is in meters
- Time is in hours

## 400m Track Calculator Formulas

The 400m calculator uses the exact formulas from your test.py file:

- **Input**: Pace in min:sec per km (e.g., "4:30")
- **Convert Pace to seconds**: `(minutes * 60) + seconds`
- **400m Total Time**: `pace_seconds * 0.4` (since 400m = 0.4 km)
- **100m Split Time**: `pace_seconds * 0.1` (since 100m = 0.1 km)
- **Split Times**: 
  - 100m: `split_100m`
  - 200m: `split_100m * 2`
  - 300m: `split_100m * 3`
  - 400m: `total_seconds`

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Server**: Uvicorn (ASGI)

## Installation

### Prerequisites

- Python 3.8+
- pip

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd EpH
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the applications:

**Option 1: Run individually**
```bash
# EpH Calculator (Port 8080)
python app.py

# 400m Track Calculator (Port 8081)
python app_track.py
```

**Option 2: Use the startup script**
```bash
python start_apps.py
```

**Option 3: Run both simultaneously**
```bash
# Terminal 1
python app.py

# Terminal 2
python app_track.py
```

**Access URLs:**
- EpH Calculator: `http://localhost:8080`
- 400m Track Calculator: `http://localhost:8081`

### Environment Variables

- `PORT`: Server port (default: 8080 for EpH, 8081 for Track)
- `HOST`: Server host (default: 0.0.0.0)
- `DEBUG`: Enable debug mode (default: false)

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t eph-calculator .
```

2. Run the container:
```bash
docker run -p 8080:8080 eph-calculator
```

## API Endpoints

### EpH Calculator (`app.py`)
- `GET /`: Main application interface
- `POST /calculate`: Calculate EpH or estimated time
- `GET /health`: Health check endpoint

### 400m Track Calculator (`app_track.py`)
- `GET /`: 400m calculator interface
- `POST /calculate`: Calculate 400m time and splits from pace
- `GET /health`: Health check endpoint

## Usage

### EpH Calculator

#### Calculating EpH
1. Select "Calculate EpH" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter completion time (format: hh:mm:ss or hh:mm)
5. Click "Calculate"

#### Estimating Completion Time
1. Select "Calculate Estimated Time" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter target EpH value
5. Click "Calculate"

### 400m Track Calculator

#### Calculating 400m Time and Splits
1. Enter your pace in min:sec per km format (e.g., 4:30, 7:00)
2. Click "Calculate"
3. View results:
   - Total time for 400m
   - Split times for 100m, 200m, 300m, and 400m

#### Pace Format Examples
- `4:30` = 4 minutes 30 seconds per kilometer
- `7:00` = 7 minutes per kilometer
- `5:15` = 5 minutes 15 seconds per kilometer

## Features

- **Language Switching**: Toggle between English and Traditional Chinese
- **Input Validation**: Real-time validation with helpful error messages
- **Calculation History**: View and reuse previous calculations
- **Responsive Design**: Optimized for all device sizes
- **Professional UI**: Clean, modern interface with smooth animations

## Testing and Utilities

### Test Applications
```bash
# Test both applications can start successfully
python test_apps.py
```

### Startup Script
```bash
# Interactive startup script for managing applications
python start_apps.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.