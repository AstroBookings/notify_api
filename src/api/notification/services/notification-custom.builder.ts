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
    const launchesFound = await this.connection.execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    // get bookings
    const queryBookings: string = `SELECT * FROM bookings WHERE launch_id = '${launchId}'`;
    const bookingsFound = await this.connection.execute(queryBookings);
    const bookings = bookingsFound;
    if (!bookings) {
      return this.data;
    }
    // get user ids from bookings
    this.userIds = bookings.map((booking: any) => booking['traveler_id']);
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class LaunchConfirmedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchesFound = await this.connection.execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      destination: this.data['launch']['destination'],
      mission: this.data['launch']['mission'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
      mission: this.data['launch']['mission'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class LaunchLaunchedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchesFound = await this.connection.execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class LaunchDelayedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchesFound = await this.connection.execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class LaunchAbortedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const launchId: string = this.event.data;
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchesFound = await this.connection.execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class BookingConfirmedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const bookingId: string = this.event.data;
    // get booking
    const queryBooking: string = `SELECT * FROM bookings WHERE id = '${bookingId}'`;
    const bookingFound = await this.connection.execute(queryBooking);
    const booking = bookingFound[0];
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data['booking'] = booking;
    // get launch from booking
    const launchId = booking['launch_id'];
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchFound = await this.connection.execute(queryLaunch);
    const launch = launchFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    // get user ids from launch
    this.userIds = [launch['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
      date: this.data['launch']['date'],
      number_of_seats: this.data['booking']['number_of_seats'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class BookingCanceledBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const bookingId: string = this.event.data;
    const queryBooking: string = `SELECT * FROM bookings WHERE id = '${bookingId}'`;
    const bookingFound = await this.connection.execute(queryBooking);
    const booking = bookingFound[0];
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found`);
    }
    this.data['booking'] = booking;
    // get launch from booking
    const launchId = booking['launch_id'];
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    const launchFound = await this.connection.execute(queryLaunch);
    const launch = launchFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    this.data['launch'] = launch;
    this.userIds = [booking['traveler_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      mission: this.data['launch']['mission'],
      destination: this.data['launch']['destination'],
    };
    return this.replaceMessage(placeholderData);
  }
}

export class InvoiceIssuedBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  async loadData(): Promise<any> {
    const invoiceId: string = this.event.data;
    const queryInvoice: string = `SELECT * FROM invoices WHERE id = '${invoiceId}'`;
    const invoiceFound = await this.connection.execute(queryInvoice);
    const invoice = invoiceFound[0];
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }
    this.data['invoice'] = invoice;
    this.userIds = [invoice['agency_id']];
    return this.data;
  }

  writeSubject(): string {
    const placeholderData: Record<string, string> = {
      number: this.data['invoice']['number'],
    };
    return this.replaceSubject(placeholderData);
  }

  writeMessage(): string {
    const placeholderData: Record<string, string> = {
      number: this.data['invoice']['number'],
      amount: this.data['invoice']['amount'],
    };
    return this.replaceMessage(placeholderData);
  }
}
