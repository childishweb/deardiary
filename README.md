# Dear Diary - Beautiful Photo Diary App

A gorgeous, feature-rich diary app for iOS with photos, music, and stickers to make your journaling experience delightful!

## Features

- **Beautiful UI** - Gorgeous gradient designs and smooth animations
- **Photo Integration** - Add photos from your gallery or take new ones with the camera
- **Sticker Decorations** - Decorate your entries with cute emoji stickers (hearts, stars, flowers, animals, food, and nature)
- **Background Music** - Relax with ambient music while journaling
- **Mood Tracking** - Track how you're feeling with each entry (happy, sad, excited, calm, anxious, loved)
- **Search & Filter** - Easily find entries by searching through titles and content
- **Local Storage** - All your entries are stored securely on your device
- **Entry Management** - Create, edit, view, and delete diary entries

## How to Trial the App on iOS

### Prerequisites

1. **iPhone or iPad** running iOS 13.0 or later
2. **Expo Go App** - Download from the App Store:
   - Open the App Store on your iPhone/iPad
   - Search for "Expo Go"
   - Install the app (it's free!)

### Quick Start (Easiest Method)

1. **Install Expo Go** on your iOS device from the App Store
2. **Start the development server** on your computer:
   ```bash
   npm start
   ```
3. **Scan the QR code** that appears in your terminal using your iPhone's Camera app
4. The app will automatically open in Expo Go!

### Alternative Method: Connect via URL

If QR code scanning doesn't work:

1. Start the dev server: `npm start`
2. Press `s` in the terminal to switch to "connection via URL"
3. On your iOS device, open **Expo Go**
4. Tap **"Enter URL manually"**
5. Enter the URL shown in your terminal (e.g., `exp://192.168.x.x:8081`)

### Detailed Setup Instructions

#### On Your Computer:

1. **Clone/Download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   ```

4. A QR code will appear in your terminal and a browser window will open with the Expo Developer Tools

#### On Your iPhone/iPad:

1. **Download Expo Go** from the App Store (if you haven't already)

2. **Make sure your phone is on the same WiFi network** as your computer

3. **Scan the QR code:**
   - Open the default **Camera** app on your iPhone
   - Point it at the QR code in your terminal/browser
   - Tap the notification that appears
   - The app will open in Expo Go!

## Using the App

### Creating Your First Entry

1. Tap the **pink "+" button** in the bottom right corner
2. Select your **mood** (optional)
3. Add a **title** for your entry
4. Write your **thoughts** in the content area
5. Tap the **image icon** to add photos from your gallery
6. Tap the **camera icon** to take a new photo
7. Tap the **sticker icon** to add decorative stickers
8. Tap the **checkmark** in the top right to save

### Playing Music

- Tap the **play button** on the music player at the top of the home screen
- Use the **skip button** to change tracks
- Enjoy peaceful background music while journaling!

### Viewing Entries

- Tap any **entry card** on the home screen to view it in detail
- See all your photos, stickers, and full text
- Edit or delete entries from the detail view

### Searching

- Use the **search bar** at the top of the home screen
- Search through all your entry titles and content

## Permissions

The app will request the following permissions:

- **Camera** - To take photos for your diary entries
- **Photo Library** - To add existing photos to your entries
- **Audio** - For background music playback

All data is stored **locally on your device** - nothing is sent to the cloud!

## Troubleshooting

### QR Code won't scan
- Make sure your phone and computer are on the **same WiFi network**
- Try using the **manual URL entry method** instead
- Restart the dev server with `npm start`

### App crashes or shows errors
- Make sure you've run `npm install` to install all dependencies
- Try clearing the Expo cache: `npm start -c`
- Restart Expo Go on your device

### Photos not working
- Make sure you've granted **camera and photo library permissions**
- Check in iOS Settings > Expo Go > Photos

### Music not playing
- Ensure your device isn't in silent mode
- Check iOS Settings > Expo Go > allow audio

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for smooth navigation
- **Expo Image Picker** for camera/gallery access
- **Expo AV** for audio playback
- **AsyncStorage** for local data persistence
- **Linear Gradient** for beautiful UI effects

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with cache cleared
npm start -c

# Run on iOS simulator (requires macOS)
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
deardiary/
├── src/
│   ├── components/       # Reusable components (MusicPlayer, StickerPicker)
│   ├── screens/          # App screens (Home, EntryEditor, EntryDetail)
│   ├── navigation/       # Navigation configuration
│   ├── constants/        # Theme, colors, stickers
│   ├── utils/           # Storage utilities
│   └── types/           # TypeScript type definitions
├── App.js               # App entry point
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## Contributing

This is a personal diary app, but feel free to fork and customize it for your own use!

## License

MIT License - Feel free to use this app as you wish!

---

Made with love for beautiful journaling experiences.
