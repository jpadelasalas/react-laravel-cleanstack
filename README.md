# react-laravel-cleanstack

A fullstack **React + Laravel** demo project with clean architecture and dummy data.  
Designed to showcase best practices for scalable code structure and separation of concerns.

---

## 📦 Tech Stack

| Layer    | Technology                         | Description                    |
| -------- | ---------------------------------- | ------------------------------ |
| Frontend | React + Vite + Axios + TailwindCSS | Modern SPA for UI              |
| Backend  | Laravel 10                         | RESTful API and database logic |
| Database | MySQL                              | Dummy data through seeding     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/jpadelasalas/react-laravel-cleanstack.git
cd react-laravel-cleanstack
```

### 2. Server Setup (Laravel)

```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3. Client Setup (React)

```bash
cd client
npm install
npm run dev
```
