# 🆘 BACKUP QUESTIONS SYSTEM - User Guide

## 📋 Overview

The Backup Questions system allows quiz administrators to quickly switch to alternative questions during a live quiz. This is essential when:
- A question is unclear or problematic
- Technical issues occur
- A question needs to be replaced due to disputes
- Any situation requiring an immediate question replacement

---

## 🎯 Features

✅ **10 Pre-loaded Backup Questions** - Ready to use immediately  
✅ **Multiple Categories** - Geography, Science, Math, History, Literature, Art  
✅ **Quick Switch** - Load backup question in seconds  
✅ **Visual Indicators** - Clear orange highlighting on both admin and projector  
✅ **Easy Return** - Switch back to normal questions with one click  
✅ **Persistent Notes** - Each backup has admin notes for context  

---

## 🚀 How to Use

### Loading a Backup Question

1. **Open Admin Panel** (`admin.html`)

2. **Find the "🆘 Backup Questions" section** in the left control panel

3. **Select a backup question** from the dropdown:
   - Shows: `#ID - Category: Question preview...`
   - Example: `#1 - Geography: What is the capital of France?...`

4. **Click "🔄 Load Backup Question"**

5. **Result:**
   - ✅ Backup question loads on both admin and projector
   - 🟠 Orange indicator shows: "🆘 BACKUP QUESTION #X"
   - 📺 Projector displays backup with orange banner
   - 📝 Admin preview shows backup notes (if available)

### Returning to Normal Questions

1. **Click "↩️ Return to Normal Question"** button

2. **Result:**
   - ✅ Returns to current round/question
   - ✅ Backup indicator disappears
   - ✅ Normal question mode restored

---

## 📺 What Participants See

### Normal Question Mode:
```
🧠 YUZONE QUIZ 🧠
Round 3: History
Question 5
[Question text here...]
```

### Backup Question Mode:
```
🧠 YUZONE QUIZ 🧠
🆘 BACKUP QUESTION - Geography    ← Orange pulsing banner
🆘 Backup Question #3              ← Orange text
[Question text here...]
```

---

## 🎨 Visual Indicators

| Location | Normal Mode | Backup Mode |
|----------|------------|-------------|
| **Admin Status** | 📋 Normal Question Mode | 🆘 BACKUP QUESTION #X (Orange) |
| **Projector Banner** | Round Name (Blue) | 🆘 BACKUP - Category (Orange) |
| **Question Number** | Question X (Blue) | 🆘 Backup Question #X (Orange) |
| **Admin Preview** | Round Name | 🆘 BACKUP - Category |

---

## 📝 Current Backup Questions

### Included in `backup-questions.json`:

1. **Geography** - Capital of France
2. **Art** - Mona Lisa painter
3. **Mathematics** - 15 × 8 calculation
4. **Science** - Red Planet identification
5. **History** - WWII end year
6. **Geography** - Largest ocean
7. **Literature** - Romeo and Juliet author
8. **Science** - Gold chemical symbol
9. **Geography** - Number of continents
10. **Mathematics** - Square root of 144

---

## ⚙️ How It Works (Technical)

### File Structure:
```
backup-questions.json
├── backupQuestions[]
    ├── id (unique number)
    ├── question (text)
    ├── options[] (A, B, C, D)
    ├── correctAnswer (letter)
    ├── category (subject)
    └── notes (admin reference)
```

### State Management:
```javascript
gameState = {
  isBackupQuestion: false,    // true when backup active
  backupQuestionId: null,     // ID of current backup
  // ... other state
}
```

### Functions:
- `loadBackupQuestion(id)` - Switch to backup
- `returnToNormalQuestion()` - Switch back to normal
- `getCurrentQuestion()` - Returns backup or normal question

---

## 🔧 Customizing Backup Questions

### To Add More Backup Questions:

1. **Open `backup-questions.json`**

2. **Add new question to array:**
```json
{
  "id": 11,
  "question": "Your question text here?",
  "options": [
    "A) Option 1",
    "B) Option 2",
    "C) Option 3",
    "D) Option 4"
  ],
  "correctAnswer": "C",
  "category": "Science",
  "notes": "Optional notes for admin"
}
```

3. **Save file**

4. **Refresh admin panel** - New backup will appear in dropdown

### Best Practices:

✅ Keep questions **general and non-controversial**  
✅ Use **varied difficulty levels**  
✅ Include **multiple categories**  
✅ Add **admin notes** for context  
✅ Test answers before using live  

---

## 🎯 When to Use Backup Questions

### ✅ Good Situations:
- Question text has typo/error
- Audio/visual not working for multimedia question
- Question is unclear to participants
- Answer is disputed
- Need to skip problematic question

### ⚠️ Avoid Using When:
- Participants have already started answering
- Scores have been assigned for current question
- Timer has expired (finish current question first)

---

## 💡 Pro Tips

### During Live Quiz:

1. **Pre-select backups** - Know which backup you'll use before quiz starts

2. **Announce clearly** - Tell participants: "We're switching to a backup question"

3. **Reset timers** - Stop/reset timer before loading backup

4. **Hide options first** - Load backup with options hidden, then reveal

5. **Use sparingly** - Too many backups can confuse participants

### Workflow:

```
Problem detected
    ↓
Stop timer
    ↓
Hide options/answer
    ↓
Select backup from dropdown
    ↓
Click "Load Backup Question"
    ↓
Announce to participants
    ↓
Start fresh timer
    ↓
Continue quiz normally
```

---

## 🧪 Testing Backup System

### Before Your Quiz:

1. **Open admin and projector in separate tabs**

2. **Load backup question #1**
   - ✅ Verify orange indicators appear
   - ✅ Check projector shows backup banner
   - ✅ Confirm question displays correctly

3. **Show options** - Verify they display

4. **Reveal answer** - Confirm correct answer highlights

5. **Return to normal question**
   - ✅ Verify indicators disappear
   - ✅ Check normal question loads

6. **Test with timer**
   - Start timer → Load backup → Timer continues

---

## 🐛 Troubleshooting

### Backup question not loading?
1. Check browser console (F12) for errors
2. Verify `backup-questions.json` exists in folder
3. Check JSON syntax is valid
4. Refresh page to reload backup questions

### Projector not showing backup indicator?
1. Hard refresh projector page (Ctrl + Shift + R)
2. Check localStorage sync is working
3. Verify both pages are from same server (http://localhost:8080)

### Dropdown is empty?
1. Wait 2 seconds after page load
2. Check console: Should say "✅ Backup questions loaded"
3. Verify `backup-questions.json` file is accessible

### Can't return to normal question?
1. Click "Return to Normal Question" button
2. If stuck, use round/question selector to reload specific question
3. Refresh page as last resort (state is saved)

---

## 📊 Backup Question JSON Schema

```json
{
  "backupQuestions": [
    {
      "id": number,              // Required: Unique identifier (1, 2, 3...)
      "question": string,        // Required: Question text
      "options": [               // Required: Array of 4 options
        "A) ...",
        "B) ...",
        "C) ...",
        "D) ..."
      ],
      "correctAnswer": string,   // Required: "A", "B", "C", or "D"
      "category": string,        // Optional: Subject/topic
      "notes": string           // Optional: Admin reference notes
    }
  ]
}
```

---

## ✅ Quick Reference

| Action | Button/Location | Result |
|--------|----------------|---------|
| Load Backup | "🔄 Load Backup Question" | Switches to backup |
| Return Normal | "↩️ Return to Normal Question" | Back to quiz |
| Check Status | Orange banner at top | Shows if backup active |
| View Notes | Admin preview panel | Shows backup notes |
| Select Backup | Dropdown in Backup section | Choose which backup |

---

## 🎉 Summary

The Backup Questions system provides **quick, professional question replacement** during live quizzes. With clear visual indicators and simple controls, you can handle any question-related issue without disrupting the quiz flow.

**Key Benefits:**
- ⚡ Instant question switching
- 🎨 Clear visual feedback
- 📝 Admin notes for context
- 🔄 Easy return to normal
- 💾 State persistence across refreshes

**Ready to use right out of the box!** 🚀

---

**Last Updated:** November 11, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
