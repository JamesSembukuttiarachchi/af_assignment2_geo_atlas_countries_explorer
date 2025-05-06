# Geo Atlas - Countries Explorer

Geo Atlas is a React-based web application that allows users to explore country details, manage their favorite countries, and perform user authentication. The project is built using Vite for fast development and Firebase for backend services.

## Features

- **Country Search and Details**: Search for countries and view detailed information.
- **Favorites Management**: Add and remove countries from your favorites list.
- **User Authentication**: Register, log in, and manage user sessions using Firebase Authentication.
- **Responsive Design**: Fully responsive UI for seamless usage across devices.
- **Dark Mode Support**: Toggle between light and dark themes.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Routing**: React Router
- **State Management**: Context API
- **Icons**: Lucide React

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JamesSembukuttiarachchi/af_assignment2_geo_atlas_countries_explorer.git
   

2. Install dependencies:
   
   npm install

3. Set up Firebase:

    Create a Firebase project in the Firebase Console.
    Add a web app to your Firebase project and copy the Firebase configuration.
    Replace the Firebase configuration in src/firebase/config.js with your own.

4. Start the development server:
   
   npm run dev

5. Open the app in your browser:

        http://localhost:5173


## Firebase Setup

1. Firestore Rules: Ensure your Firestore rules allow authenticated users to manage their favorites:
   ```bash
   rules_version = '2';
    service cloud.firestore {
    match /databases/{database}/documents {
        match /favorites/{document} {
        allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
        }
    }
    }

2. Authentication: Enable Email/Password authentication in the Firebase Console.


## Scripts

   - npm run dev: Start the development server.
   - npm run build: Build the project for production.
   - npm run preview: Preview the production build locally.
