# AstroBookings: Notification API

> This document describes the implementation details for the `4. Notification` domain of the AstroBookings project at the `🧑‍💼 SystemAPI` level.

## Features and scenarios

### 4.1 Send launch-related notifications to agencies

> 📋 ToDo: reformulate feature with scenarios, based on current implementation

```gherkin
Feature: Send launch-related (bookings, invoices) notifications to agencies
  As an agency, I want to receive notifications about launch-related events, so that I can stay informed about the status of my launches.

  Scenario: Send a notification about a launch status change
    Given the API is available
    When the system sends a POST request to "/api/notification/" with the following data:
      | event |  data |
      | "booking_confirmed" |  "1" |
    Then the response should have a status code of 200
    And the notification data to be sent to the agency
        | recipient_email | subject | message |
        | "agency@example.com" | "New booking for your launch" | "You have a new booking for launch 1" |

  Scenario: Send a notification about a launch status change
    As a Traveler, I want to receive a notification about a launch status change, so that I can stay informed about the status of my launch.

    Given the API is available
    When the system sends a POST request to "/api/notification/" with the following data:
      | event |  data |
      | "launch_scheduled" |  "1" |
    Then the response should have a status code of 200
    And the notification data to be sent to the traveler
        | recipient_email | subject | message |
        | "agency@example.com" | "New launch scheduled" | "You have a new launch scheduled for launch 1" |

Feature: Get all pending notifications
  As an IT employee, I want to get all pending notifications, so that I can send them.

  Scenario: Get all pending notifications
    Given the API is available
    When the system sends a GET request to "/api/notification/pending"
    Then the response should have a status code of 200
    And the notifications data to be sent to the user

Feature: Send a notification
  As an IT employee, I want to send a notification to a user, so that I can inform them about an event.

  Scenario: Send a notification to a user
    Given the API is available
    When the system sends a POST request to "/api/notification/id/send"
    Then the response should have a status code of 200
    And the notification should be saved with status "sent"

Feature: Show pending notifications for a user
  As a user, I want to see my pending notifications, so that I can stay informed about the status of my launches.

  Scenario: Get pending notifications for a user
    Given the API is available
    When the system sends a GET request to "/api/notification/user/pending"
    Then the response should have a status code of 200
    And the notifications data to be sent to the user
```

## NestJs Implementation

### Project 🧑‍💼 NotifyAPI setup

The `Notification` domain is part of the `NotifyAPI` project, which is a NestJs application using TypeORM to access Postgres.

To create the project, run the following command:

```shell
npm i -g @nestjs/cli
nest new NotifyAPI
cd notify-api
npm i @nestjs/mapped-types class-validator class-transformer
npm i @mikro-orm/core @mikro-orm/nestjs @mikro-orm/postgresql
npm i @nestjs/jwt @nestjs/passport passport passport-jwt
npm i snowyflake
```

Core artifacts and shared module.

> Will be part of a library in the future

```shell
nest g filter core/all-exceptions --flat --no-spec
nest g middleware core/logger --flat --no-spec

nest g module shared
nest g service shared/id --flat
```

### API Notification Endpoints

The following endpoints are available for the `Notification` domain:

- `POST /api/notification/event`: Save a notification event

```shell
nest g module api/notification
nest g controller api/notification
nest g module api/notification/services/notification-services --flat
nest g service api/notification/services/notification --flat
```

## Data Model for DTOs

Those are the required DTOs for the API with `NestJs Validation` and `class-validator`:

```shell
nest g class api/notification/models/event.dto --flat --no-spec
nest g class api/notification/models/notification.type --flat --no-spec
nest g class api/notification/models/template-event.type --flat --no-spec

```

```typescript
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export type TemplateEvent =
  | 'launch_scheduled'
  | 'launch_confirmed'
  | 'launch_launched'
  | 'launch_delayed'
  | 'launch_aborted'
  | 'booking_confirmed'
  | 'booking_canceled'
  | 'invoice_issued';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  name: TemplateEvent;

  @IsObject()
  data: string;
}

export type Notification = {
  id: string;
  recipientEmail: string;
  subject: string;
  message: string;
};
```

## Data Model for Entities

Those are the required entities for the API with `TypeORM` interacting with the **Postgres** database `📇 OperationsDB`:

### Notification Entity

- Represents messages sent to system users about various events

```shell
nest g module api/notification/services/notification-status.type --flat --no-spec
nest g class api/notification/services/notification.entity --flat --no-spec
nest g class api/notification/services/template.entity --flat --no-spec
```

```typescript
import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
/**
 * Notification status enum
 */
export type NotificationStatus = 'pending' | 'sent' | 'failed';

/**
 * Notification entity
 * @description Entity for read/write on notifications table
 */
@Entity({ tableName: 'notifications' })
export class NotificationEntity {
  /**
   * Primary key
   */
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => TemplateEntity)
  template!: TemplateEntity;

  /**
   * Recipient's email address
   */
  @Property()
  recipientEmail!: string;

  /**
   * Notification subject
   */
  @Property()
  subject!: string;

  /**
   * Notification message content
   */
  @Property({ type: 'text' })
  message!: string;

  /**
   * Timestamp of the notification
   */
  @Property()
  timestamp!: Date;

  /**
   * JSON data
   */
  @Property({ type: 'json' })
  data!: Record<string, any>;

  /**
   * Created at
   */
  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt!: Date;

  /**
   * Updated at
   */
  @Property({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Status of the notification
   */
  @Property({ type: 'text' })
  status!: NotificationStatus;
}

/**
 * Notification entity data type
 * @description Type definition for the Notification entity
 */
export type NotificationEntityData = Omit<NotificationEntity, 'id'>;

@Entity({ tableName: 'templates' })
export class TemplateEntity {
  @PrimaryKey()
  id!: string;

  @Property({ name: 'event_name', type: 'text' })
  eventName!: TemplateEvent;

  @Property()
  subject!: string;

  @Property()
  message!: string;

  @OneToMany(() => NotificationEntity, (notification) => notification.template)
  notifications!: NotificationEntity[];
}

export type TemplateEntityData = Omit<TemplateEntity, 'id'>;
```
