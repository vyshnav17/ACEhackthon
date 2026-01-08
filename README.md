# JobReady.AI 🚀
**Skill Gap Detection & Employment Readiness Platform**

JobReady.AI helps students and job seekers identifying their skill gaps against industry standards and provides a personalized roadmap to become job-ready.

## 🏆 Hackathon Project
Built for speed, user impact, and technical execution.

## 🌟 Features
- **Skill Gap Detection**: Compare your skills vs. real-world job roles (Web Dev, Data Analyst, etc.).
- **Readiness Score**: Get a 0-100 employability score based on Technical, Tools, Soft Skills, and Portfolio.
- **Visual Analytics**: Interactive Radar Chart using Chart.js.
- **Personalized Roadmap**: Step-by-step learning modules to fill identified gaps.
- **Secure Auth**: JWT-based Login/Register system.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Chart.js, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: Local JSON File System (Zero-setup, Portable)
- **Authentication**: Custom JWT Implementation

## 🚀 How to Run locally

### Prerequisites
- Node.js installed

### 1. Start the Backend
```bash
cd job-ready-ai/server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd job-ready-ai/client
npm install
npm run dev
# Client runs on http://localhost:3000
```

### 3. Open in Browser
Visit `http://localhost:3000`

## 📂 Project Structure
```
job-ready-ai/
├── client/          # Next.js Frontend
│   ├── app/         # Pages (Dashboard, Login, Register)
│   ├── components/  # UI Components (Radar Chart, Forms)
│   └── context/     # Auth State Management
└── server/          # Express Backend
    ├── routes/      # API Endpoints
    ├── services/    # Logic for Scores/Gaps
    └── data/        # JSON Databases
```

## 👥 Team
\[Your Team Name]
