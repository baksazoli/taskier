# Task Manager Web Application

## Overview
This is a simple task management web application built with Laravel and Vue.js. It allows users to manage tasks efficiently, including creating, updating, deleting, and marking tasks as completed. The application provides a user-friendly interface with filtering and sorting functionalities.

## Features
- Display a list of all tasks in a table with sorting and filtering options.
- Display total estimated and used time for selected tasks.
- Perform actions on selected tasks, such as deletion or marking as completed 
- Add new tasks.
- Edit existing tasks.
- Delete tasks.
- Load sample data for testing.

## Technologies Used
- **Backend:** Laravel 8+
- **Frontend:** Vue 3 with Vuetify
- **Database:** PostgreSQL
- **Deployment:** Laravel Sail

## Database Schema
### Tasks Table
- `id` (Primary Key)
- `description` (Task description)
- `user_id` (Assigned user ID)
- `estimated_time` (Planned time to complete the task)
- `used_time` (Actual time spent on the task)
- `created_at` (Timestamp when the task was created)
- `completed_at` (Timestamp when the task was completed, nullable)

### Users Table
- `id` (Primary Key)
- `name` (User's name)
- `email` (User's email address)

## Installation Guide
### Prerequisites
Ensure you have the following installed:
- Composer
- Docker
- Docker Compose

### Setup Instructions
1. **Clone the repository**
   ```sh
   git clone https://github.com/baksazoli/taskier
   cd ./taskier-backend
   ```
2. **Install Laravel Sail**
   ```sh
   composer require laravel/sail --dev
   ```
3. **Start the application using Sail**
   ```sh
   ./vendor/bin/sail up -d
   ```
4. **Run database migrations and seed data**
   ```sh
   ./vendor/bin/sail artisan migrate
   ./vendor/bin/sail artisan db:seed
   ```

## Usage
### Task List View
![image](https://github.com/user-attachments/assets/1b67714c-cbc5-4795-9e5c-bbfd9df0cb4c)


### Adding a New Task
![image](https://github.com/user-attachments/assets/068831dc-ca7f-4400-8fce-04b6b900925f)


### Editing a Task
![image](https://github.com/user-attachments/assets/fdd5862a-c203-423b-8bc9-0e961f010bec)


### Deleting or Completing Tasks
![image](https://github.com/user-attachments/assets/8009d67d-40bb-4070-a630-264e7a414bc4)




