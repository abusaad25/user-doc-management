# 🧾 Project Title

Document Management System with RBAC using NestJS and PostgreSQL

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

---

## 📖 About the Project

This project is a full-featured backend built using NestJS. It includes:

- User Authentication with JWT
- Role-based Access Control (Admin/User)
- Document Uploading & Management
- PostgreSQL Database with TypeORM
- Scalable & Modular Code Structure
- Secure Endpoints with Guards & Decorators

---

## 🏗️ Architecture

Client (Frontend)
     |
     | HTTP Requests (REST API)
     v
NestJS Backend
 ├── Auth Module (Login/Register/JWT)
 ├── Users Module (RBAC)
 ├── Documents Module (CRUD)
 └── PostgreSQL (TypeORM)

 
- Modular design: Each feature in its own module
- Middleware & Interceptors for request validation and logging
- Guards for protecting routes based on user roles

---

## 📊 Entity-Relationship Diagram

You can include this diagram visually using [dbdiagram.io](https://dbdiagram.io/) or draw it manually.

+-----------+         +-----------+         +-------------+
|   Users   | 1     N | Documents |         |   Roles     |
+-----------+         +-----------+         +-------------+
| id        |         | id        |         | id          |
| email     |         | title     |         | name        |
| password  |         | userId FK |         +-------------+
| roleId FK |         +-----------+
+-----------+

---

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: class-validator / class-transformer
- **Scheduling**: @nestjs/schedule (if used)
- **Config**: @nestjs/config
- **Other**: Multer (for file uploads), Helmet, CORS

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL installed locally or via Docker
- `npm` or `yarn`

### Clone the repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install dependencies
npm install
# or
yarn install

Setup environment variables
Create a .env file in the root:
DATABASE_URL=postgres://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=3000

🏃‍♂️ Running the Application
Start development server
npm run start:dev

Build for production
npm run build
npm run start:prod

API Endpoints (Sample)
Method	Endpoint	Description	Auth Required
POST	/auth/register	Register a new user	❌
POST	/auth/login	Login user, return token	❌
GET	/users/me	Get logged-in user info	✅
POST	/documents	Upload document	✅ (User)
GET	/documents	Get all docs (Admin)	✅ (Admin)

📁 Folder Structure
src/
├── auth/
├── users/
├── documents/
├── config/
├── common/
│   ├── decorators/
│   ├── guards/
│   └── interceptors/
├── database/
├── main.ts

