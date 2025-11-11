# 🚀 YUZONE QUIZ - QUICK START GUIDE

## ⚡ Instant Setup (30 seconds)

### 1️⃣ Open Files
1. Open `admin.html` in your browser (your control screen)
2. Open `index.html` in another window (projector/big screen)

### 2️⃣ Test It Out
- Click "Show Options" in admin → Options appear on projector ✅
- Click "Start 30s Timer" → Timer counts down ✅
- When timer ends → "Show Correct Answer" becomes active ✅
- Click it → Correct answer highlights in green on projector ✅

---

## 🎮 COMPLETE WORKFLOW

### **Step-by-Step Quiz Flow:**

1. **Load Question**
   - Select round and question in admin panel
   - Click "Next Question"
   - Question appears on projector (NO options yet)

2. **Show Options**
   - Click "👁️ Show Options" button
   - 4 options (A, B, C, D) appear on projector

3. **Start Timer**
   - Click "▶️ Start 30s Timer" (main team thinking time)
   - Timer counts down in top-right corner of projector
   - "Show Correct Answer" button stays **disabled**

4. **Team Passes?**
   - Click "▶️ Start 15s Timer" (pass timer for next team)
   - Timer switches to 15 seconds

5. **Reveal Answer**
   - Wait for timer to finish (or stop manually)
   - "✅ Show Correct Answer" button becomes **active**
   - Click it → Correct option highlights in **GREEN** on projector

6. **Update Score**
   - In Score Manager section (right panel)
   - Click +10, +5, or +1 for correct answer
   - Click -10, -5, or -1 for penalties
   - Scoreboard updates live on projector

7. **Next Question**
   - Click "➡️ Next Question"
   - Repeat from step 2

---

## 🎛️ ADMIN CONTROLS REFERENCE

### **Question Control**
| Button | Function |
|--------|----------|
| 🔄 Load Question | Load selected round/question |
| ➡️ Next Question | Go to next question |
| ⬅️ Previous Question | Go back one question |
| 👁️ Show Options | Reveal 4 answer choices |
| ✅ Show Correct Answer | Highlight correct answer (enabled after timer) |

### **Timer Control**
| Button | Function |
|--------|----------|
| ▶️ Start 30s Timer | Main timer (team thinking time) |
| ▶️ Start 15s Timer | Pass timer (passed to another team) |
| ⏸️ Stop Timer | Pause timer |
| 🔄 Reset Timer | Reset to default |

### **Score Management**
- Edit team names (click and type)
- +10 / +5 / +1 for correct answers
- -10 / -5 / -1 for penalties
- 🔄 Reset individual team score
- 🗑️ Reset All Scores

---

## ⌨️ KEYBOARD SHORTCUTS

### **Admin Panel:**
- `Ctrl + →` : Next Question
- `Ctrl + ←` : Previous Question
- `Ctrl + Space` : Start/Stop Pass Timer
- `Ctrl + Enter` : Start Answer Timer
- `Ctrl + R` : Reset Timer

### **Projector View:**
- `Space` : Start/Stop Timer
- `→` : Next Question
- `←` : Previous Question

---

## 🔥 ENABLE FIREBASE SYNC (Optional)

### **For 2-Device Sync:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project → Enable Realtime Database
3. Copy your config from project settings
4. Paste into `firebase.js` (replace placeholder)
5. Done! Both computers sync in real-time

**Without Firebase:** App works perfectly on 1 computer using localStorage.

---

## 💡 PRO TIPS

✅ **Hide options at start** - builds suspense!  
✅ **Use 30s timer first** - gives teams time to discuss  
✅ **Use 15s timer** - when question is passed to another team  
✅ **Reveal answer ONLY after timer** - keeps it fair!  
✅ **Update scores immediately** - keeps everyone engaged  
✅ **Full screen the projector view** - press F11  

---

## 📝 CUSTOMIZING QUESTIONS

Edit `questions.json`:

```json
{
  "rounds": [
    {
      "id": 1,
      "name": "Round 1: Your Topic",
      "questions": [
        {
          "id": 1,
          "question": "Your question?",
          "options": ["A) Answer 1", "B) Answer 2", "C) Answer 3", "D) Answer 4"],
          "correctAnswer": "C"
        }
      ]
    }
  ]
}
```

---

## 🎯 TROUBLESHOOTING

**Options not showing?**
→ Click "Show Options" button in admin panel

**Answer button disabled?**
→ Wait for timer to finish, then it activates

**Timer not syncing?**
→ Check if both pages are open and Firebase is configured

**Scores not updating?**
→ Try "Clear Cache & Reload" in Quick Actions

---

## 🎉 READY TO HOST!

Open both files, customize your questions, and start your quiz! 🚀

**Questions?** Check `README.md` for detailed documentation.
