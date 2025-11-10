# 💰 MERN Budget Tracker  
A full–stack personal finance management app built using **MongoDB, Express.js, React, Node.js**, with charts, budgets, CSV imports, insights, and authentication using JWT + HTTP-only cookies.

This app gives real–time dashboards, 6-month finance trends, automatic insights, and CSV transaction uploads.


## 🚀 Live Demo  
https://buget-tracker-iota.vercel.app/  

## 🛠️ Tech Stack

### **Frontend**
- React + Vite  
- TailwindCSS  
- ShadCN UI  
- Framer Motion  
- Recharts  
- Axios (with credentials)  
- React Router v6  
- Lucide Icons  

### **Backend**
- Node.js  
- Express.js  
- MongoDB / Mongoose  
- JWT Auth with HTTP-only Cookies  
- Multer (CSV imports)  
- CORS with credentials  
- Express Rate Limit  
- Helmet + Morgan  


## ✨ Features

✅ User Authentication (Register / Login / Logout)  
✅ Secure JWT HTTP-only Cookie  
✅ Dashboard with monthly summary  
✅ Income, Expense & Net balance  
✅ 6-month Trend Chart  
✅ Category-wise expense visualization  
✅ Budget creation, comparison & overspend alerts  
✅ CSV Transaction Upload  
✅ Auto Insights & Recommendations  
✅ Transaction Search + Pagination  
✅ Fully responsive UI with modern animations  

## ⚙️ Environment Variables

### **Backend `.env`**

PORT=4000

MONGO_URI=your-mongodb-uri

JWT_SECRET=your-secret

CLIENT_URL=http://localhost:5173 # Or your deployed frontend URL

NODE_ENV=production

## ⚙️ Installation & Setup

### ✅ **Clone**

git clone https://github.com/your-username/budget-tracker.git

cd budget-tracker

✅ Install Backend

cd server

npm install

npm run dev

✅ Install Frontend

cd client

npm install

npm run dev

🔌 API Routes Overview

Auth Routes

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET  /api/auth/me

Transactions

GET    /api/transactions

POST   /api/transactions

DELETE /api/transactions/:id

POST   /api/transactions/import/csv

Budgets

GET    /api/budgets

POST   /api/budgets

DELETE /api/budgets/:id

Insights

GET /api/insights/summary?month=YYYY-MM

GET /api/insights/trend?months=6

📊 Screenshots 

Add images after deployment

##[Login]

<img width="566" height="353" alt="image" src="https://github.com/user-attachments/assets/110bf6fb-8cb3-4a58-b6a7-24f0b84d2c53" />


##[Dashboard]

<img width="1114" height="671" alt="image" src="https://github.com/user-attachments/assets/96eaff56-ec20-4b7f-ac93-282e97ec274b" />


##[Transactions]

<img width="1127" height="1099" alt="image" src="https://github.com/user-attachments/assets/ef4fa534-3d5c-42df-9227-079737bbb32d" />


##[Budgets]

<img width="1087" height="465" alt="image" src="https://github.com/user-attachments/assets/fdfd1690-d29d-4e9b-9c40-ab636514724a" />


##[Insights]

<img width="1118" height="758" alt="image" src="https://github.com/user-attachments/assets/ab05b35f-a18d-4654-9913-d123361e1ee2" />


🤝 Contributing

Pull requests are welcome.

📄 License

MIT License © sanjay aggi
