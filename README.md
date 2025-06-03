# PickPark

## A cross platform parking application created with React Native and Expo.

### Dylan Verallo, Jesse Wattenhofer, Nicholas Schwamborn, James Abuan

### DEV 272 Spring Quarter

### Prof. Zak Brinlee

## App Description

PickPark leverages React Native, Google Maps API, and Supabase to provide users with a seamless way to discover and review parking locations. With an interactive map powered by Google Maps, users can effortlessly search for available parking spots. A dynamic list synchronizes with map markers, offering an intuitive browsing experience. Additionally, users can leave reviews for parking locations and save their favorite spots for easy access later.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app installed on your iOS or Android device
- [Git](https://git-scm.com/) for cloning the repository

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/PickPark.git
   cd PickPark
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables and API keys:**

   - Copy the example environment file:
     ```sh
     cp .env.example .env
     ```
   - Open `.env` in a text editor and fill in your API keys (e.g., for Google Maps, Supabase, etc.) as instructed in the comments.

4. **Start the Expo development server:**

   ```sh
   npx expo start
   ```

   This will open the Expo Dev Tools in your browser.

5. **Run the app on your device:**

   - Open the Expo Go app on your phone.
   - Scan the QR code displayed in the Expo Dev Tools or terminal.
   - The app will load on your device.

6. **(Optional) Run on an emulator:**
   - For iOS: Press `i` in the terminal to open in an iOS simulator (Mac only).
   - For Android: Press `a` to open in an Android emulator.

---

**Note:**  
If you do not have the required API keys, request them from the project maintainer or follow the instructions in `.env.example` to obtain your own.

---
