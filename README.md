# 🎓 Smart Student Management System

A full-stack **MERN** web application for managing student records — built with MongoDB, Express.js, React.js, and Node.js. Designed as a clean, professional tool for educational administrators to add, view, edit, search, and delete student data with ease.

---

## ✨ Features

- **Dashboard** — Total, active, inactive student counts + recently added students
- **Add Student** — Validated form to register new students with all required details
- **View Students** — Searchable and filterable table of all student records
- **Edit Student** — Pre-filled form to update existing student information
- **Delete Student** — Confirmation modal before permanent deletion
- **Search & Filter** — Search by name, roll number, email, or course; filter by status
- **Toast Notifications** — Success and error feedback on every action
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Loading States** — Spinners and empty states throughout the app
- **Input Validation** — Both frontend and backend validation with helpful error messages

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Vite   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose ODM             |
| Styling    | Custom CSS (CSS Variables)        |
| HTTP       | Axios                             |
| Dev Tools  | Nodemon, ESLint                   |

---

## 📁 Project Structure

```
student-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── studentController.js   # CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   └── Student.js             # Mongoose schema
│   ├── routes/
│   │   └── studentRoutes.js       # API routes
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteModal.jsx    # Confirmation modal
│   │   │   ├── EmptyState.jsx     # Empty placeholder
│   │   │   ├── Input.jsx          # Reusable input field
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Spinner.jsx        # Loading spinner
│   │   │   ├── StudentForm.jsx    # Add/Edit form
│   │   │   └── Topbar.jsx         # Top header bar
│   │   ├── hooks/
│   │   │   └── useToast.jsx       # Toast notification context
│   │   ├── pages/
│   │   │   ├── AddStudent.jsx     # Add student page
│   │   │   ├── Dashboard.jsx      # Dashboard page
│   │   │   ├── EditStudent.jsx    # Edit student page
│   │   │   └── StudentList.jsx    # All students page
│   │   ├── services/
│   │   │   └── api.js             # Axios API calls
│   │   ├── App.jsx                # App + routing
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # React entry point
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 📸 Screenshots

> _Add your screenshots here after running the app._

- Dashboard
![alt text](<Screenshot 2026-05-02 120858.png>)
- Student List with Search
![alt text](<Screenshot 2026-05-02 120928.png>)
- Add Student Form
![alt text](<Screenshot 2026-05-02 120954.png>)
- Edit Student Form
![alt text](<Screenshot 2026-05-02 121024.png>)
- Delete Confirmation Modal
![alt text](<Screenshot 2026-05-02 121049.png>)

-Notification
![alt text](<Screenshot 2026-05-02 121347.png>)

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ installed
- MongoDB running locally (or a MongoDB Atlas URI)
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/Ramaraju2005/student-management-system.git
cd student-management-system
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create / update the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/student_management
NODE_ENV=development
```

Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will run at: `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

Create / update the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app will run at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/health`             | Health check             |
| GET    | `/api/students/stats`     | Dashboard statistics     |
| GET    | `/api/students`           | Get all students         |
| GET    | `/api/students?search=x`  | Search students          |
| GET    | `/api/students?status=Active` | Filter by status     |
| GET    | `/api/students/:id`       | Get single student       |
| POST   | `/api/students`           | Create new student       |
| PUT    | `/api/students/:id`       | Update student           |
| DELETE | `/api/students/:id`       | Delete student           |

### Sample POST Body

```json
{
  "fullName": "Arjun Sharma",
  "rollNumber": "CS2024001",
  "email": "arjun@example.com",
  "phone": "+91 98765 43210",
  "course": "B.Tech",
  "department": "Computer Science",
  "year": "2nd Year",
  "status": "Active",
  "address": "123 Main Street, Hyderabad, Telangana"
}
```

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

| Variable    | Description                          | Default                                      |
|-------------|--------------------------------------|----------------------------------------------|
| `PORT`      | Port for Express server              | `5000`                                       |
| `MONGO_URI` | MongoDB connection string            | `mongodb://localhost:27017/student_management` |
| `NODE_ENV`  | Environment mode                     | `development`                                |

### Frontend (`frontend/.env`)

| Variable        | Description                  | Default                        |
|-----------------|------------------------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL         | `http://localhost:5000/api`    |

---

## 🧪 Testing the API

You can test the API using tools like **Postman** or **Thunder Client**.

**Check health:**
```
GET http://localhost:5000/api/health
```

**Create a student:**
```
POST http://localhost:5000/api/students
Content-Type: application/json
```

---

## 🔮 Future Improvements

- [ ] Authentication & role-based access (Admin / Viewer)
- [ ] Export student data to CSV / PDF
- [ ] Pagination for large datasets
- [ ] Student profile detail page
- [ ] Bulk import students via CSV upload
- [ ] Attendance and grade tracking
- [ ] Email notifications
- [ ] Dark mode support
- [ ] Charts for enrollment statistics

---

## 👤 Author

Built as an internship project submission.  
Feel free to fork, customize, and improve!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
