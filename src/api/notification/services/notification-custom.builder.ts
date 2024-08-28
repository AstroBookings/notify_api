import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { EventDto } from '../models/event.dto';
import { NotificationBuilder } from './notification.builder';
import { TemplateEntity } from './template.entity';

export class LaunchScheduledBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;

    // get launch data
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchesFound = await this.entityManager
      .getConnection()
      .execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };

    // get bookings
    const queryBookings: string = `SELECT * FROM bookings WHERE launch_id = '${launchId}'`;
    const bookingsFound = await this.entityManager
      .getConnection()
      .execute(queryBookings);
    const bookings = bookingsFound;
    if (!bookings) {
      return this.data;
    }

    // get user ids from bookings
    const userIds = bookings.map((booking: any) => booking['traveler_id']);
    this.userIds = userIds;

    return this.data;
  }

  writeSubject(): string {
    return `Launch Scheduled: ${this.data.launch.destination}`;
  }

  writeMessage(): string {
    return `Your launch "${this.data.launch.destination}" has been scheduled for ${this.data.launch.date}.`;
  }
}

export class LaunchConfirmedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Launch Confirmed: ${this.data.launch.name}`;
  }

  writeMessage(): string {
    return `Your launch "${this.data.launch.name}" has been confirmed for ${this.data.launch.date}.`;
  }
}

export class LaunchLaunchedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Launch Successful: ${this.data.launch.name}`;
  }

  writeMessage(): string {
    return `Your launch "${this.data.launch.name}" has successfully launched!`;
  }
}

export class LaunchDelayedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Launch Delayed: ${this.data.launch.name}`;
  }

  writeMessage(): string {
    return `Your launch "${this.data.launch.name}" has been delayed. New date: ${this.data.launch.newDate}.`;
  }
}

export class LaunchAbortedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data = { launch };
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Launch Aborted: ${this.data.launch.name}`;
  }

  writeMessage(): string {
    return `We regret to inform you that the launch "${this.data.launch.name}" has been aborted.`;
  }
}

export class BookingConfirmedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const bookingId: string = this.event.data;
    const booking = await this.entityManager.findOne('Booking', {
      id: bookingId,
    });
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data = { booking };
    this.userIds = [booking['user_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Booking Confirmed: ${this.data.booking.launchName}`;
  }

  writeMessage(): string {
    return `Your booking for the launch "${this.data.booking.launchName}" has been confirmed.`;
  }
}

export class BookingCanceledBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const bookingId: string = this.event.data;
    const booking = await this.entityManager.findOne('Booking', {
      id: bookingId,
    });
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data = { booking };
    this.userIds = [booking['user_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Booking Canceled: ${this.data.booking.launchName}`;
  }

  writeMessage(): string {
    return `Your booking for the launch "${this.data.booking.launchName}" has been canceled.`;
  }
}

export class InvoiceIssuedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(): Promise<any> {
    const invoiceId: string = this.event.data;
    const invoice = await this.entityManager.findOne('Invoice', {
      id: invoiceId,
    });
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }
    this.data = { invoice };
    this.userIds = [invoice['user_id']];
    return this.data;
  }

  writeSubject(): string {
    return `Invoice Issued: ${this.data.invoice.number}`;
  }

  writeMessage(): string {
    return `An invoice (${this.data.invoice.number}) has been issued for your recent booking. Total amount: ${this.data.invoice.amount}.`;
  }
}
