# 🎯 QUICK REFERENCE CARD

## 🚀 INSTANT START (3 WAYS)

### 🖥️ Method 1: Same Computer (Easiest!)
```
1. Open admin.html  (your control)
2. Open index.html  (full screen for projector)
3. Done! Auto-syncs ✅
```

### 📡 Method 2: Local WiFi (No Internet!)
```
1. Run: python -m http.server 8080
2. Find IP: ipconfig
3. Admin: http://localhost:8080/admin.html
4. Projector: http://YOUR-IP:8080/index.html
```

### 🌐 Method 3: With Firebase (Real-time)
```
1. Setup Firebase in firebase.js
2. Both devices connect to internet
3. Instant sync across devices ⚡
```

---

## 🎮 NEW SCORING BUTTONS

```
┌────────────────────────────────┐
│ Team 1    [Score: 10]    🗑️   │
├────┬────┬────┬────┬──────┬────┤
│ +2 │ +1 │ -2 │ -1 │[Box] │Add │
└────┴────┴────┴────┴──────┴────┘
         [Reset Score]
```

### Button Guide:
- **+2** → Correct answer (2 pts)
- **+1** → Partial credit (1 pt)
- **-2** → Major penalty (-2 pts)
- **-1** → Minor penalty (-1 pt)
- **[Box]** → Type custom number
- **Add** → Apply custom score

---

## ⏱️ TIMER CONTROLS

### Admin Panel:
```
▶️ Start 30s Timer  (main timer)
▶️ Start 15s Timer  (pass timer)
⏸️ Stop Timer       (pause)
🔄 Reset Timer      (back to 30s)
```

### Projector View:
```
┌─────────────────────┐
│  Pass Timer (30s)   │ ← Top-right corner
│       0:30          │
└─────────────────────┘
```

---

## 🎯 QUIZ WORKFLOW

```
1. Load Question
   ↓
2. Show Options
   ↓
3. Start 30s Timer
   ↓
4. Team answers OR passes
   ↓
5. If passed → Start 15s Timer
   ↓
6. Timer ends
   ↓
7. Show Correct Answer ✅
   ↓
8. Update Score (+2, +1, etc.)
   ↓
9. Next Question → Repeat!
```

---

## ⌨️ KEYBOARD SHORTCUTS

### Admin Panel:
```
Ctrl + →     Next question
Ctrl + ←     Previous question
Ctrl + Space Start/Stop timer
Ctrl + Enter Start answer timer
Ctrl + R     Reset timer
```

### Projector View:
```
Space   Start/Stop timer
→       Next question
←       Previous question
F11     Full screen
```

### Debug:
```
Ctrl + Shift + P   Performance stats
```

---

## 👥 TEAM MANAGEMENT

```
➕ Add Team          Create new team
➖ Remove Last       Delete last team
🗑️ (per team)        Delete specific team
[Name box]          Edit team name
```

---

## 🔧 TROUBLESHOOTING

### Timer not showing?
```
✓ Refresh page (F5)
✓ Check top-right corner
✓ Look for "Pass Timer (30s)"
```

### Changes not syncing?
```
✓ Same computer: Use 2 tabs
✓ Local WiFi: Use Python server
✓ Internet: Configure Firebase
```

### Custom score not working?
```
✓ Type number in box
✓ Click "Add" button
✓ Number can be negative (-5)
```

### Question text too small?
```
✓ Now 2.2rem bold ✅
✓ Options 1.4rem bold ✅
✓ Clear from distance ✅
```

---

## 📊 STATUS INDICATORS

```
🟢 LIVE SYNC         Firebase connected
🟡 LOCAL MODE        No Firebase (still works!)
⚡ SYNCING...        Updating now
```

---

## 💾 DATA STORAGE

### Local Storage:
- ✅ Saves automatically
- ✅ Survives refresh
- ✅ Works offline
- ✅ Cross-tab sync

### Firebase:
- ✅ Real-time sync
- ✅ Multi-device
- ✅ Instant updates
- ✅ Requires internet

---

## 🎨 PROJECTOR LAYOUT

```
┌─────────────────────────────────────┐
│ 🧠 YUZONE QUIZ      [Timer: 0:30] │ ← Header
│ Round 1: General Knowledge         │
├─────────────────────────────────────┤
│                                     │
│ Question 1                          │ ← Bold!
│ What is the capital of France?     │ ← Large & Bold!
│                                     │
│ [A) London]    [B) Berlin]         │ ← Bold options
│ [C) Paris ✅]  [D) Madrid]         │
│                                     │
├─────────────────────────────────────┤
│ 🏆 SCOREBOARD 🏆                    │
│ Team1:10  Team2:5  Team3:0 ...     │ ← Bottom
└─────────────────────────────────────┘
```

---

## 📱 LOCAL WIFI QUICK SETUP

### Step 1: Start Server
```powershell
cd d:\Programming\Quizzz
python -m http.server 8080
```

### Step 2: Find IP
```powershell
ipconfig
```
Look for: `192.168.x.x`

### Step 3: Connect
```
Admin:     http://localhost:8080/admin.html
Projector: http://192.168.x.x:8080/index.html
```

### Step 4: Host Quiz! 🎉

---

## ✅ PRE-QUIZ CHECKLIST

Setup (5 mins before):
- [ ] Questions customized in questions.json
- [ ] Python server running (if using 2 computers)
- [ ] Admin panel open and working
- [ ] Projector view full screen (F11)
- [ ] Team names edited
- [ ] Scores reset to 0
- [ ] Test timer
- [ ] Test next question
- [ ] Test scoring buttons

During Quiz:
- [ ] Load question
- [ ] Show options when ready
- [ ] Start appropriate timer
- [ ] Show answer after timer
- [ ] Update scores
- [ ] Next question

---

## 🎯 SCORING EXAMPLES

### Standard Points:
```
Correct answer:     +2
Partial credit:     +1
Wrong answer:       -1
Major mistake:      -2
```

### Custom Scenarios:
```
Bonus question:     Type 5, Click Add
Speed bonus:        Type 3, Click Add
Time penalty:       Type -3, Click Add
Reset to zero:      Click Reset button
```

---

## 💡 PRO TIPS

✅ **Full screen projector** (F11) for best view  
✅ **Hide options** until teams are ready  
✅ **Use custom scores** for bonus rounds  
✅ **Test sync** before quiz starts  
✅ **Have backup questions** ready  
✅ **Keep admin screen** visible to you only  

---

## 📚 DOCUMENTATION

- `README.md` - Complete guide
- `QUICK_START.md` - Fast setup
- `LOCAL_WIFI_SETUP.md` - WiFi details
- `LATEST_FIXES.md` - Recent updates
- `FEATURES.md` - All features
- This file - Quick reference!

---

## 🆘 EMERGENCY FIXES

### Everything broken?
```
1. Click "Clear Cache & Reload"
2. Close all tabs
3. Restart browser
4. Open admin.html again
```

### Timer stuck?
```
1. Click Reset Timer
2. Refresh page
3. Start timer again
```

### Scores wrong?
```
1. Use custom score to correct
2. Type correct total
3. Click Add
4. Or click Reset and start over
```

---

**Print this card and keep it handy during your quiz! 📋✨**
