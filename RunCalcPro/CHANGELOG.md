# Changelog

## Version 1.1.0 (Current)

### Recent Updates

#### History Management
- ✅ History limit increased from 10 to **20 records** for both EpH and Track calculators
- ✅ History count display added: Shows current records in format **(X/20)** next to "Calculation History" title
- ✅ Optimized history rendering: Migrated from ScrollView to **FlatList** for better performance
- ✅ Fixed nested VirtualizedList warning by disabling FlatList scrolling (parent ScrollView handles scrolling)

#### UI Improvements
- ✅ **App name updated**: Changed to "RunCals Pro"
- ✅ **Default mode**: EpH Calculator now defaults to "Calculate EpH" mode when screen loads
- ✅ **Removed label**: "Calculation Mode:" label removed for cleaner UI
- ✅ Navigation buttons: All three buttons (EpH Calculator, 400m Track Calculator, Settings) aligned to the right
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

#### 400m Track Calculator
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

### Version 1.0.0
- Initial release
- EpH Calculator functionality
- 400m Track Calculator functionality
- Basic history storage (10 records)
- Language and theme support

