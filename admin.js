// ============================================
// 🎮 ADMIN PANEL - SPECIFIC FUNCTIONS
// ============================================

// ============================================
// ⏱️ TIMER CONTROLS
// ============================================

function togglePauseResume() {
  if (gameState.timer.isPaused) {
    resumeTimer();
  } else if (gameState.timer.isRunning) {
    pauseTimer();
  }
  updateControlButtons();
}

// ============================================
// ⚙️ QUIZ SETTINGS
// ============================================

function updateQuizTitleFromAdmin() {
  const input = document.getElementById('quiz-title-input');
  const newTitle = input.value.trim();
  
  if (!newTitle) {
    alert("⚠️ Please enter a title!");
    return;
  }
  
  updateQuizTitle(newTitle);
  alert(`✅ Quiz title updated to: ${newTitle}`);
  console.log(`📝 Admin updated quiz title to: ${newTitle}`);
}

function loadQuizTitleToInput() {
  const input = document.getElementById('quiz-title-input');
  if (input && gameState.quizTitle) {
    input.value = gameState.quizTitle;
  }
}

function openInstructions() {
  // Store instruction display state in gameState
  gameState.showInstructions = true;
  saveToLocalStorage();
  broadcastChange();
  if (typeof syncToFirebase === 'function') {
    syncToFirebase(gameState);
  }
  
  console.log('📖 Showing instructions on main screen');
}

function closeInstructions() {
  // Hide instructions on main screen
  gameState.showInstructions = false;
  saveToLocalStorage();
  broadcastChange();
  if (typeof syncToFirebase === 'function') {
    syncToFirebase(gameState);
  }
  
  console.log('❌ Hiding instructions from main screen');
}

// ============================================
// 📝 QUESTION MANAGEMENT
// ============================================

function loadSelectedQuestion() {
  const roundSelector = document.getElementById('round-selector');
  const questionSelector = document.getElementById('question-selector');
  
  const roundId = parseInt(roundSelector.value);
  const questionId = parseInt(questionSelector.value);
  
  setCurrentQuestion(roundId, questionId);
  updateAdminUI();
  
  console.log(`📝 Loaded Round ${roundId}, Question ${questionId}`);
}

function loadSelectedBackupQuestion() {
  const backupSelector = document.getElementById('backup-question-selector');
  const backupId = parseInt(backupSelector.value);
  
  if (!backupId) {
    alert("⚠️ Please select a backup question first!");
    return;
  }
  
  loadBackupQuestion(backupId);
  updateAdminUI();
  updateQuestionDisplay();
  
  console.log(`🆘 Loaded backup question #${backupId}`);
}

function populateBackupQuestionsList() {
  const backupSelector = document.getElementById('backup-question-selector');
  
  if (!backupSelector) {
    console.error('❌ Backup selector element not found!');
    return;
  }
  
  if (!backupQuestions) {
    console.warn('⚠️ Backup questions not loaded yet, retrying...');
    setTimeout(populateBackupQuestionsList, 500);
    return;
  }
  
  if (!backupQuestions.backupQuestions) {
    console.error('❌ Backup questions data is invalid!');
    return;
  }
  
  // Clear existing options except first one
  backupSelector.innerHTML = '<option value="">-- Select Backup Question --</option>';
  
  // Add backup questions
  backupQuestions.backupQuestions.forEach(q => {
    const option = document.createElement('option');
    option.value = q.id;
    option.textContent = `#${q.id} - ${q.question.substring(0, 60)}${q.question.length > 60 ? '...' : ''}`;
    backupSelector.appendChild(option);
  });
  
  console.log(`✅ Populated ${backupQuestions.backupQuestions.length} backup questions in dropdown`);
}

function toggleOptions() {
  if (gameState.optionsVisible) {
    hideOptions();
  } else {
    showOptions();
  }
  updateAdminUI();
  updateQuestionDisplay();
}

function nextQuestion() {
  const round = getCurrentRound();
  if (!round) return;
  
  if (gameState.currentQuestion < round.questions.length) {
    // Move to next question in same round
    setCurrentQuestion(gameState.currentRound, gameState.currentQuestion + 1);
  } else if (gameState.currentRound < quizData.rounds.length) {
    // Move to first question of next round
    setCurrentQuestion(gameState.currentRound + 1, 1);
  } else {
    alert("🎉 You've reached the end of the quiz!");
    return;
  }
  
  updateAdminUI();
  console.log(`➡️ Next: Round ${gameState.currentRound}, Question ${gameState.currentQuestion}`);
}

function previousQuestion() {
  if (gameState.currentQuestion > 1) {
    // Move to previous question in same round
    setCurrentQuestion(gameState.currentRound, gameState.currentQuestion - 1);
  } else if (gameState.currentRound > 1) {
    // Move to last question of previous round
    const prevRound = quizData.rounds.find(r => r.id === gameState.currentRound - 1);
    if (prevRound) {
      setCurrentQuestion(gameState.currentRound - 1, prevRound.questions.length);
    }
  } else {
    alert("⚠️ Already at the first question!");
    return;
  }
  
  updateAdminUI();
  console.log(`⬅️ Previous: Round ${gameState.currentRound}, Question ${gameState.currentQuestion}`);
}

// ============================================
// 🏆 SCORE MANAGEMENT
// ============================================

function addScore(teamId, points) {
  updateTeamScore(teamId, points);
  updateTeamsManager();
  console.log(`✅ Added ${points} points to Team ${teamId}`);
}

function subtractScore(teamId, points) {
  updateTeamScore(teamId, -points);
  updateTeamsManager();
  console.log(`➖ Subtracted ${points} points from Team ${teamId}`);
}

function resetTeamScore(teamId) {
  const team = gameState.teams.find(t => t.id === teamId);
  if (team) {
    team.score = 0;
    saveToLocalStorage();
    syncScores(gameState.teams);
    updateTeamsManager();
    console.log(`🔄 Reset score for Team ${teamId}`);
  }
}

function resetAllScores() {
  if (confirm("⚠️ Are you sure you want to reset all scores to 0?")) {
    resetScores();
    updateTeamsManager();
    console.log("🗑️ All scores reset to 0");
  }
}

function changeTeamName(teamId) {
  const team = gameState.teams.find(t => t.id === teamId);
  if (team) {
    const inputElement = document.getElementById(`team-name-${teamId}`);
    if (inputElement) {
      updateTeamName(teamId, inputElement.value);
      console.log(`✏️ Team ${teamId} renamed to "${inputElement.value}"`);
    }
  }
}

// ============================================
// 🖥️ UI UPDATE FUNCTIONS (Admin specific)
// ============================================

function updateAdminUI() {
  updateSelectors();
  updateQuestionPreview();
  updateTeamsManager();
  updateControlButtons();
  updateBackupStatus();
  loadQuizTitleToInput();
}

function updateBackupStatus() {
  const backupIndicator = document.getElementById('backup-indicator');
  const backupStatus = document.getElementById('backup-status');
  
  if (backupIndicator && backupStatus) {
    if (gameState.isBackupQuestion) {
      backupIndicator.textContent = `🆘 BACKUP QUESTION #${gameState.backupQuestionId}`;
      backupStatus.style.background = 'var(--accent-orange)';
      backupStatus.style.color = 'var(--bg-primary)';
      backupStatus.style.fontWeight = 'bold';
    } else {
      backupIndicator.textContent = '📋 Normal Question Mode';
      backupStatus.style.background = 'var(--bg-secondary)';
      backupStatus.style.color = 'var(--text-primary)';
      backupStatus.style.fontWeight = 'normal';
    }
  }
}

function updateSelectors() {
  const roundSelector = document.getElementById('round-selector');
  const questionSelector = document.getElementById('question-selector');
  
  if (roundSelector) {
    roundSelector.value = gameState.currentRound;
  }
  
  if (questionSelector && quizData) {
    const round = getCurrentRound();
    if (round) {
      // Rebuild question selector options
      questionSelector.innerHTML = '';
      round.questions.forEach(q => {
        const option = document.createElement('option');
        option.value = q.id;
        option.textContent = `Question ${q.id}`;
        questionSelector.appendChild(option);
      });
      
      questionSelector.value = gameState.currentQuestion;
    }
  }
}

function updateQuestionPreview() {
  const question = getCurrentQuestion();
  
  if (!question) return;
  
  // Update round and question info
  const roundName = document.getElementById('preview-round-name');
  const questionNumber = document.getElementById('preview-question-number');
  
  if (roundName) {
    if (gameState.isBackupQuestion) {
      roundName.textContent = `🆘 BACKUP QUESTION`;
    } else {
      const round = getCurrentRound();
      roundName.textContent = round ? round.name : 'Unknown Round';
    }
  }
  
  if (questionNumber) {
    if (gameState.isBackupQuestion) {
      questionNumber.textContent = `Backup Question #${gameState.backupQuestionId}`;
    } else {
      questionNumber.textContent = `Question ${gameState.currentQuestion}`;
    }
  }
  
  // Update question text
  const questionText = document.getElementById('preview-question-text');
  if (questionText) {
    questionText.textContent = question.question;
  }
  
  // Update options
  const optionsContainer = document.getElementById('preview-options-container');
  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'preview-option';
      
      // Check if this is the correct answer
      const optionLetter = option.charAt(0);
      if (optionLetter === question.correctAnswer) {
        optionDiv.classList.add('correct');
      }
      
      optionDiv.textContent = option;
      optionsContainer.appendChild(optionDiv);
    });
  }
  
  // Update correct answer
  const correctAnswer = document.getElementById('preview-correct-answer');
  if (correctAnswer) {
    const correctOption = question.options.find(opt => opt.charAt(0) === question.correctAnswer);
    correctAnswer.textContent = correctOption || question.correctAnswer;
  }
  
  // Show backup question notes if available
  if (gameState.isBackupQuestion && question.notes) {
    const notesDiv = document.createElement('div');
    notesDiv.style.marginTop = '15px';
    notesDiv.style.padding = '12px';
    notesDiv.style.background = 'var(--accent-orange)';
    notesDiv.style.color = 'var(--bg-primary)';
    notesDiv.style.borderRadius = '8px';
    notesDiv.style.fontSize = '0.95rem';
    notesDiv.innerHTML = `<strong>📝 Notes:</strong> ${question.notes}`;
    
    const previewContent = document.querySelector('.preview-content');
    if (previewContent && !document.getElementById('backup-notes')) {
      notesDiv.id = 'backup-notes';
      previewContent.appendChild(notesDiv);
    }
  } else {
    const existingNotes = document.getElementById('backup-notes');
    if (existingNotes) {
      existingNotes.remove();
    }
  }
}

// Cache to prevent unnecessary re-renders
let lastTeamsState = null;

function updateTeamsManager() {
  const container = document.getElementById('teams-manager-container');
  if (!container) return;
  
  // Check if teams actually changed
  const currentState = JSON.stringify(gameState.teams);
  if (currentState === lastTeamsState) {
    // Only update scores without rebuilding
    gameState.teams.forEach(team => {
      const scoreDisplay = container.querySelector(`#team-name-${team.id}`)?.parentElement?.querySelector('.team-score-display');
      if (scoreDisplay) {
        scoreDisplay.textContent = team.score;
      }
    });
    return;
  }
  
  lastTeamsState = currentState;
  
  // Full rebuild only when teams structure changes
  container.innerHTML = '';
  
  gameState.teams.forEach((team, index) => {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team-manager';
    teamDiv.innerHTML = `
      <div class="team-header">
        <input 
          type="text" 
          id="team-name-${team.id}"
          class="team-name-input" 
          value="${team.name}"
          onchange="changeTeamName(${team.id})"
          placeholder="Team ${team.id} Name"
        />
        <div class="team-score-display">${team.score}</div>
        <button class="btn btn-danger btn-small" onclick="deleteSpecificTeam(${team.id})" 
                style="padding: 5px 10px; margin-left: 5px;" title="Delete this team">
          🗑️
        </button>
      </div>
      <div class="score-buttons">
        <button class="btn btn-success btn-small" onclick="addScore(${team.id}, 2)">+2</button>
        <button class="btn btn-success btn-small" onclick="addScore(${team.id}, 1)">+1</button>
        <button class="btn btn-danger btn-small" onclick="subtractScore(${team.id}, 2)">-2</button>
        <button class="btn btn-danger btn-small" onclick="subtractScore(${team.id}, 1)">-1</button>
        <input type="number" id="custom-score-${team.id}" placeholder="Custom" 
               style="width: 60px; padding: 5px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); border-radius: 4px; text-align: center;" />
        <button class="btn btn-primary btn-small" onclick="addCustomScore(${team.id})">Add</button>
        <button class="btn btn-small" onclick="resetTeamScore(${team.id})" style="grid-column: span 2;">🔄 Reset</button>
      </div>
    `;
    
    container.appendChild(teamDiv);
  });
}

function addCustomScore(teamId) {
  const input = document.getElementById(`custom-score-${teamId}`);
  const customScore = parseInt(input.value);
  
  if (isNaN(customScore) || customScore === 0) {
    alert('⚠️ Please enter a valid number');
    return;
  }
  
  addScore(teamId, customScore);
  input.value = ''; // Clear input
  console.log(`✅ Added custom score ${customScore} to Team ${teamId}`);
}

function deleteLastTeam() {
  if (gameState.teams.length <= 1) {
    alert("⚠️ Cannot delete the last team! At least one team is required.");
    return;
  }
  
  const lastTeam = gameState.teams[gameState.teams.length - 1];
  if (confirm(`Delete ${lastTeam.name}?`)) {
    deleteTeam(lastTeam.id);
  }
}

function deleteSpecificTeam(teamId) {
  if (gameState.teams.length <= 1) {
    alert("⚠️ Cannot delete the last team! At least one team is required.");
    return;
  }
  
  const team = gameState.teams.find(t => t.id === teamId);
  if (team && confirm(`Delete ${team.name}?`)) {
    deleteTeam(teamId);
  }
}

function updateControlButtons() {
  const showOptionsBtn = document.getElementById('show-options-btn');
  const revealAnswerBtn = document.getElementById('reveal-answer-btn');
  const pauseResumeBtn = document.getElementById('pause-resume-btn');
  const timerStatus = document.getElementById('timer-status');
  
  // Update "Show Options" button
  if (showOptionsBtn) {
    if (gameState.optionsVisible) {
      showOptionsBtn.textContent = '🙈 Hide Options';
      showOptionsBtn.classList.remove('btn-warning');
      showOptionsBtn.classList.add('btn-primary');
    } else {
      showOptionsBtn.textContent = '👁️ Show Options';
      showOptionsBtn.classList.remove('btn-primary');
      showOptionsBtn.classList.add('btn-warning');
    }
  }
  
  // Update "Pause/Resume" button
  if (pauseResumeBtn) {
    if (gameState.timer.isRunning) {
      pauseResumeBtn.disabled = false;
      if (gameState.timer.isPaused) {
        pauseResumeBtn.textContent = '▶️ Resume';
        pauseResumeBtn.classList.remove('btn-warning');
        pauseResumeBtn.classList.add('btn-success');
      } else {
        pauseResumeBtn.textContent = '⏸️ Pause';
        pauseResumeBtn.classList.remove('btn-success');
        pauseResumeBtn.classList.add('btn-warning');
      }
    } else {
      pauseResumeBtn.disabled = true;
      pauseResumeBtn.textContent = '⏸️ Pause';
      pauseResumeBtn.classList.remove('btn-success');
      pauseResumeBtn.classList.remove('btn-warning');
    }
  }
  
  // Update "Reveal Answer" button - enabled only when timer is stopped and not running
  if (revealAnswerBtn) {
    if (gameState.answerRevealed) {
      revealAnswerBtn.textContent = '✅ Answer Shown';
      revealAnswerBtn.disabled = true;
    } else if (!gameState.timer.isRunning && gameState.optionsVisible) {
      revealAnswerBtn.textContent = '✅ Show Correct Answer';
      revealAnswerBtn.disabled = false;
    } else {
      revealAnswerBtn.textContent = '⏳ Wait for timer...';
      revealAnswerBtn.disabled = true;
    }
  }
  
  // Update timer status
  if (timerStatus) {
    if (gameState.timer.isRunning) {
      timerStatus.textContent = `⏱️ ${gameState.timer.type === 'pass' ? '30s' : '15s'} timer running...`;
      timerStatus.style.color = 'var(--accent-orange)';
    } else if (gameState.timer.timeLeft === 0) {
      timerStatus.textContent = '⏰ Timer finished!';
      timerStatus.style.color = 'var(--accent-green)';
    } else {
      timerStatus.textContent = 'Timer stopped';
      timerStatus.style.color = 'var(--text-secondary)';
    }
  }
}

// ============================================
// ⌨️ KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
  // Ctrl + Right Arrow = Next question
  if (e.ctrlKey && e.code === 'ArrowRight') {
    e.preventDefault();
    nextQuestion();
  }
  
  // Ctrl + Left Arrow = Previous question
  if (e.ctrlKey && e.code === 'ArrowLeft') {
    e.preventDefault();
    previousQuestion();
  }
  
  // Ctrl + Space = Start/Stop pass timer
  if (e.ctrlKey && e.code === 'Space') {
    e.preventDefault();
    if (gameState.timer.isRunning) {
      stopTimer();
    } else {
      startTimer('pass');
    }
  }
  
  // Ctrl + Enter = Start answer timer
  if (e.ctrlKey && e.code === 'Enter') {
    e.preventDefault();
    startTimer('answer');
  }
  
  // Ctrl + R = Reset timer
  if (e.ctrlKey && e.code === 'KeyR') {
    e.preventDefault();
    resetTimer();
  }
});

// ============================================
// 🚀 ADMIN INITIALIZATION
// ============================================

function updateConnectionStatus() {
  const statusDiv = document.getElementById('connection-status');
  if (!statusDiv) return;
  
  // Check if Firebase is enabled
  if (typeof isFirebaseEnabled !== 'undefined' && isFirebaseEnabled) {
    statusDiv.className = 'status-message status-online';
    statusDiv.innerHTML = '🔥 Firebase Connected';
  } else {
    statusDiv.className = 'status-message status-offline';
    statusDiv.innerHTML = '💾 Local Mode (No Firebase)';
  }
}

function initAdmin() {
  console.log("🎮 Initializing Admin Panel...");
  
  // Wait for main script to initialize
  setTimeout(() => {
    updateAdminUI();
    updateConnectionStatus();
    console.log("✅ Admin Panel Ready!");
    
    // Show keyboard shortcuts
    console.log(`
    ⌨️ KEYBOARD SHORTCUTS:
    - Ctrl + Right Arrow: Next Question
    - Ctrl + Left Arrow: Previous Question
    - Ctrl + Space: Start/Stop Pass Timer
    - Ctrl + Enter: Start Answer Timer
    - Ctrl + R: Reset Timer
    `);
    
    // Check Firebase connection status
    if (typeof isFirebaseEnabled !== 'undefined' && isFirebaseEnabled) {
      console.log('🔥 Firebase: CONNECTED - Real-time sync enabled');
    } else {
      console.log('💾 Firebase: NOT CONFIGURED - Using localStorage only');
      console.log('👉 See FIREBASE_SETUP.md for setup instructions');
    }
  }, 1000);
  
  // Update connection status periodically
  setInterval(updateConnectionStatus, 5000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
