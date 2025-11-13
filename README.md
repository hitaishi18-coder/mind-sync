# 🧠 MindSync – Emotion-Based Productivity Tracker  

**MindSync** is an AI-powered web app that detects your **emotions and focus level** using your webcam and typing behavior, helping you improve your productivity through personalized suggestions and visual insights.

---

## 🚀 Features  

✅ **Emotion Detection** – Real-time facial emotion tracking using TensorFlow.js and MediaPipe.  
✅ **Typing Behavior Analysis** – Tracks typing speed and consistency to infer focus levels.  
✅ **Focus Score Tracker** – Combines mood + typing patterns to generate a daily “focus score.”  
✅ **Smart Suggestions** – AI-based recommendations like:  
   - “Take a walk 🏃‍♀️”  
   - “Play some Lo-fi 🎧”  
   - “Drink water 💧”  
✅ **Analytics Dashboard** – View your emotional & productivity trends through charts and graphs.  
✅ **Authentication System** – Secure signup/login using Supabase Auth.  
✅ **Dark / Light Mode** – Fully integrated theme system using ShadCN UI.

---

## 🛠️ Tech Stack  

| Category | Technology |
|-----------|-------------|
| **Frontend** | React + Vite |
| **Styling** | Tailwind CSS + ShadCN UI |
| **Backend / Auth** | Supabase |
| **AI / ML** | TensorFlow.js, MediaPipe |
| **State Management** | React Hooks |
| **Charts / Visualization** | Recharts |
| **Hosting (optional)** | Vercel / Netlify |

---

## 📂 Folder Structure  

mind-sync/
├── src/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── Spinner.jsx
│ │ └── ui/ (ShadCN UI components)
│ ├── lib/
│ │ └── supabaseClient.js
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ └── Dashboard.jsx
│ ├── routes/
│ │ └── ProtectedRoute.jsx
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
├── package.json
└── README.md

yaml
Copy code

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/<your-username>/mind-sync.git
cd mind-sync
2️⃣ Install Dependencies
bash
Copy code
pnpm install
3️⃣ Add Environment Variables
Create a .env file in the root directory:

bash
Copy code
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4️⃣ Run the Project
bash
Copy code
pnpm run dev
Visit → http://localhost:5173

💡 Roadmap
 Authentication (Signup / Login via Supabase)

 Protected Dashboard Routes

 ShadCN UI + Dark Mode Integration

 Emotion Detection (TensorFlow.js + MediaPipe)

 Focus Score Algorithm

 Recharts Dashboard for Emotion Trends

 AI Recommendations

🧰 Future Improvements
Integrate browser notifications for break reminders

Add Spotify API for mood-based music

Enable voice emotion analysis (optional)

Build a mobile-friendly version

👩‍💻 Author
Hitaishi Lohtia
💌 LinkedIn | 🌐 Portfolio

🪪 License
This project is licensed under the MIT License – feel free to use and modify it.

✨ “MindSync — Your Mind’s Personal Productivity Partner.
