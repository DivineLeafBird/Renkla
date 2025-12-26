![Banner](https://res.cloudinary.com/ddxwlcw9y/image/upload/v1766730767/Banner-Renkla_rdadil.png)
# Renkla - Apparel Store Mobile App
![GitHub language count](https://img.shields.io/github/languages/count/divineleafbird/renkla) ![Language Used](https://img.shields.io/github/languages/top/divineleafbird/renkla) ![GitHub repo size](https://img.shields.io/github/repo-size/divineleafbird/renkla) ![Contributors](https://img.shields.io/github/contributors/divineleafbird/renkla?style=flat&logo=github&logoColor=white)

<p>An intuitive cross-platform mobile application for online apparel shopping. Users can explore the latest fashion collections, 
  view detailed product information, add items to their cart, and complete purchases securely. The app focuses on simplicity, 
  responsiveness, and a user-friendly shopping experience on both Android and iOS. </p>
## Key Features

- Browse and search apparel products  
- Add products to cart and manage quantities  
- User authentication with Firebase  
- Persistent backend with Firestore database  
- Cloud storage for product images  
- Beautiful UI with Tailwind + NativeWind  
- Supports **Android** and **iOS** devices

## Tech Stack
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_NativeWind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Ionicons](https://img.shields.io/badge/Ionicons-1769FF?style=flat&logo=ionic&logoColor=white)

## Platforms
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=flat&logo=ios&logoColor=white)

## Prerequisites

Before running the app, make sure you have the following installed:

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) 
![npm](https://img.shields.io/badge/npm-CC3534?style=flat&logo=npm&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)
![Expo CLI](https://img.shields.io/badge/Expo_CLI-000020?style=flat&logo=expo&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)

## Development Setup

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/divineleafbird/renkla.git
cd renkla
```
### 2. Install dependencies
```bash
npm install

# or

yarn install
```
### 3. Install Expo CLI (if not already installed)
```bash
npm install -g expo-cli
```
### 4. Start the development server
```bash
npx expo start
```
### 5. Run on your device or simulator
- **Android:** Press ```a``` in the terminal to open Android emulator
- **iOS:** Press ```i``` in the terminal to open iOS simulator
- **Physical device:** Scan the QR code from the Expo DevTools
> Make sure you have an **Android emulator, iOS simulator**, or a **physical device** connected for testing.
### 6. Configure Firebase
- Add your Firebase configuration in ```firebaseConfig.js``` (or the appropriate config file)
- Make sure Authentication, Firestore, and Storage rules are properly set
## Screenshots
![Screens](https://res.cloudinary.com/ddxwlcw9y/image/upload/v1766738467/Renkla_Screens_kfbre7.png)

## Notes
- Use **React Native + Expo** best practices
- Keep **Tailwind/NativeWind classes organised**
- Add **environment variables** for Firebase safely in ```.env``` (do not commit ```.env```)

