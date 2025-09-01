# EpH Calculator Project Documentation

## Project Overview
The EpH Calculator is a professional web application designed for running and cycling performance analysis. It provides two main calculators:
1. **EpH Calculator** - Calculates Effort Points per Hour for running/cycling
2. **400m Track Calculator** - Specialized calculator for 400m track time and split calculations

## Project Structure
```
EpH/
├── app.py                 # Main EpH Calculator backend
├── app_track.py          # 400m Track Calculator backend
├── templates/
│   ├── index.html        # EpH Calculator frontend
│   └── index_track.html  # 400m Track Calculator frontend
├── Dockerfile            # Docker configuration
├── requirements.txt      # Python dependencies
├── README.md            # Project readme
└── project.md           # This project documentation
```

## Features

### 1. EpH Calculator (Existing)
- **EpH Calculation**: Calculate Effort Points per Hour given distance, elevation, and time
- **Time Estimation**: Estimate completion time given distance, elevation, and EpH value
- **Multi-language Support**: English and Traditional Chinese
- **Theme Support**: Light and dark mode
- **Calculation History**: Local storage-based history with click-to-fill functionality

### 2. 400m Track Calculator (Specialized)
- **Pace Input**: Enter pace in min:sec per km format (e.g., 4:30, 7:00)
- **400m Total Time**: Calculate total time to complete 400m
- **Split Times**: Calculate split times for 100m, 200m, 300m, and 400m
- **Formula-based**: Uses exact formulas from test.py for accurate calculations
- **Multi-language Support**: English and Traditional Chinese
- **Theme Support**: Light and dark mode
- **Calculation History**: Local storage-based history

## Technical Architecture

### Backend Technologies
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS custom properties for theming
- **Vanilla JavaScript**: No external dependencies, lightweight
- **Font Awesome**: Icon library for UI elements

### Key Features
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Optimized CSS, minimal JavaScript, efficient DOM manipulation

## API Endpoints

### EpH Calculator (`app.py`)
- `GET /` - Main page with language support
- `POST /calculate` - Calculate EpH or estimated time
- `GET /health` - Health check endpoint

### 400m Track Calculator (`app_track.py`)
- `GET /` - 400m calculator page with language support
- `POST /calculate` - Calculate 400m time and splits from pace
- `GET /health` - Health check endpoint

## Data Models

### EpH Calculator
```python
class EpHRequest(BaseModel):
    mode: str                    # 'eph' or 'time'
    distance: float             # Distance in kilometers
    elevation: float            # Elevation gain in meters
    time: Optional[str]         # Time in hh:mm:ss format
    eph: Optional[float]        # EpH value

class EpHResponse(BaseModel):
    result: str                 # Calculation result
    error: Optional[str]        # Error message if any
```

### 400m Track Calculator
```python
class PaceRequest(BaseModel):
    pace: str                   # Pace in min:sec format (e.g., "4:30")

class PaceResponse(BaseModel):
    total_time_min: str         # Total time in M:SS format
    total_time_sec: int         # Total time in seconds
    split_100m: int            # Time for 100m in seconds
    split_200m: int            # Time for 200m in seconds
    split_300m: int            # Time for 300m in seconds
    split_400m: int            # Time for 400m in seconds
    error: Optional[str]        # Error message if any
```

## Calculation Formulas

### EpH Calculator
- **Total Ep (Effort Points)**: `distance_km + elevation_gain_m / 100`
- **EpH**: `total_ep / hours`
- **Estimated Time**: `total_ep / eph`

### 400m Track Calculator (Based on test.py)
- **Input**: Pace in min:sec per km (e.g., "4:30")
- **Convert Pace to seconds**: `(minutes * 60) + seconds`
- **400m Total Time**: `pace_seconds * 0.4` (since 400m = 0.4 km)
- **100m Split Time**: `pace_seconds * 0.1` (since 100m = 0.1 km)
- **Split Times**: 
  - 100m: `split_100m`
  - 200m: `split_100m * 2`
  - 300m: `split_100m * 3`
  - 400m: `total_seconds`

## User Interface Design

### Design Principles
- **Consistency**: Same design language across both calculators
- **Accessibility**: High contrast, readable fonts, clear labels
- **Responsiveness**: Works on all device sizes
- **Intuitive**: Clear input fields, logical flow, helpful tooltips

### Color Scheme
- **Primary**: Blue (#2563eb) for main actions and highlights
- **Secondary**: Gray (#64748b) for secondary elements
- **Success**: Green (#10b981) for positive results
- **Error**: Red (#ef4444) for error messages
- **Background**: Light (#f8fafc) and dark (#0f172a) themes

## Development Guidelines

### Code Standards
- **Python**: Follow PEP 8, use type hints, docstrings
- **HTML**: Semantic markup, accessibility attributes
- **CSS**: BEM methodology, CSS custom properties, responsive design
- **JavaScript**: ES6+, async/await, event delegation

### Testing Strategy
- **Unit Tests**: Test calculation functions independently
- **Integration Tests**: Test API endpoints with various inputs
- **Frontend Tests**: Test form validation and UI interactions
- **Cross-browser Testing**: Ensure compatibility with major browsers

## Deployment

### Docker
- Multi-stage build for optimized production image
- Environment variable configuration
- Health check endpoints for monitoring

### Environment Variables
- `PORT`: Server port (default: 8080 for EpH, 8081 for Track)
- `HOST`: Server host (default: 0.0.0.0)
- `DEBUG`: Debug mode (default: false)

## Future Enhancements

### Phase 2 Features
- **User Authentication**: User accounts and saved calculations
- **Database Integration**: Persistent storage for calculation history
- **Advanced Analytics**: Performance trends and insights
- **Mobile App**: Native mobile applications
- **API Integration**: Connect with fitness tracking services

### Phase 3 Features
- **Machine Learning**: Personalized performance predictions
- **Social Features**: Share results and compare with others
- **Advanced Metrics**: VO2 max, lactate threshold calculations
- **Export Options**: PDF reports, CSV data export

## Maintenance and Support

### Regular Tasks
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor API response times
- **User Feedback**: Collect and implement user suggestions
- **Bug Fixes**: Address reported issues promptly

### Monitoring
- **Health Checks**: Regular endpoint monitoring
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time and throughput monitoring
- **User Analytics**: Usage patterns and feature adoption

## Project Timeline

### Completed
- ✅ EpH Calculator backend and frontend
- ✅ Multi-language support (EN/CN)
- ✅ Theme switching (Light/Dark)
- ✅ Calculation history functionality
- ✅ Responsive design implementation
- ✅ 400m Track Calculator backend and frontend
- ✅ Specialized 400m calculations with split times

### In Progress
- 🔄 Project documentation updates
- 🔄 Testing and quality assurance

### Next Steps
- 🚧 Performance optimization
- 🚧 User acceptance testing
- 🚧 Deployment preparation

## Contact and Support

### Development Team
- **Lead Developer**: Y.T.
- **Project Manager**: Y.T.
- **QA Engineer**: Y.T.

### Support Channels
- **GitHub Issues**: Bug reports and feature requests
- **Email**: [admin@ystudiohk.com]
- **Documentation**: [docs link]

---

*Last Updated: [Current Date]*
*Version: 1.1.0*
