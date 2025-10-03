# Personal Dashboard - Time, Date, and Weather

[![Deploy to GitHub Pages](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions/workflows/deploy-gh-pages.yml/badge.svg?branch=main)](https://github.com/diegoiprg/dilware-myself-frontend-web-fecha-hora-clima/actions/workflows/deploy-gh-pages.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Version](https://img.shields.io/badge/version-v1.3.7-blue.svg)](./package.json)

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

## License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for details.
