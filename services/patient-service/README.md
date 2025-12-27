# Patient Service

## Features

### Core Feature

- Patient CRUD Operation
- Medical History Tracking
- Current medication tracking
- Emergency contact information
- Insurance information management
- MongoDB database integration
- Integration with auth service for authentication
- Role-based access control (RBAC)
- Input validation
- Error handling
- Request Logger
- Swagger

# Advance Pattern Implementation
- Database per service - isolate patient database
- CQRS (Command Query Responsibility Segregation) - Seperate read-optimized views for fast queries
- Event-Driver Architecture - Kafka integration for publishing patient events
- GraphQL API - Flexible GraphQL endpoints with apollo server
- REST API - Full REST endpoints with swagger documentation

----

## Implementation steps

# Phase 1: Project setup

# Step 1.1: Initialize Project
```bash
mkdir patient-service
cd patient-service
npm init -y
```

#### Step 1.2: Install core dependencies
```bash
# Express and core dependencies
npm install express cors helmet dotenv express-async-errors

# MongoDB
npm install mongoose

# Validation
npm install express-validation joi

# Logging 
npm install winston

# Swagger/openAPI
npm install swagger-ui-express swagger-jsdoc

# Development dependencies
npm install --save-dev nodemon
```

#### Step 1.3: Create project structure
```bash
mkdir -p src/{config, controllers, middleware, models, routes, services, utils, scritps, graphql}
```

### Step 1.4: Create Configuration Files
- Create `.env` file with environment variables
- Create `.src/config/index.js` for configuration management
- Create `.src/config/database.js` for MongoDB connection
- Create `.src/config/swagger.js` for Swagger Documentation

---

### Phase 2: Database Setup (Database per service pattern)

#### Step 2.1: Create Patient Model
Create `src/models/Patient.js`:
- Define Mongoose Schema with all patient fields
- Add Validation rules
- Add static methods (findByUserId, findByEmail)
- Add instance methods (addMedicalHistory, AddAllergy etc)
- Export enums (GENDER, BLOOD_TYPE, PATIENT_STATUS)

#### Step 2.2: Connect to MongoDB
- Implement `src/config/database.js` with connection logic
- Add connection error handling
- Add graceful shutdown handling

---

