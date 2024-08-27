import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { EventDto } from '../models/event.dto';
import { NotificationBuilder } from './notification.builder';
import { TemplateEntity } from './template.entity';

/**
 * LaunchScheduledBuilder is a concrete builder for 'launch_scheduled' events.
 * It extends NotificationBuilder and implements the Template Method pattern.
 */
export class LaunchScheduledBuilder extends NotificationBuilder {
  constructor(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ) {
    super(event, templateRepository, entityManager);
  }

  /**
   * Implements the abstract loadData method from NotificationBuilder.
   * This is part of the Template Method pattern.
   */
  async loadData(event: EventDto): Promise<any> {
    const launchId: string = event.data;
    const queryLaunch: string = `SELECT * FROM launches WHERE id = '${launchId}'`;
    console.log(`🤖 query: ${queryLaunch}`);
    const launchesFound = await this.entityManager
      .getConnection()
      .execute(queryLaunch);
    const launch = launchesFound[0];
    if (!launch) {
      throw new Error(`Launch with id ${launchId} not found`);
    }
    console.log(`🤖 launch: ${launchId}`, JSON.stringify(launch));
    const userId = launch['agency_id'];
    const queryAgency: string = `SELECT * FROM agencies WHERE user_id = '${userId}'`;
    console.log(`🤖 query: ${queryAgency}`);
    const agenciesFound = await this.entityManager
      .getConnection()
      .execute(queryAgency);
    const agency = agenciesFound[0];
    if (!agency) {
      throw new Error(`Agency with id ${launch.agencyId} not found`);
    }
    console.log(`🤖 agency: ${userId}`, JSON.stringify(agency));
    this.data = { launch, agency, userId };
    return { launch, agency, userId };
  }

  /**
   * Implements the abstract writeSubject method from NotificationBuilder.
   * This is part of the Template Method pattern.
   */
  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Scheduled: ${data.launch.destination}`;
  }

  /**
   * Implements the abstract writeMessage method from NotificationBuilder.
   * This is part of the Template Method pattern.
   */
  writeMessage(template: TemplateEntity, data: any): string {
    return `Your launch "${data.launch.destination}" has been scheduled for ${data.launch.date}.`;
  }
}

export class LaunchConfirmedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for launch_confirmed event
    const launchId: string = event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    return { launch };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Confirmed: ${data.launch.name}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your launch "${data.launch.name}" has been confirmed for ${data.launch.date}.`;
  }
}

export class LaunchLaunchedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for launch_launched event
    const launchId: string = event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    return { launch };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Successful: ${data.launch.name}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your launch "${data.launch.name}" has successfully launched!`;
  }
}

export class LaunchDelayedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for launch_delayed event
    const launchId: string = event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    return { launch };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Delayed: ${data.launch.name}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your launch "${data.launch.name}" has been delayed. New date: ${data.launch.newDate}.`;
  }
}

export class LaunchAbortedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for launch_aborted event
    const launchId: string = event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    return { launch };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Aborted: ${data.launch.name}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `We regret to inform you that the launch "${data.launch.name}" has been aborted.`;
  }
}

export class BookingConfirmedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for booking_confirmed event
    const bookingId: string = event.data;
    const booking = await this.entityManager.findOne('Booking', {
      id: bookingId,
    });
    return { booking };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Booking Confirmed: ${data.booking.launchName}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your booking for the launch "${data.booking.launchName}" has been confirmed.`;
  }
}

export class BookingCanceledBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for booking_canceled event
    const bookingId: string = event.data;
    const booking = await this.entityManager.findOne('Booking', {
      id: bookingId,
    });
    return { booking };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Booking Canceled: ${data.booking.launchName}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your booking for the launch "${data.booking.launchName}" has been canceled.`;
  }
}

export class InvoiceIssuedBuilder extends NotificationBuilder {
  // ... constructor ...

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for invoice_issued event
    const invoiceId: string = event.data;
    const invoice = await this.entityManager.findOne('Invoice', {
      id: invoiceId,
    });
    return { invoice };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Invoice Issued: ${data.invoice.number}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `An invoice (${data.invoice.number}) has been issued for your recent booking. Total amount: ${data.invoice.amount}.`;
  }
}
