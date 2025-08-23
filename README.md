# EpH Calculator

A professional EpH (Effort Points per Hour) calculator built with FastAPI, designed for running and cycling performance analysis.

## Features

- **Dual Calculation Modes**: Calculate EpH from time or estimate completion time from EpH
- **Bilingual Support**: English and Traditional Chinese interfaces
- **Professional UI**: Modern, responsive design with intuitive user experience
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

4. Run the application:
```bash
python app.py
```

The application will be available at `http://localhost:8080`

### Environment Variables

- `PORT`: Server port (default: 8080)
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

- `GET /`: Main application interface
- `POST /calculate`: Calculate EpH or estimated time
- `GET /health`: Health check endpoint

## Usage

### Calculating EpH

1. Select "Calculate EpH" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter completion time (format: hh:mm:ss or hh:mm)
5. Click "Calculate"

### Estimating Completion Time

1. Select "Calculate Estimated Time" mode
2. Enter distance in kilometers
3. Enter elevation gain in meters
4. Enter target EpH value
5. Click "Calculate"

## Features

- **Language Switching**: Toggle between English and Traditional Chinese
- **Input Validation**: Real-time validation with helpful error messages
- **Calculation History**: View and reuse previous calculations
- **Responsive Design**: Optimized for all device sizes
- **Professional UI**: Clean, modern interface with smooth animations

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