# 🩸 Blood Donation AI Platform (Sanguis AI)

An open-source, full-stack ecosystem designed to optimize the blood donation process. It operates as a multi-role web platform connecting **Hospitals**, **Donors**, and **Administrators** via an advanced AI framework.

## 🌟 Key Features

1. **Role-Based Portals (MVC Architecture)**
   - **Hospital Workspace**: Allows medical staff to input real-time emergency requests.
   - **Donor Dashboard**: Donors can track their eligibility and receive local, push-emergency alerts.
   - **Admin Panel**: High-level network statistics and user management.

2. **Google Gemini NLP Extraction**
   - Medical staff can simply type natural language (e.g., *"Patient needs 2 units of O- urgently for a surgery in Chennai"*). The API uses Gemini to extract the precise units, blood type, urgency, and location.

3. **Predictive Analytics (Scikit-Learn)**
   - A trained machine learning model runs on all requests to evaluate prioritization and predict optimal blood bank routing strategies.

4. **Secure Infrastructure**
   - **JWT Authentication** and `bcrypt` password hashing.
   - Direct integration with **MongoDB** for persistent data storage.

---

## 🛠️ Technology Stack
- **Frontend Layer (View)**: React, Vite, React Router, custom CSS Glassmorphism
- **Backend Layer (Controllers/Models)**: Python FastAPI, Pydantic, Passlib
- **Database**: Asynchronous MongoDB (`motor`)
- **Artificial Intelligence**: Google Generative AI (Gemini Flash), Scikit-Learn

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js (for React)
- Local or Cloud MongoDB instance (default port `27017`)

### 1. Backend Setup
Clone the repository and install the Python dependencies.
```bash
git clone https://github.com/Ram-sah19/blood-donation-ai.git
cd blood-donation-ai
pip install -r requirements.txt
```

Create a `.env` file at the root to hold your API keys securely:
```env
GEMINI_API_KEY=your_gemini_key_here
JWT_SECRET_KEY=generate_a_random_secure_string
MONGO_URI=mongodb://localhost:27017
```

Start the FastAPI application:
```bash
python -m uvicorn backend.main:app --reload
```

### 2. Frontend Setup
Open a new terminal and initialize the React application:
```bash
cd frontend
npm install
npm run dev
```

Your platform will now be running visibly at `http://localhost:5173`!

---

## 🤝 Contributing
Feel free to fork the repository and submit a pull request!
For major structural changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
