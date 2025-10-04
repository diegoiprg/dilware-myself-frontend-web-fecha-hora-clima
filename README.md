# Personal Dashboard - Time, Date, and Weather

[![Deploy to GitHub Pages](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions/workflows/deploy-gh-pages.yml/badge.svg?branch=main)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions/workflows/deploy-gh-pages.yml)
[![Build Status](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions/workflows/deploy-gh-pages.yml/badge.svg)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-v1.6.8-blue.svg)](./package.json)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC)](https://tailwindcss.com/)
[![GitHub stars](https://img.shields.io/github/stars/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima?style=social)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)
[![GitHub forks](https://img.shields.io/github/forks/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima?style=social)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)
[![GitHub last commit](https://img.shields.io/github/last-commit/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)
[![GitHub issues](https://img.shields.io/github/issues/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/pulls)

A minimalist, full-screen web application that provides a quick and elegant view of the current time, date, user's location, and local weather. It is designed to be used as a browser start page, a personal dashboard, or a display for a wall-mounted screen.

[**Live Demo**](https://diegoiprg.github.io/dilware-myself-frontend-web-fecha-hora-clima/)

## Key Features

- **Real-time Clock**: Displays the current time with a customizable 12/24-hour format and an option to show/hide seconds.
- **Date Display**: Shows the current day of the week, month, and day.
- **Geolocation**: Automatically detects and displays the user's city and country.
- **Live Weather**: Provides real-time weather information, including temperature and a descriptive icon for the current conditions.
- **Fullscreen Mode**: Click on the time to enter an immersive, distraction-free fullscreen view.
- **Screen Wake Lock**: The application keeps the screen on, making it ideal for continuous display.
- **Customizable Settings**: A settings panel allows users to toggle features like the clock format and seconds display.
- **Responsive Design**: The layout adapts gracefully to different screen sizes, from mobile devices to large desktop monitors.

## Screenshots

![Personal Dashboard Screenshot](https://via.placeholder.com/800x600/000000/FFFFFF?text=Personal+Dashboard+Screenshot)

_Note: Add actual screenshots of the application in light and dark modes, and different screen sizes._

## Technologies Used

This project is built with a modern web stack:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI/Backend**: [Google's Genkit](https://firebase.google.com/docs/genkit) for potential backend and AI-powered features.
- **Deployment**: [GitHub Pages](https://pages.github.com/) via [GitHub Actions](https://github.com/features/actions).

## Getting Started

To run the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima.git
    cd dilware-myself-frontend-web-fecha-hora-clima
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Configuration

The application includes a settings panel (accessible via the gear icon in the top-right corner) where users can customize:

- **Temperature Unit**: Choose between Celsius (°C) or Fahrenheit (°F)
- **Time Format**: Select 12-hour or 24-hour clock format
- **Seconds Display**: Toggle visibility of seconds in the clock
- **Refresh Interval**: Set how often weather and location data should be updated (5-30 minutes or never)

Settings are automatically saved to your browser's local storage.

### Environment Variables

Create a `.env.local` file in the project root for custom API endpoints:

```env
NEXT_PUBLIC_WEATHER_API_BASE=https://api.open-meteo.com/v1/forecast
```

## Data Sources

- **Weather Data**: [Open-Meteo API](https://open-meteo.com/) - Free weather API providing current conditions and forecasts
- **Geolocation**: Browser Geolocation API with fallback to IP-based location via [IP-API](https://ipapi.co/)
- **Reverse Geocoding**: [BigDataCloud API](https://www.bigdatacloud.com/) for converting coordinates to human-readable addresses

## Browser Compatibility

- Modern browsers with ES6+ support
- Geolocation API support recommended for accurate location detection
- Fullscreen API support for immersive mode
- Wake Lock API support for keeping screen active (optional)

## Troubleshooting

### Weather data not loading

- Check your internet connection
- Ensure location permissions are granted in your browser
- Try refreshing the page

### Location detection issues

- Grant location permissions when prompted
- The app will fall back to IP-based location if geolocation fails

### Screen not staying awake

- Wake Lock API may not be supported in your browser
- Consider using a different browser or device

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Changelog

### v1.6.9

- Fixed weather display layout: weather description, weather icon, and temperature now have consistent sizing and proper order (description - icon - temperature)
- Improved source code documentation with comprehensive JSDoc comments across all components, hooks, and utilities
- Enhanced README with additional sections for better project documentation

### v1.6.8

- Rearranged weather display: weather description on left, temperature in center, weather icon on right in top row
- Removed thermometer icon from temperature display
- Reorganized bottom row: min temp, max temp, humidity, UV index with uniform icon and text sizing

### v1.6.7

- Made MIN/MAX icons smaller and temperature values larger for better visual hierarchy
- Standardized weather icon size in bottom row to match humidity/UV icons
- Ensured weather description text size matches other bottom row values
- Added circular background to location icon for consistency

### v1.6.6

- Replaced MAX/MIN text with ArrowUp/ArrowDown icons in temperature display
- Increased font size for temperature indicators
- Moved weather condition description to bottom row next to UV index
- Ensured consistent text sizing across all bottom row weather items

### v1.6.5

- Rearranged temperature display with MAX/MIN indicators positioned to the right of current temperature
- Added weather condition description below temperature row with descriptive text
- Removed HUM/IUV labels from bottom row, showing only values
- Used thermometer icon for temperature display

### v1.6.4

- Added min/max temperatures as subscript/superscript next to current temperature in weather display
- Ensured location icon has circular background consistent with other icons

### v1.6.3

- Made all icons circular with consistent backgrounds (date, settings, location)
- Removed colored backgrounds from weather indicator text badges, keeping only icons circular
- Cleaned up weather display layout

### v1.6.2

- Updated weather cell background to iOS 26 widget style with translucency
- Made all weather indicator icons circular with backgrounds
- Removed "|" separators from weather display

### v1.6.1

- Implemented iOS 26 widget background for weather section
- Added circular backgrounds to weather icons

### v1.6.0

- Adopted Apple iOS 26 design guidelines for fonts, colors, and icons
- Updated color palette to match Apple's design system
- Changed fonts to system fonts (-apple-system, BlinkMacSystemFont)
- Enhanced icon styling with circular backgrounds

### v1.5.0

- Added Google Analytics tracking
- Implemented environment variables for API endpoints
- Enhanced TypeScript types and interfaces
- Added Framer Motion for animations
- Improved loading states with skeleton loaders
- Fine-tuned responsive breakpoints
- Added memoization to components
- Created robust API client with retry logic
- Added HTTPS enforcement

### v1.4.9

- Removed weather data caching to ensure fresh data
- Added Google Analytics integration

### v1.4.8

- Increased clock text sizes for better visibility on tablets
- Reduced padding for better content fit on iOS devices

### v1.4.7

- Hide weather cell completely when data doesn't load
- Make location cell expand to 100% width in landscape when weather is hidden
- Enhanced clock prominence with larger text sizes

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- UI components built with [shadcn/ui](https://ui.shadcn.com/)
- Weather data courtesy of [Open-Meteo](https://open-meteo.com/)
- Font inspiration from Apple's design system

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for details.
