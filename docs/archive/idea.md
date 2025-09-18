I want you to build me a complete MERN stack Kanban Board / Task Tracker project.

Project Requirements

Tech stack: MongoDB, Express, React, Node.

No 3rd party AI APIs or external paid services.

Full CRUD functionality for tasks and boards.

Use REST API for backend communication.

Use React with TailwindCSS or Material UI for frontend styling.

Use react-beautiful-dnd (or similar) for drag-and-drop functionality.

Features

Board & Columns

Default columns: To Do, In Progress, Done.

Support adding/removing columns.

Columns order should be saved in DB.

Tasks

Each task has: title, description, status, priority, dueDate, labels.

Tasks can be created, updated, moved between columns, and deleted.

Drag-and-drop updates status in DB automatically.

Search & Filters

Search tasks by title/description.

Filter by priority, labels, or due date.

Optional Enhancements

Dark mode toggle.

Activity log (task moved/updated).

Analytics: show number of tasks per column.

Export board as JSON.

Authentication (Optional)

JWT-based signup/login.

Each user has their own board and tasks.

Backend (Node + Express)

REST API endpoints:

POST /api/tasks → Create task

GET /api/tasks → Get all tasks (by board/user)

PUT /api/tasks/:id → Update task

DELETE /api/tasks/:id → Delete task

PUT /api/columns/:id → Update column names/order

Use MongoDB with collections:

Users { id, name, email, passwordHash }

Boards { id, title, ownerId, columns: [ { name, order } ] }

Tasks { id, boardId, title, description, status, priority, dueDate, labels, createdAt }

Frontend (React)

Columns displayed as drag-and-drop lists.

Each task is a draggable card.

Task details can be edited via a modal or side panel.

Dark mode and filters available in UI.

Deliverables

A backend folder with Express + MongoDB API.

A frontend folder with React app (TailwindCSS or MUI).

Both connected and working end-to-end.

Include a README with setup instructions.

Goals

Demonstrate full-stack MERN skills.

Show drag-and-drop + CRUD interactions.

Clean, maintainable code structure.

Start by scaffolding the folder structure (backend, frontend) and then implement backend APIs, frontend UI, and drag-and-drop logic step by step.