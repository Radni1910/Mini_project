# Designé - Room Decorator App

A React Native mobile application that allows users to design and decorate their rooms by placing furniture and decor items on room photos. The app features both free and VIP tiers with premium furniture collections.

## 🎨 Features

### Free Features
- **Room Decoration**: Upload or take a photo of your room and decorate it with furniture
- **Object Library**: Access thousands of furniture and decor items from Pixabay API
- **Drag & Drop**: Intuitively drag, resize, and rotate objects on your room
- **Save Designs**: Save your decorated room images to gallery
- **User Authentication**: Sign up and login with email or Google

### VIP Features
- **Premium Furniture Collection**: Access exclusive premium furniture and decor items
- **Advanced Customization**: More furniture categories (sofas, lamps, tables, plants, TV, bookshelves, beds, wardrobes, nightstands, kitchen, office, balcony)
- **Unlimited Designs**: Create unlimited room designs

### Admin Features
- **User Management**: Manage user VIP status
- **Feature Flags**: Toggle app features on/off
- **Audit Logs**: Track admin actions

### Quick guide 
**after choosing the photo click on crop to proceed to next page**

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📱 Building for Production

### Android APK

1. Install EAS CLI (if not already installed):
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Build APK:
```bash
eas build --platform android --profile preview
```

The APK will be available for download from the Expo dashboard once the build completes.

## 🏗️ Project Structure

```
mini-project/
├── src/
│   ├── components/          # Reusable components
│   │   ├── HeaderMenu.js
│   │   └── AdminFab.js
│   ├── config/              # Configuration files
│   │   └── vip.js           # VIP and admin configuration
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/             # App screens
│   │   ├── WelcomeScreen.js
│   │   ├── StartScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── FeaturesScreen.js
│   │   ├── RoomDecorator.js
│   │   ├── VIPRoomDecoratorScreen.js
│   │   ├── VIPPurchaseScreen.js
│   │   ├── FinalImageScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── AdminLoginScreen.js
│   │   └── AdminScreen.js
│   └── services/            # Services and utilities
│       └── firebase.js      # Firebase configuration
├── assets/                  # Images and static assets
├── App.js                   # Main app component
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
└── package.json             # Dependencies
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Update `src/services/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

### Pixabay API

The app uses Pixabay API for fetching furniture images. The API key is configured in `src/screens/RoomDecorator.js`. You can get your own API key from [Pixabay](https://pixabay.com/api/docs/).

### VIP Configuration

VIP emails and admin credentials are configured in `src/config/vip.js`:

```javascript
export const VIP_EMAILS = [
  "vip@example.com",
];

export const ADMIN_EMAILS = [
  "admin@example.com",
];
```
## 🧑‍💼 Admin & Test Accounts
**Admin Accounts**

- Professor Admin: vpg@gmail.com / 1234

- Student Admin: <student_admin_email>

Test User

Use this for regular testing of free vs VIP features:

Email:vip@gmail.com

Password:Vip1234

## Features implementation notes

- **Drag / Resize / Rotate**: Use PanResponder (or react-native-gesture-handler) + transform style (translate, scale, rotate).

- **Layering**: Store object z-index in state; allow bring-to-front / send-to-back actions.

- **Saving final image**: Use react-native-view-shot to capture the decorated view and expo-media-library to save to gallery.

- **Authentication**: Use Firebase Auth, and optionally expo-auth-session for Google provider flows.

- **Admin audit logs**: Write admin actions to a Firestore collection (with server-side timestamp and admin id).

- **Feature flags**: Use a Firestore doc to toggle flags; client reads the doc on startup and caches locally.

## 🎯 Usage

### For Users

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Upload Room**: Take a photo or choose from gallery
3. **Search Objects**: Search for furniture items (sofa, lamp, table, etc.)
4. **Place Objects**: Tap on the room to place selected objects
5. **Customize**: 
   - Drag objects to reposition
   - Use +/- buttons to resize
   - Use rotate button to rotate objects
   - Delete unwanted objects
6. **Save**: View final image or save to gallery

### For Admins

1. Login with admin credentials
2. Access admin panel to:
   - Manage user VIP status
   - Toggle feature flags
   - View audit logs

## 📦 Dependencies

### Core
- `expo`: ^54.0.23
- `react`: 19.1.0
- `react-native`: 0.81.5

### Navigation
- `@react-navigation/native`: ^7.1.19
- `@react-navigation/stack`: ^7.6.2
- `@react-navigation/drawer`: ^7.7.2

### Features
- `firebase`: ^12.5.0 - Authentication and database
- `expo-image-picker`: ~17.0.8 - Image selection
- `expo-media-library`: ~18.2.0 - Save to gallery
- `react-native-view-shot`: 4.0.3 - Capture room images
- `@react-native-async-storage/async-storage`: ^1.24.0 - Local storage

## 🔐 Permissions

The app requires the following permissions:
- **Camera**: To take room photos
- **Photo Library**: To select room images and save designs
- **Storage**: To save images to device gallery

## 🐛 Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear cache: `expo start -c`
- Check Node.js version compatibility

### Image Loading Issues
- Verify Pixabay API key is valid
- Check internet connection
- Ensure Firebase configuration is correct

### Authentication Issues
- Verify Firebase configuration
- Check if authentication methods are enabled in Firebase Console
- Ensure correct email/password format

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Radni Amonkar

## 🙏 Acknowledgments

- Pixabay for free image API
- Expo for the development platform
- Firebase for authentication and database services

