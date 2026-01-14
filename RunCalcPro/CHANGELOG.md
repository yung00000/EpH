# Changelog

## Version 1.2.3 (Current)

### UI Improvements

#### EpH Calculator Enhancements
- ✅ **Updated Calculator Layout**: Improved visual hierarchy and consistency
  - Added "Calculate" title above mode selection buttons
  - Changed button labels: "Calculate EpH" → "EpH", "Calculate Estimated Time" → "Estimated Time"
  - Title formatting matches label styles (font size and weight)
  - Left-aligned "Calculate" title for better consistency

#### Events Management Enhancements
- ✅ **Enhanced Event Types**: Added new event categorization system
  - New Type field: Race, Training, Event (with Training as default)
  - Renamed previous Type field to Distance: 5KM, 10KM, Half Marathon, Marathon, Trail Run, Other
  - Custom distance input for Trail Run and Other types
  - Event notes field for Event type (optional text input)
  - Distance field optional when Type is "Event" and Distance is "Other"
- ✅ **Past Events Screen**: Separate page for historical events
  - Dedicated screen to view all past events
  - Accessible via "View Past" button on Events screen
  - Past events sorted by most recent first
  - Swipe-to-delete functionality maintained
- ✅ **Improved Date Display**: Enhanced date formatting
  - Dates now include day of week: "DD MMM YY (Day)" format
  - Example: "16 Jan 26 (Thu)", "8 Apr 26 (Wed)"
  - Applied to both upcoming and past events

### Technical Improvements
- ✅ Updated navigation stack to include PastEvents screen
- ✅ Enhanced event filtering logic (upcoming vs past events)
- ✅ Improved form validation for conditional fields
- ✅ Auto-refresh events when returning from Past Events screen

---

## Version 1.2.1

### New Features

#### Race Events Management
- ✅ **Race Events Tracker**: New dedicated screen to manage your upcoming races
  - Access via "More" menu → "Upcoming Events"
  - Add race events with event name, date, type, and optional distance
  - Calendar date picker for easy date selection
  - Event type selector: 5KM, 10KM, Half Marathon, Marathon, Trail Run, Other
  - Distance field (required for Trail Run and Other types)
- ✅ **Upcoming Event Card**: Displays next upcoming race with countdown
  - Shows days until the event
  - Displays formatted event date (dd MMM yy)
  - Shows event type
  - Automatically updates based on current date
- ✅ **Event Management**:
  - **Swipe-to-delete**: Swipe left on any event to delete (consistent with history management)
  - All events stored locally with AsyncStorage
  - Events list sorted by date (nearest first)
  - Visual countdown for upcoming events
- ✅ **Running Tips & Articles**: Enhanced content section in "More" menu
  - Fetch articles from API with date filtering
  - Article caching for offline access
  - Pull-to-refresh functionality
  - Date filter dropdown (Today, specific dates)

#### UI Improvements
- ✅ **Navigation Updates**: Tighter button spacing in top navigation bar
- ✅ **More Menu**: Redesigned popup with dropdown-style positioning (top-left corner)
- ✅ **Modal Pickers**: Improved type picker with better scrolling and visibility

### Technical Improvements
- ✅ React Navigation stack implementation for Events screen
- ✅ Date manipulation utilities (countdown, formatting, UTC handling)
- ✅ Enhanced AsyncStorage management for events
- ✅ Gesture handler integration for swipe-to-delete
- ✅ Date picker integration (@react-native-community/datetimepicker)

---

## Version 1.2.0

### Major Updates

#### Pacing Calculator Enhancements
- ✅ **Renamed**: "400m Track Calculator" → **"Pacing Calculator"**
- ✅ **New Mode: Time to Pace**: Calculate pace from completed time
  - Select distance: 10km, Half Marathon, or Marathon
  - Enter completed time (hh:mm:ss or hh:mm format)
  - Get calculated pace per kilometer
- ✅ **Dual Calculation Modes**: 
  - **Pace to Time**: Enter pace → Get times (existing functionality)
  - **Time to Pace**: Enter time → Get pace (new functionality)
- ✅ **Mode Selector**: Clean toggle between two modes
- ✅ **History for Time to Pace**: All calculations saved to history
- ✅ **Color-coded History Badges**:
  - 🔵 Blue badge for "Time to Pace" calculations
  - 🟢 Green badge for "Pace to Time" calculations
- ✅ **Enhanced History Display**: Shows "From [Distance]: [Time]" for Time to Pace items

#### Settings Menu Updates
- ✅ **Check for Updates**: OTA update button added
  - Check for available updates
  - Download and apply updates
  - Restart prompt after update download

### Previous Updates (Version 1.1.0)

#### History Management
- ✅ History limit increased from 10 to **20 records** for both EpH and Pacing calculators
- ✅ History count display added: Shows current records in format **(X/20)** next to "Calculation History" title
- ✅ Optimized history rendering: Migrated from ScrollView to **FlatList** for better performance
- ✅ Fixed nested VirtualizedList warning by disabling FlatList scrolling (parent ScrollView handles scrolling)

#### UI Improvements
- ✅ **App name updated**: Changed to "RunCals Pro"
- ✅ **Default mode**: EpH Calculator now defaults to "Calculate EpH" mode when screen loads
- ✅ **Removed label**: "Calculation Mode:" label removed for cleaner UI
- ✅ Navigation buttons: All three buttons (EpH Calculator, Pacing Calculator, Settings) aligned to the right
- ✅ Removed large title sections from calculator screens for cleaner interface

#### Technical Improvements
- ✅ FlatList implementation prevents nested scrolling conflicts
- ✅ Better performance with virtualization for history lists
- ✅ Proper key extraction for FlatList items

### Previous Features

#### EpH Calculator
- ✅ Calculate EpH from distance, elevation, and time
- ✅ Calculate estimated completion time from EpH
- ✅ Bilingual support (English/Traditional Chinese)
- ✅ Dark/Light/Automatic theme support
- ✅ Calculation history with swipe-to-delete
- ✅ Input validation and error handling

#### Pacing Calculator (formerly 400m Track Calculator)
- ✅ Calculate 400m time and splits from pace
- ✅ Display split times for 100m, 200m, 300m, 400m
- ✅ Calculate 10km, Half Marathon, and Marathon times
- ✅ Bilingual support (English/Traditional Chinese)
- ✅ Dark/Light/Automatic theme support
- ✅ Calculation history with swipe-to-delete
- ✅ Input validation and error handling

#### Settings Menu
- ✅ Language switching (中/Eng style toggle)
- ✅ Dark/Light mode toggle
- ✅ App version information
- ✅ Contact Us (copy email to clipboard: admin@runcals.com)

#### Additional Features
- ✅ Over-The-Air (OTA) updates via Expo Updates
- ✅ Persistent local storage (AsyncStorage)
- ✅ Native navigation with React Navigation
- ✅ Gesture support (swipe-to-delete)
- ✅ Responsive design for all screen sizes

---

## Version History

### Version 1.1.0
- History limit increased to 20 records
- FlatList implementation for history
- App name updated to "RunCals Pro"
- UI improvements and optimizations

### Version 1.0.0
- Initial release
- EpH Calculator functionality
- Pacing Calculator functionality (formerly 400m Track Calculator)
- Basic history storage (10 records)
- Language and theme support

