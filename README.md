# 🩺 MedAssist AI

**MedAssist AI** is a modern, full‑screen medical chatbot that provides quick, reliable medical information and assistance through natural, conversational AI.  
Built with a **React frontend** and a **FastAPI backend** powered by **Google Gemini AI**, it supports voice input, image & prescription uploads, and Markdown‑formatted, conversational responses.

---

## 🚀 Features

- 💬 **Conversational Chat Interface**  
  Rich, markdown‑formatted AI responses with bold text, lists, and more.

- 🎙 **Voice Input**  
  Speak directly to the chatbot using built‑in speech recognition.

- 🖼 **Image & Prescription Uploads**  
  Upload medical images *or* prescription images/PDFs for AI analysis (with OCR).

- 📄 **Markdown Rendering**  
  AI messages support headings, bold, lists, and other markdown syntax.

- ⚡ **Full‑Screen Modern UI**  
  Responsive glassmorphism design with a professional blue‑gray theme.

- 🔒 **Error‑Safe Code**  
  Backend always returns safe strings; frontend sanitizes inputs to prevent rendering issues.

---

## 🛠 Tech Stack

**Frontend:**
- React
- react-markdown
- react-icons
- HTML5 SpeechRecognition API

**Backend:**
- FastAPI
- Google Gemini AI (`google-genai`)
- Pillow (image handling)
- SpeechRecognition (voice processing)
- python-multipart (file uploads)

---

## 📦 Installation

### 1️⃣ Backend Setup (FastAPI)

Clone repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME/backend

Create and activate virtual environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

Install dependencies
pip install -r requirements.txt

text

**`requirements.txt` example:**
fastapi
uvicorn[standard]
google-genai
pillow
speechrecognition
python-multipart

text

**Run backend:**
uvicorn app:app --reload

text
Backend will run at `http://localhost:8000`.

---

### 2️⃣ Frontend Setup (React)

cd ../frontend
npm install
npm start

text

Frontend will run at `http://localhost:3000`.

---

## 📂 Project Structure

project-root/
├── backend/
│ ├── app.py # FastAPI backend
│ ├── requirements.txt
│ └── ...other backend files
├── frontend/
│ ├── src/
│ │ └── App.js # React frontend UI
│ ├── package.json
│ └── ...
└── README.md


---

## 💡 Usage

1. Open the app in your browser (`http://localhost:3000`).
2. Type a question, click 🎙️ to speak, or 🖼️ to upload an image/prescription.
3. AI responds in markdown with clean, readable formatting.
4. Conversation history is displayed in full‑screen chat view.

---

## 📌 Future Enhancements

- Persistent chat history
- User accounts and secure data storage
- Multilingual support
- Smart reminders & notifications
- Integration with medical APIs & IoT health devices

---

## 🤝 Contributing

Contributions are welcome!  
Fork the repo, create a branch, make changes, and submit a pull request.

---

## 📜 License

This project is for educational and informational purposes only and should **not** be used as a substitute for professional medical advice.

---
