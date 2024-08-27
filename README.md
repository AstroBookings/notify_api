# 🚀 AstroBookings: 🧑‍💼 NotifyAPI

## [🚀 AstroBookings](https://github.com/AstroBookings)

> A sample project for teaching full-stack development with modern technology and proven best practices.

> 📋 [0. Project Summary Briefing](https://github.com/AstroBookings/.github/blob/main/profile/0-project.briefing.md)

> 📋 [2. System Architecture](https://github.com/AstroBookings/.github/blob/main/profile/2-design/2-system.architecture.md)

> 📋 [3. Model ERD](https://github.com/AstroBookings/.github/blob/main/profile/2-design/3-model.erd.md)

## 🧑‍💼 NotifyAPI

Manages the notification system for the entire platform, handling email notifications for various events such as booking confirmations, launch updates, and system alerts. This API coordinates the creation, queuing, and sending of notifications to users.

Built with **NestJS** and **TypeScript** for efficient message handling and delivery, leveraging NestJS's powerful module system for organized code structure.

### Implemented domains

- [x] [Notification Domain API](./docs/6_4-notification.api.md)

#### ⬇️ Consumes:

- [`🧑‍💼 SystemAPI`](https://github.com/AstroBookings/system_api/): Authentication and monitoring
- [`📇 OperationsDB`](https://github.com/AstroBookings/.github/blob/main/profile/3-implementation/5_1-operations.schema.md): To store notification queues and user communication preferences
- `👽 EmailSvc`: To send out email notifications

#### ⬆️ Provides for:

- Other APIs: Notification sending capabilities

## 📚 Repository Instructions

To **run** the project, follow these steps:

```shell
# clone the project
git clone https://github.com/AstroBookings/notify-api.git
cd notify-api
# install the dependencies
npm install
# run the project
npm run start
# open at http://localhost:3000/notification/test
```

To **test** the project, follow these steps:

```shell
# run the tests
npm run test
# run the tests in e2e mode
npm run test:e2e
```

To **develop** the project, follow these steps:

```shell
# run the project in watch mode
npm run start:dev
# run the tests in watch mode
npm run test:watch

```

---

## [🚀 AstroBookings](https://github.com/AstroBookings)

> [!NOTE]
>
> > _[Alberto Basalo](https://github.com/albertobasalo)_ >> _Elevating Code Quality._
