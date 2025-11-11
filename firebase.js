// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
// 📖 SETUP INSTRUCTIONS:
// 1. Go to: https://console.firebase.google.com/
// 2. Create a new project or select existing
// 3. Enable "Realtime Database" (Start in test mode)
// 4. Get your config from Project Settings → Your Apps → Web App
// 5. Replace the config below with your actual Firebase config
// 6. Save and refresh - you'll see "✅ Firebase initialized successfully!"
//
// ⚠️ If you don't set this up, the app still works perfectly with localStorage!
// See FIREBASE_SETUP.md for detailed step-by-step guide

const firebaseConfig = {
  apiKey: "AIzaSyBIfJxTZS4_CAnGMP_F2WRcRYq2It-kRBU",
  authDomain: "yuzone-quiz-app.firebaseapp.com",
  databaseURL: "https://yuzone-quiz-app-default-rtdb.firebaseio.com",
  projectId: "yuzone-quiz-app",
  storageBucket: "yuzone-quiz-app.firebasestorage.app",
  messagingSenderId: "845754445251",
  appId: "1:845754445251:web:4477e2c3ef03a49aafe176"
};

// Initialize Firebase
let database = null;
let isFirebaseEnabled = false;

function initFirebase() {
  try {
    // Check if Firebase config is set up
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
      console.warn("⚠️ Firebase not configured. Running in LOCAL MODE only.");
      console.warn("👉 Edit firebase.js and add your Firebase config to enable sync.");
      return false;
    }

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    isFirebaseEnabled = true;
    console.log("✅ Firebase initialized successfully!");
    return true;
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    console.warn("⚠️ Falling back to LOCAL MODE only.");
    return false;
  }
}

// ============================================
// 🔄 OPTIMIZED SYNC FUNCTIONS
// ============================================

let syncQueue = [];
let isSyncing = false;
let lastSyncTime = 0;
const SYNC_THROTTLE = 50; // Sync every 50ms max

// Optimized sync with throttling
function syncToFirebase(data) {
  if (!isFirebaseEnabled || !database) {
    return;
  }

  // Add to queue
  syncQueue.push(data);
  
  // Process queue with throttling
  processSyncQueue();
}

function processSyncQueue() {
  if (isSyncing || syncQueue.length === 0) return;
  
  const now = Date.now();
  if (now - lastSyncTime < SYNC_THROTTLE) {
    setTimeout(processSyncQueue, SYNC_THROTTLE);
    return;
  }
  
  isSyncing = true;
  const dataToSync = syncQueue[syncQueue.length - 1]; // Get latest
  syncQueue = []; // Clear queue
  
  try {
    database.ref('quizState').set(dataToSync).then(() => {
      isSyncing = false;
      lastSyncTime = Date.now();
      if (syncQueue.length > 0) {
        processSyncQueue();
      }
    }).catch(error => {
      console.error("Error syncing to Firebase:", error);
      isSyncing = false;
    });
  } catch (error) {
    console.error("Error syncing to Firebase:", error);
    isSyncing = false;
  }
}

// Listen for Firebase updates with immediate callback
function listenToFirebase(callback) {
  if (!isFirebaseEnabled || !database) {
    return;
  }

  try {
    database.ref('quizState').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Immediate update without delay
        requestAnimationFrame(() => callback(data));
      }
    }, (error) => {
      console.error("Error listening to Firebase:", error);
    });
  } catch (error) {
    console.error("Error listening to Firebase:", error);
  }
}

// Quick sync for specific paths (faster updates)
function quickSync(path, data) {
  if (!isFirebaseEnabled || !database) {
    return;
  }

  try {
    database.ref(`quizState/${path}`).set(data);
  } catch (error) {
    console.error(`Error quick syncing ${path}:`, error);
  }
}

// Sync team scores only (lighter updates)
function syncScores(teams) {
  quickSync('teams', teams);
}

// Sync current question
function syncCurrentQuestion(roundId, questionId) {
  quickSync('current', {
    roundId: roundId,
    questionId: questionId,
    timestamp: Date.now()
  });
}

// Sync timer state with server timestamp
function syncTimer(timerData) {
  quickSync('timer', {
    ...timerData,
    serverTime: Date.now()
  });
}

// Sync UI state (options visibility, answer revealed)
function syncUIState(optionsVisible, answerRevealed) {
  if (!isFirebaseEnabled || !database) {
    return;
  }

  try {
    if (typeof showSyncIndicator === 'function') {
      showSyncIndicator();
    }
    database.ref('quizState').update({
      optionsVisible: optionsVisible,
      answerRevealed: answerRevealed,
      ui: {
        optionsVisible: optionsVisible,
        answerRevealed: answerRevealed,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error syncing UI state:', error);
  }
}

// Initialize Firebase on load
initFirebase();
