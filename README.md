# PickPark

## A cross-platform parking application created with React Native and Expo.

### Dylan Verallo, Jesse Wattenhofer, Nicholas Schwamborn, James Abuan

### DEV 272 Spring Quarter

### Prof. Zak Brinlee

## App Description

PickPark leverages React Native, Google Maps API, and Supabase to provide users with a seamless way to discover and review parking locations. With an interactive map powered by Google Maps, users can effortlessly search for available parking spots. A dynamic list synchronizes with map markers, offering an intuitive browsing experience. Additionally, users can leave reviews for parking locations and save their favorite spots for easy access later.

## Powerpoint

- [PickPark PowerPoint](https://bellevuec-my.sharepoint.com/:p:/r/personal/jesse_wattenhofer_bellevuecollege_edu/_layouts/15/doc2.aspx?sourcedoc=%7B61BB6427-7AF7-4355-8178-8CA6F17CBD67%7D&file=DEV272_final_presentation.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1&wdOrigin=MARKETING.POWERPOINT.SIGNIN%2CAPPHOME-WEB.JUMPBACKIN&wdPreviousSession=1f933337-0756-4fa0-ac06-78b1cec48fdb&wdPreviousSessionSrc=AppHomeWeb&ct=1750824258651)

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app installed on your iOS or Android device
- [Git](https://git-scm.com/) for cloning the repository

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Kurenai-Misuzu/PickPark
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

## Testing Instructions

### Prerequisites

- .env with required API keys is included in the project.

### Steps

1. **Create an account:**

   ```sh
   Navigate through the login and registration page to create an account.
   Must use a valid email address.
   ```

2. **Test map fetching:**

   ```sh
   Use the map's region scrolling and search bar to find local and broad locations for parking.
   Clicking on a marker or card will show the location's information.
   ```

3. **Test favorite location feature:**

   ```sh
   Click on the heart next to any location card on the bottom sheet, and it should update the icon and
   show on the favorites page.
   Clicking on a card on the favorites page will take you to the map page and focus on the marker.
   ```

4. **App settings:**

   ```sh
   Customize your account or change the app's theme through the settings page.
   ```

5. **Test adding a review:**

   ```sh
   Click on a location card or marker and pull the tab up. Click on `add review` to update the location's
   reviews based on pricing, pricing type, and operating hours.
   ```

6. **View all reviews:**

   ```sh
   On the location's info card, click on the reviews box to show all the reviews for the location.
   ```

   ---

### List of core features

- Embedded map to fetch nearby parking locations based on search or scroll.
- Local storage of favorite cards for offline info.
- Up-to-date information for locations based on user reviews.
- Validated user authentication

### Role-based team contributions

- Jesse: Developed login and registration page with Supabase integration and error handling, created an authentication context to ensure only authenticated users can access the app, and created the retrospectives each week.
- Nick: Built the main search page with a location favorite feature, customized the app's UI with complete app dark mode.
- Dylan: Designed the Supabase database tables and hook creation for easy data access, and developed the review page and functionality.
- James: Implemented component testing with Jest and assisted with backend integrity and configuration.

### Known bugs or limitations

- Clicking on a favorite card when the map doesn't already have the marker rendered in will focus on the location, but not immediately render the marker or show its information. On a re-render, it will show.
