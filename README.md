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
 
Our NestJS application follows a clean, modular architecture centered around domain-driven design principles. The core consists of three primary domains: authentication, document management, and ingestion processing. Each domain is implemented as a separate NestJS module with its own controllers, services, and repositories.
The application follows a layered architecture:
Controllers handle HTTP requests and route them to appropriate services
Services contain the business logic and orchestrate operations
Repositories (via TypeORM) handle data persistence
DTOs and entities maintain type safety throughout the application
For cross-cutting concerns, we use NestJS pipes, guards, and interceptors. For example, we have a global exception filter that standardizes error responses and a logging interceptor that tracks request durations.


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

