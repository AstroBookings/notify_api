import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { EventDto } from '../models/event.dto';
import {
  BookingCanceledBuilder,
  BookingConfirmedBuilder,
  InvoiceIssuedBuilder,
  LaunchAbortedBuilder,
  LaunchConfirmedBuilder,
  LaunchDelayedBuilder,
  LaunchLaunchedBuilder,
  LaunchScheduledBuilder,
} from './notification-custom.builder';
import { BuildNotifications } from './notification.builder';
import { TemplateEntity } from './template.entity';

export class NotificationFactory {
  createBuilder(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ): BuildNotifications {
    switch (event.name) {
      case 'launch_scheduled':
        return new LaunchScheduledBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'launch_confirmed':
        return new LaunchConfirmedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'launch_launched':
        return new LaunchLaunchedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'launch_delayed':
        return new LaunchDelayedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'launch_aborted':
        return new LaunchAbortedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'booking_confirmed':
        return new BookingConfirmedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'booking_canceled':
        return new BookingCanceledBuilder(
          event,
          templateRepository,
          entityManager,
        );
      case 'invoice_issued':
        return new InvoiceIssuedBuilder(
          event,
          templateRepository,
          entityManager,
        );
      default:
        throw new Error(`Unsupported event type: ${event.name}`);
    }
  }
}
