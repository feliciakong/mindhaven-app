# MindHaven 🌿✨

> **AI-Powered Personal Journaling Sanctuary**

MindHaven is an AI-powered personal journaling web application built to eliminate blank-page syndrome and make reflection effortless for beginner journalers. Built for the **Gen AI Academy APAC Edition Ideathon Challenge**, MindHaven provides a low-friction, judgment-free space to record, process, and track personal growth.

---

## 🌟 Key Features

* 🎙️ **Voice Dictation & Smart Prompts:** Speak your thoughts directly using voice-to-text or get inspired with guided reflection prompts (e.g., *"What is one small win I had today?"*).
* 🏷️ **Mood Categorization:** Automatically tag entries by mood—whether you feel **Reflective**, **Anxious**, or **Inspired**, etc.
* 📝 **Full Entry Management:** Edit, delete, and view past journal entries accompanied by exact timestamps.
* 🔒 **Secure Authentication & Data Isolation:** Built-in user authentication via Firebase Auth with isolated Firestore document storage per user.
* 🤖 **AI-Powered Reflection:** Multi-turn conversational interactions powered by Google AI Studio (Gemini API) configured with custom security directives to deliver guided insights.
* 🛡️ **Enterprise-Grade Security:** Secure API key retrieval via Google Cloud Secret Manager.
* ☁️ **Cloud Deployment:** Fully containerized with Docker, routed via Nginx, and deployed on Google Cloud Run.

---

## 🎥 Live Demo & Walkthrough

* 🔗 **Live Web Application:** [https://mindhaven-764067224695.us-central1.run.app/](https://mindhaven-764067224695.us-central1.run.app/)
* 🎬 **Video Walkthrough:** [Watch on YouTube](https://youtu.be/Rml2WJzW4Bc)

[![MindHaven Video Walkthrough](https://img.youtube.com/vi/Rml2WJzW4Bc/maxresdefault.jpg)](https://youtu.be/Rml2WJzW4Bc)

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Web Speech API |
| **Backend & Database** | Firebase Auth, Cloud Firestore |
| **AI & LLM Services** | Google AI Studio (Gemini API) |
| **Security & Secrets** | Google Cloud Secret Manager |
| **Container & Proxy** | Docker, Nginx |
| **Cloud Hosting** | Google Cloud Run (`us-central1`) |

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18+)
* npm or yarn
* Firebase Account
* Google Cloud Platform Account with Gemini API access

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/mindhaven.git](https://github.com/YOUR_USERNAME/mindhaven.git)
   cd mindhaven

  Install dependencies:
  npm install

  Configure Environment Variables:
  Create a .env file in the root directory and add your credentials:  

  Code snippet
  VITE_FIREBASE_API_KEY=your_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_app_id

  Run the development server:
  npm run dev
