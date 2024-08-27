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

  async loadData(event: EventDto): Promise<any> {
    // Implement specific data loading for launch_scheduled event
    const launchId: string = event.data;
    const launch = await this.entityManager.findOne('Launch', { id: launchId });
    return { launch };
  }

  writeSubject(template: TemplateEntity, data: any): string {
    return `Launch Scheduled: ${data.launch.name}`;
  }

  writeMessage(template: TemplateEntity, data: any): string {
    return `Your launch "${data.launch.name}" has been scheduled for ${data.launch.date}.`;
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
