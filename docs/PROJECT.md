# NotifyAPI Project Documentation

> _NotifyAPI_ is a NestJS-based application designed to handle notifications for the AstroBookings system. It manages the creation, storage, and potentially the sending of notifications related to various events in the booking process.

## Project Architecture

### Tech Stack

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient and scalable server-side applications.
- [MikroORM](https://mikro-orm.io/): TypeScript ORM for Node.js based on Data Mapper, Unit of Work, and Identity Map patterns.
- [PostgreSQL](https://www.postgresql.org/): Open-source relational database.
- [Passport](http://www.passportjs.org/): Authentication middleware for Node.js.
- [JWT](https://jwt.io/): JSON Web Tokens for secure authentication.

### Consumes

- **PostgreSQL Database**: For storing notification data.

### Provides

- **Notification API**: Endpoints for creating and managing notifications.

### Workflow

- Install dependencies: `npm install`
- Run the app: `npm run start:dev`
- Build the app: `npm run build`
- Run tests: `npm test`
- Run end-to-end tests: `npm run test:e2e`

## Project Structure

### Core Module

> The `Core` module contains global configurations, filters, and middleware.

#### Main artifacts

- [all-exceptions.filter.ts](../src/core/all-exceptions.filter.ts): Global exception filter for handling errors.
- [logger.middleware.ts](../src/core/logger.middleware.ts): Middleware for logging requests.
- [custom-logger.service.ts](../src/core/custom-logger.service.ts): Custom logger service.
- [jwt-auth.guard.ts](../src/core/jwt-auth.guard.ts): JWT authentication guard.

### Shared Module

> The `Shared` module provides common services and utilities used across the application.

#### Main artifacts

- [id.service.ts](../src/shared/id.service.ts): Service for generating unique IDs.

### Notification Module

> The `Notification` module contains the main business logic and API endpoints for the notification system.

#### API endpoints

- `GET /api/notification/ping`: Simple ping endpoint for health checks
- `POST /api/notification`: Create new notifications based on an event
- `GET /api/notification/pending`: Retrieve all pending notifications
- `GET /api/notification/user/pending`: Retrieve and mark as read top 10 pending notifications for the authenticated user
- `POST /api/notification/:id/send`: Send a specific notification by ID

#### Main artifacts

- [notification.controller.ts](../src/api/notification/notification.controller.ts): Controller for handling notification-related requests.
- [notification.service.ts](../src/api/notification/services/notification.service.ts): Service for processing notification logic.
- [notification.entity.ts](../src/api/notification/services/notification.entity.ts): Entity representing a notification in the database.
- [template.entity.ts](../src/api/notification/services/template.entity.ts): Entity representing a notification template.
- [event.dto.ts](../src/api/notification/models/event.dto.ts): Data Transfer Object for notification events.
- [notification.type.ts](../src/api/notification/models/notification.type.ts): Type definitions for notifications.

### Admin Module

> The `Admin` module handles administrative and maintenance functions.

#### API endpoints

- `POST /api/admin/regenerate-db`: Regenerate the database
- `POST /api/admin/test`: Test endpoint for the admin module functionality

#### Main artifacts

- [admin.controller.ts](../src/api/admin/admin.controller.ts): Controller for admin-related requests.
- [admin.service.ts](../src/api/admin/admin.service.ts): Service for admin-related logic.

## Configuration

The project uses environment-based configuration:

- [.env](../.env): Production environment variables.
- [.env.development](../.env.development): Development environment variables.

## Conclusion

NotifyAPI is a crucial component of the AstroBookings system, responsible for managing notifications. It provides a scalable and maintainable structure for handling various types of notifications, from creation to potential delivery. The use of NestJS and MikroORM ensures a robust and type-safe backend, while PostgreSQL offers reliable data storage for notifications and templates. The addition of an Admin module allows for administrative functions and system maintenance.

> End of the project documentation.
