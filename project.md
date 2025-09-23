# EpH Calculator Project Documentation

## Project Overview
The EpH Calculator Suite is a professional web application designed for running and cycling performance analysis. It provides two main calculators in a unified application:
1. **EpH Calculator** - Calculates Effort Points per Hour for running and cycling
2. **400m Track Calculator** - Specialized calculator for 400m track time and split calculations

## Project Structure
```
EpH/
├── app.py                 # Main unified application (EpH + 400m Track)
├── templates/
│   ├── index.html        # EpH Calculator frontend
│   └── index_track.html  # 400m Track Calculator frontend
├── Dockerfile            # Docker configuration
├── requirements.txt      # Python dependencies
├── README.md            # Project readme
├── project.md           # This project documentation
└── test.py              # Test calculations and formulas
```

## Features

### 1. EpH Calculator
- **EpH Calculation**: Calculate Effort Points per Hour given distance, elevation, and time
- **Time Estimation**: Estimate completion time given distance, elevation, and EpH value
- **Multi-language Support**: English and Traditional Chinese with compact labels (EN/繁)
- **Theme Support**: Light and dark mode toggle
- **Calculation History**: Local storage-based history with click-to-fill functionality
- **Mobile-First Design**: Optimized for mobile web applications with compact UI

### 2. 400m Track Calculator
- **Pace Input**: Enter pace in min:sec per km format (e.g., 4:30, 7:00)
- **400m Total Time**: Calculate total time to complete 400m with compact display
- **Split Times**: Calculate split times for 100m, 200m, 300m, and 400m in horizontal layout
- **Formula-based**: Uses exact formulas from test.py for accurate calculations
- **Multi-language Support**: English and Traditional Chinese with compact labels (EN/繁)
- **Theme Support**: Light and dark mode toggle
- **Calculation History**: Local storage-based history
- **Mobile-First Design**: Compact, space-efficient UI optimized for mobile devices

## Technical Architecture

### Backend Technologies
- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic v2**: Data validation using Python type annotations with robust error handling
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS custom properties for theming, mobile-first responsive design
- **Vanilla JavaScript**: No external dependencies, lightweight and performant
- **Font Awesome**: Icon library for UI elements

### Key Features
- **Mobile-First Design**: Optimized for mobile web applications with compact spacing
- **Responsive Design**: CSS Grid and Flexbox with mobile-specific optimizations
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Optimized CSS, minimal JavaScript, efficient DOM manipulation
- **Compact UI**: Tight spacing, smaller fonts, and optimized layouts for mobile devices

## API Endpoints

### Unified Application (`app.py`)
- `GET /` - EpH Calculator page with language support
- `GET /track` - 400m Track Calculator page with language support
- `POST /calculate` - Calculate EpH or estimated time
- `POST /track/calculate` - Calculate 400m time and splits from pace
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
    error: str = ""            # Error message (empty string for no error)
    
    class Config:
        extra = "forbid"
        validate_assignment = True
```

### 400m Track Calculator
```python
class PaceRequest(BaseModel):
    pace: str                   # Pace in min:sec format (e.g., "4:30")

class PaceResponse(BaseModel):
    total_time_min: str = ""    # Total time in M:SS format
    total_time_sec: int = 0     # Total time in seconds
    split_100m: int = 0         # Time for 100m in seconds
    split_200m: int = 0         # Time for 200m in seconds
    split_300m: int = 0         # Time for 300m in seconds
    split_400m: int = 0         # Time for 400m in seconds
    error: str = ""             # Error message (empty string for no error)
    
    class Config:
        extra = "forbid"
        validate_assignment = True
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
- **Mobile-First**: Optimized for mobile web applications with compact layouts
- **Consistency**: Same design language across both calculators
- **Accessibility**: High contrast, readable fonts, clear labels
- **Responsiveness**: Works on all device sizes with mobile optimization
- **Intuitive**: Clear input fields, logical flow, helpful tooltips
- **Compact**: Tight spacing, smaller fonts, optimized for mobile screens

### Recent UI Improvements
- **Compact Language Switcher**: Simplified labels (EN/繁) for mobile optimization
- **Tight Navigation**: Reduced padding and margins for space efficiency
- **Mobile-Optimized Results**: Compact result displays with inline labels
- **Horizontal Split Layout**: 400m split times displayed in one horizontal row
- **Reduced Font Sizes**: Smaller, more appropriate fonts for mobile devices
- **Optimized Spacing**: Tighter borders, reduced padding for mobile efficiency

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
- **CSS**: BEM methodology, CSS custom properties, responsive design, mobile-first approach
- **JavaScript**: ES6+, async/await, event delegation

### Pydantic Model Best Practices
- **Required Fields**: All fields are required with sensible defaults
- **Validation**: Strict validation with `extra = "forbid"`
- **Error Handling**: Comprehensive error handling for all edge cases
- **Type Safety**: Full type hints and validation

### Testing Strategy
- **Unit Tests**: Test calculation functions independently
- **Integration Tests**: Test API endpoints with various inputs
- **Frontend Tests**: Test form validation and UI interactions
- **Cross-browser Testing**: Ensure compatibility with major browsers
- **Mobile Testing**: Focus on mobile device compatibility

## Deployment

### Docker
- Multi-stage build for optimized production image
- Environment variable configuration
- Health check endpoints for monitoring

### Environment Variables
- `PORT`: Server port (default: 8080)
- `HOST`: Server host (default: 0.0.0.0)
- `DEBUG`: Debug mode (default: false)

## Recent Fixes and Improvements

### Navigation and Layout Fixes (December 2024)
- **Navigation Button Layout**: Fixed inconsistent button layout between calculator pages
  - EpH Calculator and 400m Track Calculator now have consistent horizontal button layout
  - Buttons stay on one line across all screen sizes (desktop and mobile)
  - Fixed CSS `display: block` to `display: inline-block` for mobile navigation
- **Language Persistence**: Fixed language switching issue when navigating between calculators
  - Navigation links now preserve language parameter (`?lang=en` or `?lang=zh`)
  - Users stay in their selected language when switching between calculator functions
  - Fixed hardcoded navigation URLs to include dynamic language parameter

### Pydantic Validation Fixes
- **EpHResponse Model**: Fixed missing field validation errors
- **PaceResponse Model**: Ensured all fields have proper defaults
- **Error Handling**: Improved error response consistency
- **Model Configuration**: Added strict validation and assignment checking

### UI/UX Improvements
- **Mobile Optimization**: Compact, space-efficient design for mobile web apps
- **Language Labels**: Simplified language switcher (EN/繁)
- **Result Display**: Compact result windows with inline formatting
- **Split Time Layout**: Horizontal layout for 400m split times
- **Responsive Design**: Enhanced mobile-specific CSS adjustments
- **Consistent Navigation**: Uniform button layout and behavior across all pages

### Code Quality
- **Unified Application**: Single FastAPI app with multiple endpoints
- **Error Handling**: Comprehensive error handling for all scenarios
- **Type Safety**: Full Pydantic validation and type checking
- **Performance**: Optimized CSS and JavaScript for mobile devices

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
- ✅ Multi-language support (EN/繁)
- ✅ Theme switching (Light/Dark)
- ✅ Calculation history functionality
- ✅ Responsive design implementation
- ✅ 400m Track Calculator backend and frontend
- ✅ Specialized 400m calculations with split times
- ✅ Mobile-first UI optimization
- ✅ Pydantic validation fixes
- ✅ Compact, space-efficient design
- ✅ Unified application architecture
- ✅ Navigation button layout consistency fix
- ✅ Language persistence across calculator navigation

### In Progress
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

*Last Updated: December 2024*
*Version: 1.1.1*
*Status: Production Ready with Navigation and Language Persistence Fixes*
