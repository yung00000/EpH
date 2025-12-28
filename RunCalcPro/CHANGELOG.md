# Changelog

## Version 1.2.0 (Current)

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

