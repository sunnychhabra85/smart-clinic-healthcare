# Auth Service

### Authentication and Authorization microservice for smart clinic platform

## features
- JWT-based authentication (access token + refresh token)
- User registration and login
- Role-Based Access Control (RBAC)
- Password hashing with bcrpt
- MongoDB database integration
- Input validation
- Error Handling
- Request logging
- Swagger UI API documentation

## User Roles
- 'patient' - Default role for patients
- 'doctor' - Healthcare provider
- 'clinician' - Clinical staff
- 'admin' - System administrator

# User Schema
### Well Structure
This makes it robust persistanc layer

- Schema-level validation
- Password hashing hook
- Roles and status enum
- Indexes
- Selective fields 
- JSON transformation
- Instance methods