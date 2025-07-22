# 📦 Asset Management Frontend (React)

This is the React-based frontend for the Asset Management System. It allows users to manage assets, vendors, GRNs, and reports with a modern, responsive UI built using Material UI.

---

## 🚀 Features

- ✅ Dashboard with navigation
- ✅ Master modules: Asset Categories, Vendors, etc.
- ✅ GRN creation/edit with Excel import/export
- ✅ Reports (GRN Register, Asset Summary)
- ✅ Toasts, confirmation dialogs, form validations
- ✅ Fully mobile responsive

---

## 📁 Project Structure

client/
├── src/
│ ├── api/ # Axios configuration
│ ├── components/ # Reusable UI components
│ ├── pages/ # Route pages (Masters, GRN, Reports, etc.)
│ ├── utils/ # Excel utils
│ └── App.js # Main App with routes


---

## 📦 Installation

```bash
cd client
npm install

npm start
```
 - The app will run at:  http://localhost:3000
- Make sure your backend is running at http://localhost:5000.

## Check src/api/axios.js and set the correct backend base URL:
    const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    });
