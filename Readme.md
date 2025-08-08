# Task Microservice System

A microservices-based task management system built with Node.js, Express, MongoDB, and RabbitMQ. The system consists of three main services: User Service, Task Service, and Notification Service.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │   Task Service  │    │ Notification    │
│   (Port 3001)   │    │   (Port 3002)   │    │   Service       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────┬───────────┘                       │
                     │                                   │
            ┌─────────────────┐                          │
            │    MongoDB      │                          │
            │   (Port 27017)  │                          │
            └─────────────────┘                          │
                                                         │
                     ┌─────────────────┐                 │
                     │    RabbitMQ     │─────────────────┘
                     │   (Port 5672)   │
                     └─────────────────┘
```

## 🚀 Services Overview

### User Service (Port 3001)
- Manages user data and operations
- Connected to MongoDB
- Provides REST APIs for user management

### Task Service (Port 3002)
- Manages task creation and retrieval
- Connected to MongoDB for data persistence
- Connected to RabbitMQ for message publishing
- Sends notifications when new tasks are created

### Notification Service
- Listens to RabbitMQ messages
- Processes task creation notifications
- Runs as a background consumer service

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd task-microservice
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

4. **Check service logs**
   ```bash
   # Check all services
   docker-compose logs

   # Check specific service
   docker-compose logs user-service
   docker-compose logs task-service
   docker-compose logs notification-service
   ```

## 📋 API Documentation

### User Service (http://localhost:3001)

#### Get All Users
```http
GET /users
```

**Response:**
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "__v": 0
  }
]
```

#### Create a New User
```http
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "__v": 0
}
```

#### Health Check
```http
GET /
```

**Response:**
```
Hello World
```

### Task Service (http://localhost:3002)

#### Get All Tasks
```http
GET /tasks
```

**Response:**
```json
[
  {
    "_id": "task_id",
    "title": "Sample Task",
    "description": "Task description",
    "userId": "user_id",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "__v": 0
  }
]
```

#### Create a New Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "_id": "task_id",
  "title": "New Task",
  "description": "Task description",
  "userId": "user_id",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "__v": 0
}
```

## 🧪 Testing with Postman

### Import Postman Collection

You can test the APIs using the following Postman requests:

#### 1. Create a User
- **Method:** POST
- **URL:** `http://localhost:3001/users`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Alice Smith",
    "email": "alice@example.com"
  }
  ```

#### 2. Get All Users
- **Method:** GET
- **URL:** `http://localhost:3001/users`

#### 3. Create a Task
- **Method:** POST
- **URL:** `http://localhost:3002/tasks`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Complete project setup",
    "description": "Set up the microservices architecture",
    "userId": "USER_ID_FROM_STEP_1"
  }
  ```

#### 4. Get All Tasks
- **Method:** GET
- **URL:** `http://localhost:3002/tasks`

## 🔧 Environment Configuration

### Docker Compose Services

The application runs the following containers:

- **MongoDB:** `mongo:5` - Database service on port 27017
- **RabbitMQ:** `rabbitmq:3-management` - Message broker on ports 5672 (AMQP) and 15672 (Management UI)
- **User Service:** Node.js application on port 3001
- **Task Service:** Node.js application on port 3002
- **Notification Service:** Background consumer service

### Service Dependencies

- User Service depends on MongoDB
- Task Service depends on MongoDB and RabbitMQ
- Notification Service depends on RabbitMQ

## 🎯 Message Flow

1. When a new task is created via the Task Service API
2. Task data is saved to MongoDB
3. A message is published to RabbitMQ queue `task_created`
4. Notification Service consumes the message
5. Notification is logged (can be extended to send emails, push notifications, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Stop any existing containers
   docker-compose down
   
   # Remove all containers and start fresh
   docker-compose down --volumes
   docker-compose up --build -d
   ```

2. **MongoDB Connection Issues**
   - Ensure MongoDB container is running: `docker-compose logs mongo`
   - Check if services are using correct hostname: `mongo` (not `localhost`)

3. **RabbitMQ Connection Issues**
   - Verify RabbitMQ is running: `docker-compose logs rabbitmq`
   - Check RabbitMQ management UI: http://localhost:15672 (guest/guest)

4. **Service Not Responding**
   ```bash
   # Check container status
   docker-compose ps
   
   # Check service logs
   docker-compose logs [service-name]
   
   # Restart specific service
   docker-compose restart [service-name]
   ```

### Logs and Monitoring

```bash
# Follow logs in real-time
docker-compose logs -f

# Check specific service logs
docker-compose logs user-service
docker-compose logs task-service
docker-compose logs notification-service
```

## 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down --volumes

# Stop and remove all containers, networks, and images
docker-compose down --rmi all --volumes
```

## 🔮 Future Enhancements

- [ ] Add authentication and authorization
- [ ] Implement user-specific task filtering
- [ ] Add task status updates (pending, in-progress, completed)
- [ ] Implement email notifications
- [ ] Add API rate limiting
- [ ] Implement proper error handling and validation
- [ ] Add unit and integration tests
- [ ] Implement API documentation with Swagger
- [ ] Add monitoring and health checks
- [ ] Implement database migrations

## 📝 Technical Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Message Broker:** RabbitMQ
- **Containerization:** Docker, Docker Compose
- **Package Management:** npm

## 📄 License

This project is licensed under the ISC License.
