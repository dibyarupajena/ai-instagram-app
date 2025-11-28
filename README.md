# AI-Powered Instagram Clone

This is an AI-powered Instagram-like application built using **Next.js, Tailwind CSS, Redux, and Node.js with MongoDB**. The app generates AI-based posts and allows users to interact with them.

---

## 📁 Project Structure
```
ai-instagram/
│── backend/      # Express.js backend with MongoDB
│── frontend/     # Next.js frontend with Tailwind CSS & Redux
│── README.md     # Project documentation
│── .gitignore    # Git ignored files
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```sh
git clone <YOUR_REPO_URL>
cd ai-instagram
```

---

## 🖥️ Backend Setup

### 2️⃣ Navigate to Backend
```sh
cd backend
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Create a `.env` File
Inside the `backend/` folder, create a `.env` file and add:
```
MONGODB_URII=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

```

### 5️⃣ Start the Backend Server
```sh
npm start
```
The backend will start on **http://localhost:5000**.

---

## 🎨 Frontend Setup

### 6️⃣ Navigate to Frontend
```sh
cd ../frontend
```

### 7️⃣ Install Dependencies
```sh
npm install
```

### 8️⃣ Start the Frontend Server
```sh
npm run dev
```
The frontend will start on **http://localhost:3000**.

---

## 🛠️ Key Features
✅ AI-Generated Posts  
✅ Like & Interact with Posts  
✅ Clean & Modern UI with Tailwind CSS  
✅ Fully Functional Backend with MongoDB  

---

## 🔗 Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Redux  
- **Backend:** Node.js, Express.js, MongoDB  
- **AI Integration:** OpenAI API

---

## 📷 Preview
![App Screenshot](screenshot.png)

---

## 💡 Notes
- Ensure MongoDB is running before starting the backend.
- Use the correct `.env` keys.
- The frontend fetches posts from the backend automatically.
- need to awaken the mongo.db cluster which may sleep due to prolonged inactivity

Happy Coding! 🚀
