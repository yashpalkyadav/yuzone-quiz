// ============================================
// 📊 PERFORMANCE MONITORING (Optional)
// ============================================
// Include this script to monitor sync performance
// Add <script src="performance-monitor.js"></script> to your HTML

let syncMetrics = {
  totalSyncs: 0,
  syncTimes: [],
  lastSyncTime: 0,
  averageSyncTime: 0
};

// Monitor sync performance
function trackSyncPerformance() {
  const now = Date.now();
  if (syncMetrics.lastSyncTime > 0) {
    const timeSinceLastSync = now - syncMetrics.lastSyncTime;
    syncMetrics.syncTimes.push(timeSinceLastSync);
    
    // Keep only last 20 measurements
    if (syncMetrics.syncTimes.length > 20) {
      syncMetrics.syncTimes.shift();
    }
    
    // Calculate average
    syncMetrics.averageSyncTime = 
      syncMetrics.syncTimes.reduce((a, b) => a + b, 0) / syncMetrics.syncTimes.length;
  }
  
  syncMetrics.lastSyncTime = now;
  syncMetrics.totalSyncs++;
}

// Display sync stats (press Ctrl+Shift+P to toggle)
let showStats = false;
let statsPanel = null;

function toggleStatsPanel() {
  showStats = !showStats;
  
  if (showStats) {
    if (!statsPanel) {
      statsPanel = document.createElement('div');
      statsPanel.id = 'stats-panel';
      statsPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: #64ffda;
        padding: 15px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 10000;
        border: 2px solid #64ffda;
        min-width: 250px;
      `;
      document.body.appendChild(statsPanel);
    }
    statsPanel.style.display = 'block';
    updateStatsDisplay();
  } else if (statsPanel) {
    statsPanel.style.display = 'none';
  }
}

function updateStatsDisplay() {
  if (!showStats || !statsPanel) return;
  
  const fps = Math.round(1000 / (syncMetrics.averageSyncTime || 16));
  const latency = Math.round(syncMetrics.averageSyncTime);
  
  statsPanel.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px; color: #c792ea;">
      📊 SYNC PERFORMANCE
    </div>
    <div>Total Syncs: ${syncMetrics.totalSyncs}</div>
    <div>Avg Latency: ${latency}ms</div>
    <div>Sync Rate: ~${fps} Hz</div>
    <div style="margin-top: 10px; color: ${isFirebaseEnabled ? '#c3e88d' : '#f78c6c'};">
      ${isFirebaseEnabled ? '🟢 Firebase: ACTIVE' : '🟡 Firebase: OFFLINE'}
    </div>
    <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
      Press Ctrl+Shift+P to hide
    </div>
  `;
  
  if (showStats) {
    setTimeout(updateStatsDisplay, 1000);
  }
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyP') {
    e.preventDefault();
    toggleStatsPanel();
  }
});

// Override sync functions to track performance
if (typeof syncToFirebase !== 'undefined') {
  const originalSync = syncToFirebase;
  syncToFirebase = function(...args) {
    trackSyncPerformance();
    return originalSync.apply(this, args);
  };
}

if (typeof quickSync !== 'undefined') {
  const originalQuickSync = quickSync;
  quickSync = function(...args) {
    trackSyncPerformance();
    return originalQuickSync.apply(this, args);
  };
}

console.log('📊 Performance Monitor loaded. Press Ctrl+Shift+P to view stats.');
