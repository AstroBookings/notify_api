import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { EventDto } from '../models/event.dto';
import { NotificationBuilder } from './notification.builder';
import { TemplateEntity } from './template.entity';

/**
 * Builder for creating notifications when a launch is scheduled.
 * @extends NotificationBuilder
 * @description Builds a notification for each traveler associated with a launch.
 */
export class LaunchScheduledBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const launchId: string = this.event.data;
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    const bookings: any[] = await this.connection.execute(`SELECT * FROM bookings WHERE launch_id = ?`, [launchId]);
    this.userIds = bookings.map((booking: any): string => booking.traveler_id);
  }

  writeSubject(): string {
    this.subjectData = {
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a launch is confirmed.
 * @extends NotificationBuilder
 * @description Builds a notification for each traveler associated with a launch.
 */
export class LaunchConfirmedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const launchId: string = this.event.data;
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      destination: this.data['launch']['destination'],
      mission: this.data['launch']['mission'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
      mission: this.data['launch']['mission'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a launch has been launched.
 * @extends NotificationBuilder
 * @description Builds a notification for each traveler associated with a launch.
 */
export class LaunchLaunchedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const launchId: string = this.event.data;
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a launch is delayed.
 * @extends NotificationBuilder
 * @description Builds a notification for each traveler associated with a launch.
 */
export class LaunchDelayedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const launchId: string = this.event.data;
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a launch is aborted.
 * @extends NotificationBuilder
 * @description Builds a notification for each traveler associated with a launch.
 */
export class LaunchAbortedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const launchId: string = this.event.data;
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a booking is confirmed.
 * @extends NotificationBuilder
 * @description Builds a notification for the agency associated with the booking launch.
 */
export class BookingConfirmedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const bookingId: string = this.event.data;
    const [booking]: any[] = await this.connection.execute(`SELECT * FROM bookings WHERE id = ?`, [bookingId]);
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data = { booking };
    const launchId: string = booking['launch_id'];
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [launch['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
      number_of_seats: this.data['booking']['number_of_seats'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when a booking is canceled.
 * @extends NotificationBuilder
 * @description Builds a notification for the traveler associated with the booking launch.
 */
export class BookingCanceledBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const bookingId: string = this.event.data;
    const [booking]: any[] = await this.connection.execute(`SELECT * FROM bookings WHERE id = ?`, [bookingId]);
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data = { booking };
    const launchId: string = booking['launch_id'];
    const [launch]: any[] = await this.connection.execute(`SELECT * FROM launches WHERE id = ?`, [launchId]);
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [booking['traveler_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return super.writeMessage();
  }
}

/**
 * Builder for creating notifications when an invoice is issued.
 * @extends NotificationBuilder
 * @description Builds a notification for the agency associated with the invoice.
 */
export class InvoiceIssuedBuilder extends NotificationBuilder {
  constructor(event: EventDto, templateRepository: EntityRepository<TemplateEntity>, entityManager: EntityManager) {
    super(event, templateRepository, entityManager);
  }

  protected async loadData(): Promise<void> {
    const invoiceId: string = this.event.data;
    const [invoice]: any[] = await this.connection.execute(`SELECT * FROM invoices WHERE id = ?`, [invoiceId]);
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }
    this.data = { invoice };
    this.userIds = [invoice['agency_id']];
  }

  writeSubject(): string {
    this.subjectData = {
      number: this.data['invoice']['number'],
    };
    return super.writeSubject();
  }

  writeMessage(): string {
    this.messageData = {
      number: this.data['invoice']['number'],
      amount: this.data['invoice']['amount'],
    };
    return super.writeMessage();
  }
}
