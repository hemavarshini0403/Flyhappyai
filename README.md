# FlyHappy

FlyHappy is a final year B.Tech AI and Data Science project focused on airline grievance redressal. The application helps passengers register complaints, track complaint progress, use an AI chatbot for guidance, and provides an admin dashboard for complaint review.

## Features

- Passenger complaint registration
- OCR-based ticket and boarding pass extraction
- Complaint categorization and priority prediction
- Complaint tracking by complaint ID
- AI chatbot support
- Admin login and dashboard
- Analytics and visual reports

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Sonner

## Project Structure

- [index.html](./index.html)
- [package.json](./package.json)
- [src/main.tsx](./src/main.tsx)
- [src/app/App.tsx](./src/app/App.tsx)
- [src/app/Root.tsx](./src/app/Root.tsx)
- [src/app/pages/Home.tsx](./src/app/pages/Home.tsx)
- [src/app/pages/RegisterComplaint.tsx](./src/app/pages/RegisterComplaint.tsx)
- [src/app/pages/TrackComplaint.tsx](./src/app/pages/TrackComplaint.tsx)
- [src/app/pages/Chatbot.tsx](./src/app/pages/Chatbot.tsx)
- [src/app/pages/AdminLogin.tsx](./src/app/pages/AdminLogin.tsx)
- [src/app/pages/AdminDashboard.tsx](./src/app/pages/AdminDashboard.tsx)

## Run

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

## Demo Admin Credentials

- Username: `admin`
- Password: `admin123`

## Google OAuth Setup

To enable Google sign-in for users:

1. Copy `.env.example` to `.env`
2. Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth Web Client ID
3. Restart the Vite dev server

Example:

```powershell
copy .env.example .env
```

## Notes

- Complaint data is currently stored using browser local storage in the imported project logic.
- OCR and AI features are simulated for project/demo use.
- You can customize the student, college, and guide details in the documentation files under [docs](./docs).
