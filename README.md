# Smart-Campus

A web-based application designed to streamline campus operations by integrating student management, facility handling, announcements, and service requests into a single platform. The system improves efficiency, communication, and accessibility for students, staff, and administrators within a smart campus environment.

---

## Incident Ticketing Module

This module allows students and staff to report campus incidents (maintenance, IT, security, etc.) and track their resolution through a structured workflow.

### Tech Stack
- **Backend**: Spring Boot 3.2.5, Java 17, Spring Security (JWT + OAuth2), Spring Data JPA
- **Frontend**: React 19, Ant Design (AntD), Tailwind CSS, Axios
- **Database**: H2 (In-Memory, development) / MySQL (Production)

---

## API Endpoints

| Method   | Endpoint                                  | Auth Required | Role            | Status Code   |
|----------|-------------------------------------------|---------------|-----------------|---------------|
| `POST`   | `/api/tickets`                            | Yes           | Any Auth User   | `201 Created` |
| `GET`    | `/api/tickets/{id}`                       | Yes           | Any Auth User   | `200 OK`      |
| `PATCH`  | `/api/tickets/{id}/status`               | Yes           | ADMIN, TECHNICIAN | `200 OK`  |
| `DELETE` | `/api/tickets/{id}/comments/{cid}`       | Yes           | Comment Owner   | `204 No Content` / `403 Forbidden` |

### Ticket Status Workflow
Tickets follow a strict one-way state machine enforced at the service layer:

```
OPEN --> IN_PROGRESS --> RESOLVED
```
Any attempt to skip a state or revert will throw an `IllegalStateException`.

### File Attachments
- Maximum **3 images** per ticket (JPEG or PNG only).
- Files are saved locally under `/uploads/tickets/` with UUID-based filenames to prevent path traversal attacks.

---

## Running the Application

### Backend
```bash
./mvnw.cmd clean spring-boot:run
```
Backend runs on: `http://localhost:8082`

By default the backend uses an in-memory H2 database (configured in `src/main/resources/application.properties`).
To use MySQL instead, set environment variables before running:

- `DB_URL` (example: `jdbc:mysql://HOST:PORT/DB_NAME`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_DRIVER` (example: `com.mysql.cj.jdbc.Driver`)

### Frontend
```bash
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

---

## Postman Testing Evidence

Import `Ticketing_Assessment.postman_collection.json` from the project root into Postman to run all four endpoint tests with pre-written assertions verifying the correct HTTP status codes.

---

## ⚠️ AI Assistance Disclosure

> **In compliance with SLIIT academic integrity and transparency requirements**, portions of the boilerplate code in this module were developed with the structural assistance of an AI coding assistant (Google DeepMind Antigravity).
>
> **Specifically, AI assistance was used for:**
> - Generating JPA entity scaffolding (field definitions, annotations).
> - Structuring Spring Security RBAC rules and JWT filter patterns.
> - Scaffolding Ant Design React component JSX templates.
>
> **The student is responsible for:**
> - Understanding all logic, data flow, and design decisions.
> - Customizing and integrating the generated code with the existing project.
> - Debugging, testing, and verifying all functionality.
> - All business logic decisions including state machine rules and validation constraints.
>
> The use of AI tools for code assistance is permitted under the assessment guidelines, provided it is clearly disclosed here.
