// ============================================
// 🧠 YUZONE QUIZ - CORE LOGIC
// ============================================

// Global State
let quizData = null;
let backupQuestions = null;
let gameState = {
  currentRound: 1,
  currentQuestion: 1,
  optionsVisible: false,
  answerRevealed: false,
  isBackupQuestion: false,
  backupQuestionId: null,
  quizTitle: "🧠 YUZONE QUIZ 🧠",
  showInstructions: true,
  teams: [
    { id: 1, name: "Team 1", score: 0 },
    { id: 2, name: "Team 2", score: 0 },
    { id: 3, name: "Team 3", score: 0 },
    { id: 4, name: "Team 4", score: 0 },
    { id: 5, name: "Team 5", score: 0 },
    { id: 6, name: "Team 6", score: 0 },
    { id: 7, name: "Team 7", score: 0 },
    { id: 8, name: "Team 8", score: 0 }
  ],
  timer: {
    isRunning: false,
    isPaused: false,
    type: 'pass', // 'pass' or 'answer'
    timeLeft: 30,
    startTime: null,
    pausedAt: null
  }
};

let timerInterval = null;

// ============================================
// 📥 LOAD QUESTIONS
// ============================================

async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    quizData = await response.json();
    console.log("✅ Questions loaded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error loading questions:", error);
    return false;
  }
}

async function loadBackupQuestions() {
  try {
    const response = await fetch('backup-questions.json');
    backupQuestions = await response.json();
    console.log("✅ Backup questions loaded successfully! (" + backupQuestions.backupQuestions.length + " available)");
    return true;
  } catch (error) {
    console.error("❌ Error loading backup questions:", error);
    return false;
  }
}

// ============================================
// 💾 LOCAL STORAGE FUNCTIONS
// ============================================

function saveToLocalStorage() {
  try {
    localStorage.setItem('yuzone_quiz_state', JSON.stringify(gameState));
    console.log("💾 Game state saved locally");
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('yuzone_quiz_state');
    if (saved) {
      const loadedState = JSON.parse(saved);
      // Return the loaded state without modifying gameState directly
      // (applyStateUpdate will handle the merge)
      return loadedState;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return null;
}

function clearLocalStorage() {
  try {
    localStorage.removeItem('yuzone_quiz_state');
    console.log("🗑️ Local storage cleared");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// ============================================
// 🎯 GAME STATE MANAGEMENT
// ============================================

function getCurrentRound() {
  if (!quizData) return null;
  return quizData.rounds.find(r => r.id === gameState.currentRound);
}

function getCurrentQuestion() {
  // If showing backup question, return it
  if (gameState.isBackupQuestion && backupQuestions && gameState.backupQuestionId) {
    return backupQuestions.backupQuestions.find(q => q.id === gameState.backupQuestionId);
  }
  
  // Otherwise return normal question
  const round = getCurrentRound();
  if (!round) return null;
  return round.questions.find(q => q.id === gameState.currentQuestion);
}

function loadBackupQuestion(backupId) {
  if (!backupQuestions) {
    alert("⚠️ Backup questions not loaded!");
    return;
  }
  
  const backup = backupQuestions.backupQuestions.find(q => q.id === backupId);
  if (!backup) {
    alert("⚠️ Backup question not found!");
    return;
  }
  
  gameState.isBackupQuestion = true;
  gameState.backupQuestionId = backupId;
  gameState.optionsVisible = false;
  gameState.answerRevealed = false;
  
  saveToLocalStorage();
  broadcastChange();
  
  console.log("🔄 Loaded backup question #" + backupId);
}

function returnToNormalQuestion() {
  gameState.isBackupQuestion = false;
  gameState.backupQuestionId = null;
  gameState.optionsVisible = false;
  gameState.answerRevealed = false;
  
  saveToLocalStorage();
  broadcastChange();
  
  console.log("↩️ Returned to normal question");
}

function setCurrentQuestion(roundId, questionId) {
  gameState.currentRound = roundId;
  gameState.currentQuestion = questionId;
  gameState.optionsVisible = false;
  gameState.answerRevealed = false;
  
  // Stop timer when changing questions
  stopTimer();
  
  // Fast sync (both local and Firebase)
  saveToLocalStorage();
  broadcastChange();
  syncToFirebase(gameState);
  updateQuestionDisplay();
}

function showOptions() {
  gameState.optionsVisible = true;
  saveToLocalStorage();
  broadcastChange(); // Add this line
  syncUIState(true, gameState.answerRevealed);
  updateQuestionDisplay();
}

function hideOptions() {
  gameState.optionsVisible = false;
  gameState.answerRevealed = false;
  saveToLocalStorage();
  broadcastChange(); // Add this line
  syncUIState(false, false);
  updateQuestionDisplay();
}

function revealAnswer() {
  gameState.answerRevealed = true;
  saveToLocalStorage();
  broadcastChange(); // Add this line
  syncUIState(gameState.optionsVisible, true);
  updateQuestionDisplay();
}

function hideAnswer() {
  gameState.answerRevealed = false;
  saveToLocalStorage();
  broadcastChange(); // Add this line
  syncUIState(gameState.optionsVisible, false);
  updateQuestionDisplay();
}

// ============================================
// 👥 TEAM MANAGEMENT
// ============================================

function addTeam() {
  const newTeamId = gameState.teams.length + 1;
  const newTeam = {
    id: newTeamId,
    name: `Team ${newTeamId}`,
    score: 0
  };
  
  gameState.teams.push(newTeam);
  saveToLocalStorage();
  broadcastChange();
  syncScores(gameState.teams);
  updateScoreboard();
  
  if (typeof updateTeamsManager === 'function') {
    updateTeamsManager();
  }
  
  console.log(`✅ Added ${newTeam.name}`);
  return newTeam;
}

function deleteTeam(teamId) {
  const teamIndex = gameState.teams.findIndex(t => t.id === teamId);
  
  if (teamIndex === -1) {
    console.error(`Team ${teamId} not found`);
    return false;
  }
  
  const teamName = gameState.teams[teamIndex].name;
  gameState.teams.splice(teamIndex, 1);
  
  saveToLocalStorage();
  broadcastChange();
  syncScores(gameState.teams);
  updateScoreboard();
  
  if (typeof updateTeamsManager === 'function') {
    updateTeamsManager();
  }
  
  console.log(`🗑️ Deleted ${teamName}`);
  return true;
}

function updateTeamScore(teamId, points) {
  const team = gameState.teams.find(t => t.id === teamId);
  if (team) {
    team.score += points;
    if (team.score < 0) team.score = 0; // Prevent negative scores
    
    saveToLocalStorage();
    broadcastChange();
    syncScores(gameState.teams);
  }
}

function updateTeamName(teamId, newName) {
  const team = gameState.teams.find(t => t.id === teamId);
  if (team) {
    team.name = newName;
    saveToLocalStorage();
    broadcastChange();
    syncScores(gameState.teams);
  }
}

function updateQuizTitle(newTitle) {
  if (newTitle && newTitle.trim()) {
    gameState.quizTitle = newTitle.trim();
    saveToLocalStorage();
    broadcastChange();
    
    // Update the title on the projector screen if it exists
    const titleElement = document.getElementById('quiz-title');
    if (titleElement) {
      titleElement.textContent = gameState.quizTitle;
    }
    
    console.log(`📝 Updated quiz title to: ${gameState.quizTitle}`);
  }
}

function resetScores() {
  gameState.teams.forEach(team => team.score = 0);
  saveToLocalStorage();
  syncScores(gameState.teams);
}

// ============================================
// ⏱️ TIMER FUNCTIONS
// ============================================

function startTimer(type = 'pass') {
  // Stop any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  gameState.timer.type = type;
  gameState.timer.timeLeft = type === 'pass' ? 30 : 15;
  gameState.timer.isRunning = true;
  gameState.timer.isPaused = false;
  gameState.timer.startTime = Date.now();
  gameState.timer.pausedAt = null;
  
  // Start local timer interval
  runTimerInterval();
  
  // Sync to Firebase immediately
  updateTimerDisplay();
  saveToLocalStorage();
  syncTimer(gameState.timer);
}

function pauseTimer() {
  if (!gameState.timer.isRunning || gameState.timer.isPaused) return;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  gameState.timer.isPaused = true;
  gameState.timer.pausedAt = Date.now();
  
  updateTimerDisplay();
  saveToLocalStorage();
  syncTimer(gameState.timer);
}

function resumeTimer() {
  if (!gameState.timer.isPaused) return;
  
  // Calculate how much time has been paused and adjust startTime
  const pausedDuration = Date.now() - gameState.timer.pausedAt;
  gameState.timer.startTime += pausedDuration;
  gameState.timer.isPaused = false;
  gameState.timer.pausedAt = null;
  
  // Restart interval
  runTimerInterval();
  
  updateTimerDisplay();
  saveToLocalStorage();
  syncTimer(gameState.timer);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  gameState.timer.isRunning = false;
  gameState.timer.isPaused = false;
  gameState.timer.startTime = null;
  gameState.timer.pausedAt = null;
  
  updateTimerDisplay();
  saveToLocalStorage();
  syncTimer(gameState.timer);
}

function resetTimer() {
  stopTimer();
  gameState.timer.type = 'pass';
  gameState.timer.timeLeft = 30;
  
  updateTimerDisplay();
  saveToLocalStorage();
  syncTimer(gameState.timer);
}

// Internal function to run timer interval
function runTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  console.log('🎬 runTimerInterval: Starting timer interval');
  
  let warningPlayed = false;
  let finalAlarmPlayed = false;
  
  timerInterval = setInterval(() => {
    if (!gameState.timer.isRunning || gameState.timer.isPaused) {
      console.log('⏸️ Timer interval stopping - isRunning:', gameState.timer.isRunning, 'isPaused:', gameState.timer.isPaused);
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }
    
    // Calculate precise milliseconds elapsed
    const elapsedMs = Date.now() - gameState.timer.startTime;
    const elapsedSeconds = elapsedMs / 1000;
    const duration = gameState.timer.type === 'pass' ? 30 : 15;
    const timeLeftSeconds = duration - elapsedSeconds;
    
    // Update display time (rounded for display)
    gameState.timer.timeLeft = Math.max(0, Math.ceil(timeLeftSeconds));
    
    // Play warning beep at exactly 5 seconds remaining (within 50ms accuracy)
    if (!warningPlayed && timeLeftSeconds <= 5.05 && timeLeftSeconds > 4.95) {
      playWarningSound();
      warningPlayed = true;
      console.log('⚠️ Warning sound triggered at 5 seconds (precise)');
    }
    
    // Play final alarm when time expires (within 50ms of 0)
    if (!finalAlarmPlayed && timeLeftSeconds <= 0.05) {
      console.log('⏰ Timer reached 0 - playing final alarm (precise)');
      playTimerSound();
      finalAlarmPlayed = true;
      
      // Stop timer after sound starts playing
      setTimeout(() => {
        stopTimer();
      }, 50);
    }
    
    updateTimerDisplay();
  }, 50); // Update 20 times per second for better accuracy
  
  console.log('✅ Timer interval ID:', timerInterval);
}

// Sync timer across devices (called when receiving Firebase update)
function syncTimerFromRemote(timerData) {
  if (!timerData) return;
  
  console.log('🔄 syncTimerFromRemote called:', {
    isRunning: timerData.isRunning,
    isPaused: timerData.isPaused,
    timeLeft: timerData.timeLeft,
    hasStartTime: !!timerData.startTime
  });
  
  // Clear existing interval to prevent flicker
  if (timerInterval) {
    console.log('⏹️ Clearing existing timer interval');
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Update state from remote
  gameState.timer = { ...timerData };
  
  // If timer is running and not paused, start local interval
  if (timerData.isRunning && !timerData.isPaused && timerData.startTime) {
    console.log('▶️ Timer is running and not paused - starting interval');
    
    // Calculate current time left based on start time
    const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000);
    const duration = timerData.type === 'pass' ? 30 : 15;
    gameState.timer.timeLeft = Math.max(0, duration - elapsed);
    
    console.log('⏱️ Calculated timeLeft:', gameState.timer.timeLeft, 'seconds');
    
    // Start synced interval
    runTimerInterval();
    console.log('✅ Timer interval started');
  } else if (timerData.isPaused) {
    console.log('⏸️ Timer is paused - not starting interval');
  } else {
    console.log('⏹️ Timer is stopped - not starting interval');
  }
  
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const timerElement = document.getElementById('timer-time');
  const timerLabel = document.getElementById('timer-label');
  const adminTimerDisplay = document.getElementById('admin-timer-display');
  const timerStatus = document.getElementById('timer-status');
  
  const minutes = Math.floor(Math.abs(gameState.timer.timeLeft) / 60);
  const seconds = Math.abs(gameState.timer.timeLeft) % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update projector timer
  if (timerElement) {
    timerElement.textContent = timeString;
    
    // Update styling based on timer state
    timerElement.className = 'timer-time';
    if (gameState.timer.isRunning && !gameState.timer.isPaused) {
      timerElement.classList.add(gameState.timer.type === 'pass' ? 'pass-timer' : 'answer-timer');
    } else if (gameState.timer.isPaused) {
      timerElement.classList.add('paused');
    } else {
      timerElement.classList.add('stopped');
    }
  }
  
  // Update projector label
  if (timerLabel) {
    const label = gameState.timer.type === 'pass' ? 'Pass Timer (30s)' : 'Answer Timer (15s)';
    timerLabel.textContent = label;
  }
  
  // Update admin timer display
  if (adminTimerDisplay) {
    adminTimerDisplay.textContent = timeString;
    adminTimerDisplay.style.color = gameState.timer.isPaused ? 'var(--accent-orange)' : 
                                     gameState.timer.isRunning ? 'var(--accent-green)' : 
                                     'var(--text-secondary)';
  }
  
  // Update timer status
  if (timerStatus) {
    if (gameState.timer.isPaused) {
      timerStatus.textContent = '⏸️ Timer Paused';
      timerStatus.style.color = 'var(--accent-orange)';
    } else if (gameState.timer.isRunning) {
      timerStatus.textContent = `▶️ ${gameState.timer.type === 'pass' ? '30s' : '15s'} Timer Running`;
      timerStatus.style.color = 'var(--accent-green)';
    } else {
      timerStatus.textContent = '⏹️ Timer Stopped';
      timerStatus.style.color = 'var(--text-secondary)';
    }
  }
}

function playWarningSound() {
  try {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    console.log(`⚠️ WARNING BEEP at ${timeStr} - 5 seconds remaining`);
    
    // Double beep at 5 seconds - more noticeable
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    for (let i = 0; i < 2; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880; // Higher pitch
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + (i * 0.2);
      gainNode.gain.setValueAtTime(0.5, startTime); // Louder
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    }
  } catch (error) {
    console.error('Error playing warning sound:', error);
  }
}

function playTimerSound() {
  try {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    console.log(`🔔 FINAL ALARM at ${timeStr} - TIME'S UP!`);
    
    // Create a very loud, attention-grabbing alarm sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create five loud beeps in rapid succession with alternating pitch
    for (let i = 0; i < 5; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Alternating frequencies for more attention
      oscillator.frequency.value = i % 2 === 0 ? 1200 : 900;
      oscillator.type = 'square'; // More jarring sound
      
      // Very loud volume
      const startTime = audioContext.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(0.7, startTime); // Maximum safe volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.08);
    }
  } catch (error) {
    console.error('Error playing timer sound:', error);
  }
}

// ============================================
// 🖥️ UI UPDATE FUNCTIONS (for projector view)
// ============================================

function updateQuestionDisplay() {
  const question = getCurrentQuestion();
  
  // Update round title
  const roundTitle = document.getElementById('round-title');
  if (roundTitle) {
    if (gameState.isBackupQuestion && question) {
      roundTitle.textContent = `🆘 BACKUP QUESTION`;
      roundTitle.style.background = 'var(--accent-orange)';
      roundTitle.style.color = 'var(--bg-primary)';
      roundTitle.style.padding = '8px 20px';
      roundTitle.style.borderRadius = '8px';
      roundTitle.style.animation = 'pulse 2s infinite';
    } else {
      const round = getCurrentRound();
      if (round) {
        roundTitle.textContent = round.name;
        roundTitle.style.background = '';
        roundTitle.style.color = 'var(--accent-orange)';
        roundTitle.style.padding = '';
        roundTitle.style.borderRadius = '';
        roundTitle.style.animation = '';
      }
    }
  }
  
  // Update question
  const questionNumber = document.getElementById('question-number');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  
  if (question) {
    if (questionNumber) {
      if (gameState.isBackupQuestion) {
        questionNumber.textContent = `🆘 Backup Question #${gameState.backupQuestionId}`;
        questionNumber.style.color = 'var(--accent-orange)';
      } else {
        questionNumber.textContent = `Question ${gameState.currentQuestion}`;
        questionNumber.style.color = 'var(--accent-blue)';
      }
    }
    
    if (questionText) {
      questionText.textContent = question.question;
    }
    
    if (optionsContainer) {
      // Show or hide options based on state
      if (gameState.optionsVisible) {
        optionsContainer.style.display = 'grid';
        optionsContainer.innerHTML = '';
        question.options.forEach(option => {
          const optionDiv = document.createElement('div');
          optionDiv.className = 'option';
          optionDiv.textContent = option;
          
          // Highlight correct answer if revealed
          const optionLetter = option.charAt(0);
          if (gameState.answerRevealed && optionLetter === question.correctAnswer) {
            optionDiv.style.borderColor = 'var(--accent-green)';
            optionDiv.style.background = 'rgba(195, 232, 141, 0.2)';
            optionDiv.style.borderWidth = '3px';
            optionDiv.style.fontWeight = 'bold';
          }
          
          optionsContainer.appendChild(optionDiv);
        });
      } else {
        optionsContainer.style.display = 'none';
      }
    }
  }
}

function updateScoreboard() {
  const teamsContainer = document.getElementById('teams-container');
  if (!teamsContainer) return;
  
  teamsContainer.innerHTML = '';
  
  gameState.teams.forEach(team => {
    const teamCard = document.createElement('div');
    teamCard.className = 'team-card';
    teamCard.innerHTML = `
      <div class="team-name">${team.name}</div>
      <div class="team-score">${team.score}</div>
    `;
    teamsContainer.appendChild(teamCard);
  });
}

// ============================================
// 🔄 OPTIMIZED FIREBASE SYNC HANDLERS
// ============================================

let isUpdatingFromFirebase = false;

function handleFirebaseUpdate(data) {
  if (!data || isUpdatingFromFirebase) return;
  
  isUpdatingFromFirebase = true;
  
  // Merge data intelligently
  const hasChanges = mergeGameState(data);
  
  if (hasChanges) {
    // Update UI immediately
    requestAnimationFrame(() => {
      if (typeof updateQuestionDisplay === 'function') updateQuestionDisplay();
      if (typeof updateScoreboard === 'function') updateScoreboard();
      if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
      if (typeof updateAdminUI === 'function') updateAdminUI();
    });
    
    // Save locally as backup
    saveToLocalStorage();
  }
  
  isUpdatingFromFirebase = false;
}

function mergeGameState(newData) {
  let hasChanges = false;
  
  // Merge teams
  if (newData.teams && JSON.stringify(newData.teams) !== JSON.stringify(gameState.teams)) {
    gameState.teams = newData.teams;
    hasChanges = true;
  }
  
  // Merge question state
  if (newData.currentRound !== undefined && newData.currentRound !== gameState.currentRound) {
    gameState.currentRound = newData.currentRound;
    hasChanges = true;
  }
  
  if (newData.currentQuestion !== undefined && newData.currentQuestion !== gameState.currentQuestion) {
    gameState.currentQuestion = newData.currentQuestion;
    hasChanges = true;
  }
  
  // Merge UI state
  if (newData.optionsVisible !== undefined && newData.optionsVisible !== gameState.optionsVisible) {
    gameState.optionsVisible = newData.optionsVisible;
    hasChanges = true;
  }
  
  if (newData.answerRevealed !== undefined && newData.answerRevealed !== gameState.answerRevealed) {
    gameState.answerRevealed = newData.answerRevealed;
    hasChanges = true;
  }

  if (typeof newData.showInstructions === 'boolean' &&
      newData.showInstructions !== gameState.showInstructions) {
    gameState.showInstructions = newData.showInstructions;
    hasChanges = true;
  }

  // Support nested UI payloads from Firebase quick sync
  if (newData.ui) {
    if (newData.ui.optionsVisible !== undefined && newData.ui.optionsVisible !== gameState.optionsVisible) {
      gameState.optionsVisible = newData.ui.optionsVisible;
      hasChanges = true;
    }
    if (newData.ui.answerRevealed !== undefined && newData.ui.answerRevealed !== gameState.answerRevealed) {
      gameState.answerRevealed = newData.ui.answerRevealed;
      hasChanges = true;
    }
    if (newData.ui.showInstructions !== undefined &&
        newData.ui.showInstructions !== gameState.showInstructions) {
      gameState.showInstructions = newData.ui.showInstructions;
      hasChanges = true;
    }
  }
  
  // Merge timer state with sync
  if (newData.timer) {
    syncTimerFromRemote(newData.timer);
    hasChanges = true;
  }
  
  return hasChanges;
}

// ============================================
// 🚀 INITIALIZATION
// ============================================

async function initializeApp() {
  console.log("🚀 Initializing YUZONE Quiz App...");
  
  // Load questions
  await loadQuestions();
  
  // Load backup questions
  await loadBackupQuestions();
  
  // Populate backup questions dropdown if on admin page
  if (typeof populateBackupQuestionsList === 'function') {
    setTimeout(() => {
      populateBackupQuestionsList();
    }, 500);
  }
  
  // Try to load saved state
  const savedState = loadFromLocalStorage();
  if (savedState) {
    console.log("📂 Loading initial state from localStorage");
    applyStateUpdate(savedState);
  }
  
  // Setup Firebase listener
  listenToFirebase(handleFirebaseUpdate);
  
  // Start polling for localStorage changes (for projector view)
  startPolling();
  
  // Initial UI update
  if (typeof updateQuestionDisplay === 'function') updateQuestionDisplay();
  if (typeof updateScoreboard === 'function') updateScoreboard();
  if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
  if (typeof updateAdminUI === 'function') updateAdminUI();
  
  console.log("✅ App initialized successfully!");
  console.log("📡 Polling started for real-time updates");
}

// ============================================
// 🔄 LOCAL STORAGE SYNC (Cross-tab communication)
// ============================================

let pollInterval = null;

// Listen for localStorage changes from other tabs/windows
window.addEventListener('storage', (e) => {
  if (e.key === 'yuzone_quiz_state' && e.newValue) {
    try {
      const newState = JSON.parse(e.newValue);
      applyStateUpdate(newState);
    } catch (error) {
      console.error('Error syncing from localStorage:', error);
    }
  }
});

// Poll localStorage for changes (backup method for same-tab updates)
function startPolling() {
  if (pollInterval) return;
  
  console.log('🔄 Starting localStorage polling (100ms)');
  
  pollInterval = setInterval(() => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      applyStateUpdate(savedState);
    }
  }, 100); // Check every 100ms
}

// Apply state updates from localStorage or Firebase
function applyStateUpdate(newState) {
  if (!newState) return;
  
  let hasChanges = false;
  
  // Check for quiz title changes
  if (newState.quizTitle && newState.quizTitle !== gameState.quizTitle) {
    gameState.quizTitle = newState.quizTitle;
    hasChanges = true;
    const titleElement = document.getElementById('quiz-title');
    if (titleElement) {
      titleElement.textContent = gameState.quizTitle;
    }
    console.log('📝 Quiz title updated:', newState.quizTitle);
  }
  
  // Check for instructions display state
  const incomingShowInstructions =
    typeof newState.showInstructions === 'boolean' ? newState.showInstructions : true;
  if (incomingShowInstructions !== gameState.showInstructions) {
    gameState.showInstructions = incomingShowInstructions;
    hasChanges = true;
    
    // Show or hide instructions on main screen
    if (typeof window.showInstructions === 'function' && typeof window.hideInstructions === 'function') {
      if (incomingShowInstructions) {
        window.showInstructions();
      } else {
        window.hideInstructions(true);
      }
    }
    console.log('📖 Instructions display:', incomingShowInstructions ? 'shown' : 'hidden');
  }
  
  // Check for backup question state changes
  if (newState.isBackupQuestion !== gameState.isBackupQuestion) {
    gameState.isBackupQuestion = newState.isBackupQuestion;
    hasChanges = true;
    console.log('🔄 Backup question mode:', newState.isBackupQuestion);
  }
  
  if (newState.backupQuestionId !== gameState.backupQuestionId) {
    gameState.backupQuestionId = newState.backupQuestionId;
    hasChanges = true;
    console.log('🔄 Backup question ID:', newState.backupQuestionId);
  }
  
  // Check for changes
  if (newState.currentRound !== gameState.currentRound || 
      newState.currentQuestion !== gameState.currentQuestion) {
    gameState.currentRound = newState.currentRound;
    gameState.currentQuestion = newState.currentQuestion;
    hasChanges = true;
    console.log('📝 Question changed to Round', newState.currentRound, 'Q', newState.currentQuestion);
  }
  
  if (newState.optionsVisible !== gameState.optionsVisible) {
    gameState.optionsVisible = newState.optionsVisible;
    hasChanges = true;
    console.log('👁️ Options visibility changed:', newState.optionsVisible);
  }
  
  if (newState.answerRevealed !== gameState.answerRevealed) {
    gameState.answerRevealed = newState.answerRevealed;
    hasChanges = true;
    console.log('✅ Answer revealed:', newState.answerRevealed);
  }
  
  if (newState.teams && JSON.stringify(newState.teams) !== JSON.stringify(gameState.teams)) {
    gameState.teams = newState.teams;
    hasChanges = true;
    console.log('🏆 Scores updated');
  }
  
  // Sync timer
  if (newState.timer) {
    const timerChanged = 
      newState.timer.isRunning !== gameState.timer.isRunning ||
      newState.timer.isPaused !== gameState.timer.isPaused ||
      newState.timer.type !== gameState.timer.type ||
      newState.timer.startTime !== gameState.timer.startTime ||
      Math.abs(newState.timer.timeLeft - gameState.timer.timeLeft) > 2;
    
    if (timerChanged) {
      syncTimerFromRemote(newState.timer);
      hasChanges = true;
      const state = newState.timer.isPaused ? 'paused' : (newState.timer.isRunning ? 'running' : 'stopped');
      console.log('⏱️ Timer synced:', state, '- Time:', newState.timer.timeLeft);
    }
  }
  
  // Update UI if there were changes
  if (hasChanges) {
    requestAnimationFrame(() => {
      if (typeof updateQuestionDisplay === 'function') updateQuestionDisplay();
      if (typeof updateScoreboard === 'function') updateScoreboard();
      if (typeof updateTimerDisplay === 'function') updateTimerDisplay();
      if (typeof updateAdminUI === 'function') updateAdminUI();
    });
  }
}

// Broadcast changes to other tabs
function broadcastChange() {
  // Save to localStorage (triggers 'storage' event in other tabs)
  saveToLocalStorage();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
