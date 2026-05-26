# ANSWERS.md

Project: Persistent Todo Mini-App  
Student: Zain Muhai-Ul-Din  
Stack: HTML + CSS + JavaScript (Frontend only, no backend for this Todo-App)

---

## 1. How to Run

**On a fresh machine (no installation needed):**

1. Download the project folder `todo-app/`
2. Open the folder
3. Double-click `index.html`
4. It opens in any browser (Chrome, Firefox, Edge)
5. Done — the app runs immediately

**Optional (for developers using VS Code):**
- Install the "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"
- App runs at `http://127.0.0.1:5500`

**Nothing to install.** No Node.js, no npm, no backend. Pure HTML/CSS/JS.

---

## 2. Stack Choice

**I chose plain HTML + CSS + JavaScript** because:

- The project needs to run on any machine without installing anything
- A simple todo app does not need a full React setup or a server
- `localStorage` handles data persistence perfectly for a browser app — data stays saved even after closing the tab
- I already know HTML, CSS, and JavaScript well from my projects

**A worse choice would have been:**  
Using a full MERN stack (MongoDB + Express + Node.js + React) for this.  
It would be overkill — the instructor would have to install Node.js, MongoDB, and run `npm install` just to see a todo list. Way too complex for what the app needs to do.

---

## 3. One Real Edge Case

**Edge Case: Preventing XSS (Cross-Site Scripting)**

**File:** `app.js`  
**Function:** `escapeHTML()` — around line 140

**What it is:**  
If a user types something like `<script>alert("hacked")</script>` as a task name, and we just put it directly into the HTML, the browser would actually *run* that JavaScript code. This is called an XSS attack.

**How I handled it:**  
I wrote a function `escapeHTML()` that replaces dangerous characters like `<`, `>`, `"` with their safe versions (`&lt;`, `&gt;`, `&quot;`) before putting the text into the page.

**Without this handling:**  
A user could type a script tag into the task input, and it would run as real JavaScript in the browser — potentially stealing data or breaking the app.

---

## 4. AI Usage

**Tool used:** Claude (claude.ai)

**What I asked:**  
I asked Claude to help me build the style.css file for Todo app to make it more attractive and appealing for the users — CSS styling, and partial JavaScript logic.

**What Claude gave me:**  
Partial working code for (`style.css`, `app.js`), including priority levels, search, filter tabs, and XSS protection.

**What I changed:**  
I reviewed the `escapeHTML` function and the duplicate detection logic. I asked Claude to explain them in beginner-friendly terms so I could understand what they do and explain them myself. I also asked to add the "duplicate task prevention" feature, which was not in the first version — Claude added it after my request. I made sure I understood each part of the code before submitting.

---

## 5. Honest Gap

**What is not good enough:**  
The storage is browser `localStorage`, which means tasks are only saved in that specific browser on that specific device. If you open the app in a different browser or on a different computer, your tasks are gone.

**What I would do with one more day:**  
I would add a simple Node.js + Express backend with a MongoDB database (since I know the basics of MERN stack). Users would save tasks to a real database on a server, so they could access their tasks from anywhere. I would also add a simple login with a username and password so each user sees only their own tasks.

---

Submitted by Zain Muhai-Ul-Din — BS Computer Science, University of South Asia
