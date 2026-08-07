# Backend API Documentation

## Base URL
- Local: http://localhost:8080
- Render: https://<your-render-service>.onrender.com

## Health Endpoints

### GET /
Returns a simple health status payload for the API root.

Request body: none
Response type: JSON object
Response example:
```json
{
  "status": "UP",
  "service": "toy-factory-backend",
  "message": "Backend is running successfully"
}
```

### GET /health
Returns a health check payload for monitoring and load balancers.

Request body: none
Response type: JSON object
Response example:
```json
{
  "status": "UP",
  "service": "toy-factory-backend",
  "message": "Backend health check passed"
}
```

## Authentication Endpoints

### POST /api/auth/signup
Registers a new user account.

Request body (JSON):
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "role": "OPERATOR"
}
```

Required fields:
- email: string
- password: string

Optional field:
- role: string, defaults to OPERATOR

Response type: plain text string or JSON object
Success response example:
```text
User registered successfully
```

Error response example:
```text
Email already registered
```

### POST /api/auth/signin
Authenticates an existing user.

Request body (JSON):
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Required fields:
- email: string
- password: string

Response type: JSON object
Success response example:
```json
{
  "message": "Login successful",
  "email": "user@example.com",
  "role": "OPERATOR"
}
```

Error response example:
```text
Invalid email or password
```

## Machines

### GET /api/machines
Returns all machines.

Request body: none
Response type: JSON array of machine objects
Response example:
```json
[
  {
    "id": 1,
    "name": "Molding Machine 1",
    "stage": "Molding",
    "status": "RUNNING"
  }
]
```

### POST /api/machines
Creates a new machine.

Request body (JSON):
```json
{
  "name": "Molding Machine 1",
  "stage": "Molding",
  "status": "RUNNING"
}
```

Required fields:
- name: string
- stage: string
- status: string

Response type: JSON object
Response example:
```json
{
  "id": 1,
  "name": "Molding Machine 1",
  "stage": "Molding",
  "status": "RUNNING"
}
```

## Downtime Events

### GET /api/downtime-events
Returns all downtime events.

Request body: none
Response type: JSON array of downtime event objects
Response example:
```json
[
  {
    "id": 1,
    "machine": {
      "id": 1,
      "name": "Molding Machine 1",
      "stage": "Molding",
      "status": "RUNNING"
    },
    "startTime": "2026-08-06T12:00:00",
    "endTime": "2026-08-06T12:15:00",
    "cause": "Material jam"
  }
]
```

### POST /api/downtime-events
Creates a downtime event.

Request body (JSON):
```json
{
  "machine": {
    "id": 1
  },
  "startTime": "2026-08-06T12:00:00",
  "endTime": "2026-08-06T12:15:00",
  "cause": "Material jam"
}
```

Response type: JSON object
Response example:
```json
{
  "id": 1,
  "machine": {
    "id": 1
  },
  "startTime": "2026-08-06T12:00:00",
  "endTime": "2026-08-06T12:15:00",
  "cause": "Material jam"
}
```

## Sensor Readings

### GET /api/sensor-readings
Returns all sensor readings.

Request body: none
Response type: JSON array of sensor reading objects
Response example:
```json
[
  {
    "id": 1,
    "machine": {
      "id": 1,
      "name": "Molding Machine 1",
      "stage": "Molding",
      "status": "RUNNING"
    },
    "timestamp": "2026-08-06T12:00:00",
    "outputCount": 120,
    "temperature": 72.5
  }
]
```

### POST /api/sensor-readings
Creates a sensor reading.

Request body (JSON):
```json
{
  "machine": {
    "id": 1
  },
  "timestamp": "2026-08-06T12:00:00",
  "outputCount": 120,
  "temperature": 72.5
}
```

Response type: JSON object
Response example:
```json
{
  "id": 1,
  "machine": {
    "id": 1
  },
  "timestamp": "2026-08-06T12:00:00",
  "outputCount": 120,
  "temperature": 72.5
}
```

## OEE

### POST /api/oee/calculate
Calculates OEE using the supplied production metrics.

Request body (JSON):
```json
{
  "operatingTime": 480,
  "plannedProductionTime": 500,
  "idealCycleTime": 2,
  "totalCount": 200,
  "goodCount": 195
}
```

Required fields:
- operatingTime: number
- plannedProductionTime: number
- idealCycleTime: number
- totalCount: number
- goodCount: number

Response type: JSON object
Response example:
```json
{
  "availability": 0.96,
  "performance": 0.95,
  "quality": 0.975,
  "oee": 0.8874
}
```

## Notes
- The API currently accepts and returns JSON for most endpoints.
- Authentication endpoints may return plain text error/success messages rather than structured JSON.
- Swagger UI is available at /swagger-ui/index.html.
- OpenAPI JSON is available at /v3/api-docs.
