# 🧠 YUZONE QUIZ APP

A dual-screen quiz application with real-time Firebase sync, local storage backup, dual timers, and support for 8 teams. Perfect for hosting live quiz competitions!

---

## ✨ Features

✅ **6 Customizable Rounds** - Each with multiple questions  
✅ **Dual Timers** - 30-second Pass Timer & 15-second Answer Timer  
✅ **8 Team Support** - Editable team names and live scoring  
✅ **Live Scoreboard** - Real-time updates visible to all  
✅ **Admin Control Panel** - Full control over questions, timers, and scores  
✅ **Offline Support** - Works with localStorage when internet drops  
✅ **Firebase Sync** - Two-device real-time synchronization  
✅ **Dual Screen Mode** - Separate projector view and admin panel  
✅ **Keyboard Shortcuts** - Quick control for quiz master  

---

## 📁 Project Structure

```
/yuzone-quiz
│
├── index.html          → 📺 Projector view (for audience/screen)
├── admin.html          → 🎮 Admin control panel (for quiz master)
├── style.css           → 🎨 Dark theme styling
├── script.js           → 🧠 Core logic (timer, questions, storage)
├── admin.js            → 🎮 Admin-specific controls
├── firebase.js         → 🔥 Firebase configuration & sync
├── questions.json      → 📝 All quiz questions (6 rounds)
└── README.md           → 📖 This file
```

---

## 🚀 Quick Start

### 1️⃣ **Run Locally (No Setup Required)**

Simply open the files in your browser:

1. Open `admin.html` in one browser window (your control screen)
2. Open `index.html` in another window (projector/audience screen)
3. Start hosting! 🎉

**Note:** Without Firebase setup, it will run in **LOCAL MODE** only (single computer).

---

### 2️⃣ **Enable Firebase Sync (for 2-device sync)**

To sync between 2 computers (e.g., admin laptop + projector computer):

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `YUZONE Quiz`
3. Click **"Continue"** → Disable Google Analytics (optional) → **"Create Project"**

#### Step 2: Add Web App

1. In your Firebase project, click the **</>** (Web) icon
2. Register app name: `yuzone-quiz-app`
3. Click **"Register app"**
4. Copy the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "yuzone-quiz.firebaseapp.com",
  databaseURL: "https://yuzone-quiz-default-rtdb.firebaseio.com",
  projectId: "yuzone-quiz",
  storageBucket: "yuzone-quiz.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

#### Step 3: Enable Realtime Database

1. In Firebase Console, go to **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose location (closest to you)
4. **Start in test mode** (for now)
5. Click **"Enable"**

#### Step 4: Set Database Rules

1. Go to **"Rules"** tab in Realtime Database
2. Replace with this (allows read/write for testing):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **"Publish"**

⚠️ **Security Note:** These rules allow anyone to read/write. For production, [implement authentication](https://firebase.google.com/docs/database/security).

#### Step 5: Update firebase.js

1. Open `firebase.js` in VS Code
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

3. Save the file

#### Step 6: Test Sync

1. Open `admin.html` on **Computer 1** (your laptop)
2. Open `index.html` on **Computer 2** (projector computer)
3. Change a question in admin panel
4. Watch it update instantly on the projector! ✅

---

## 🎮 How to Use

### **Admin Panel** (`admin.html`)

**Navigation:**
- Select round and question from dropdowns
- Click "Load Question" or use "Next/Previous" buttons
- Questions appear instantly on projector view

**Timer Controls:**
- **Start Pass Timer (30s)** - For teams to discuss before passing
- **Start Answer Timer (15s)** - Quick answer time
- **Stop Timer** - Pause at any time
- **Reset Timer** - Back to default

**Score Management:**
- Edit team names by clicking on them
- Use +10, +5, +1 buttons for correct answers
- Use -10, -5, -1 buttons for wrong answers
- Reset individual team scores or all scores

**Keyboard Shortcuts:**
- `Ctrl + →` : Next Question
- `Ctrl + ←` : Previous Question
- `Ctrl + Space` : Start/Stop Pass Timer
- `Ctrl + Enter` : Start Answer Timer
- `Ctrl + R` : Reset Timer

---

### **Projector View** (`index.html`)

This view displays:
- Current round name
- Question text with options (A, B, C, D)
- Live timer (with color coding)
- Real-time scoreboard for all 8 teams

**Keyboard Shortcuts (on projector computer):**
- `Space` : Start/Stop Timer
- `→` : Next Question
- `←` : Previous Question

---

## 📝 Customizing Questions

Edit `questions.json` to add your own questions:

```json
{
  "rounds": [
    {
      "id": 1,
      "name": "Round 1: Your Topic",
      "questions": [
        {
          "id": 1,
          "question": "Your question here?",
          "options": [
            "A) Option 1",
            "B) Option 2", 
            "C) Option 3",
            "D) Option 4"
          ],
          "correctAnswer": "C"
        }
      ]
    }
  ]
}
```

**Tips:**
- Keep questions clear and concise
- Always use format: "A) Text", "B) Text", etc.
- `correctAnswer` should be just the letter: "A", "B", "C", or "D"
- You can have any number of questions per round

---

## 🛠️ Troubleshooting

### "Firebase not configured" message?
- You're in **LOCAL MODE** - app works fine on single computer
- To enable 2-device sync, follow Firebase setup steps above

### Questions not loading?
- Check browser console (F12) for errors
- Make sure `questions.json` is valid JSON (use a JSON validator)
- Ensure all files are in the same folder

### Timer not syncing between devices?
- Verify Firebase is configured correctly
- Check connection status in admin panel (should show green "Online")
- Ensure both devices are connected to internet

### Scores not updating?
- Check browser console for errors
- Try "Clear Cache & Reload" button in admin panel
- Verify Firebase database rules allow write access

---

## 🌐 Hosting Options

### Option 1: Run Locally
Just open HTML files in browser - no server needed!

### Option 2: Use Live Server (VS Code)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Access from any device on same network

### Option 3: Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 4: GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and save
4. Access via `https://yourusername.github.io/yuzone-quiz`

---

## 🎨 Customization

### Change Colors
Edit `style.css` variables:
```css
:root {
  --bg-primary: #0a0e27;
  --accent-blue: #64ffda;
  --accent-purple: #c792ea;
  /* etc... */
}
```

### Add More Teams
Edit `gameState.teams` array in `script.js`:
```javascript
teams: [
  { id: 9, name: "Team 9", score: 0 },
  { id: 10, name: "Team 10", score: 0 }
]
```

### Change Timer Durations
Edit timer start functions in `script.js`:
```javascript
gameState.timer.timeLeft = type === 'pass' ? 45 : 20; // Changed to 45s and 20s
```

---

## 📋 Quiz Hosting Checklist

**Before the Event:**
- [ ] Customize questions in `questions.json`
- [ ] Set up Firebase (if using 2 devices)
- [ ] Test admin panel and projector view
- [ ] Customize team names
- [ ] Test timers and scoring

**During the Event:**
- [ ] Open admin panel on your laptop
- [ ] Open projector view on presentation screen
- [ ] Verify both screens are synced
- [ ] Use keyboard shortcuts for speed
- [ ] Keep track of scores

**After the Event:**
- [ ] Export/save final scores (screenshot scoreboard)
- [ ] Reset scores for next quiz
- [ ] Update questions for next time

---

## 🤝 Support & Contribution

Found a bug? Have a feature request? Want to contribute?

1. Check existing issues
2. Create new issue with details
3. Submit pull request with improvements

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🎉 Credits

Built with ❤️ for YUZONE Quiz Competitions

**Technologies Used:**
- Pure JavaScript (no frameworks!)
- Firebase Realtime Database
- CSS3 with modern features
- HTML5

---

## 💡 Tips for Great Quiz Hosting

1. **Test everything** before your event
2. **Keep questions clear** and unambiguous
3. **Have backup questions** ready
4. **Pace yourself** - don't rush through questions
5. **Keep scores visible** - builds excitement
6. **Use timers strategically** - creates urgency
7. **Celebrate winners** - make it fun!

---

**Ready to host an amazing quiz? Let's go! 🚀🧠**
#   y u z o n e - q u i z  
 