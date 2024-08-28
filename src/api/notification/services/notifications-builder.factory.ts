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

/**
 * NotificationsBuilderFactory implements the Factory Method pattern.
 * It creates different types of notification builders based on the event type.
 */
export class NotificationsBuilderFactory {
  /**
   * Creates and returns a specific notification builder based on the event type.
   * This is the core of the Factory Method pattern.
   *
   * @param event - The event data for which to create a notification builder.
   * @param templateRepository - Repository for accessing template entities.
   * @param entityManager - Entity manager for database operations.
   * @returns An instance of a class implementing BuildNotifications interface.
   * @throws Error if an unsupported event type is provided.
   */
  createNotificationsBuilder(
    event: EventDto,
    templateRepository: EntityRepository<TemplateEntity>,
    entityManager: EntityManager,
  ): BuildNotifications {
    switch (event.name) {
      case 'launch_scheduled':
        return new LaunchScheduledBuilder(event, templateRepository, entityManager);
      case 'launch_confirmed':
        return new LaunchConfirmedBuilder(event, templateRepository, entityManager);
      case 'launch_launched':
        return new LaunchLaunchedBuilder(event, templateRepository, entityManager);
      case 'launch_delayed':
        return new LaunchDelayedBuilder(event, templateRepository, entityManager);
      case 'launch_aborted':
        return new LaunchAbortedBuilder(event, templateRepository, entityManager);
      case 'booking_confirmed':
        return new BookingConfirmedBuilder(event, templateRepository, entityManager);
      case 'booking_canceled':
        return new BookingCanceledBuilder(event, templateRepository, entityManager);
      case 'invoice_issued':
        return new InvoiceIssuedBuilder(event, templateRepository, entityManager);
      default:
        throw new Error(`Unsupported event type: ${event.name}`);
    }
  }
}
