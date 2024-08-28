import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { EventDto } from '../models/event.dto';
import { NotificationEntity } from './notification.entity';
import { TemplateEntity } from './template.entity';

// Note: The concrete implementations of NotificationBuilder should be updated
// to match these changes, but they are not visible in the current selection.

// The services using NotificationBuilder should be updated to handle an array of
// notifications and provide the userIds when creating the builder.

// Tests should be updated to expect an array of notifications and include
// cases for multiple users.

/**
 * BuildNotifications interface defines the contract for notification builders.
 * This is part of the Builder pattern.
 */
export interface BuildNotifications {
  template: TemplateEntity;
  data: any;
  userIds: string[];

  build(): Promise<NotificationEntity[]>;
  loadTemplate(): Promise<TemplateEntity>;
  loadData(): Promise<any>;
  writeSubject(): string;
  writeMessage(): string;
}

/**
 * NotificationBuilder is an abstract class that implements the Template Method pattern.
 * It provides a skeleton of algorithms for building notifications, with some steps
 * deferred to subclasses.
 */
export abstract class NotificationBuilder implements BuildNotifications {
  template: TemplateEntity;
  data: any = {};
  userIds: string[] = [];
  protected connection = this.entityManager.getConnection();

  constructor(
    protected readonly event: EventDto,
    protected readonly templateRepository: EntityRepository<TemplateEntity>,
    protected readonly entityManager: EntityManager,
  ) {}

  /**
   * Template method for building notifications.
   * This is part of the Template Method pattern.
   */
  async build(): Promise<NotificationEntity[]> {
    this.template = await this.loadTemplate();
    this.data = await this.loadData();
    const subject: string = this.writeSubject();
    const message: string = this.writeMessage();

    return this.userIds.map((userId: string) => {
      const notification: NotificationEntity = new NotificationEntity();
      notification.userId = userId;
      notification.subject = subject;
      notification.message = message;
      notification.data = this.data;
      notification.createdAt = new Date();
      notification.status = 'pending';
      notification.template = this.template;
      return notification;
    });
  }

  /**
   * Template method for loading the notification template.
   * This is part of the Template Method pattern.
   */
  async loadTemplate(): Promise<TemplateEntity> {
    const template: TemplateEntity | null =
      await this.templateRepository.findOne({
        eventName: this.event.name,
      });
    if (!template) {
      throw new NotFoundException(
        `Template not found for event: ${this.event.name}`,
      );
    }
    return template;
  }

  /**
   * Abstract method to be implemented by subclasses for loading event-specific data.
   * This is part of the Template Method pattern.
   */
  abstract loadData(): Promise<any>;

  /**
   * Abstract method to be implemented by subclasses for writing the notification subject.
   * This is part of the Template Method pattern.
   */
  abstract writeSubject(): string;

  /**
   * Replaces subject placeholders with dynamic values.
   * @param {Record<string, string>} placeholderData - An object with data to replace the placeholders.
   * @returns {string} The subject with replaced placeholders.
   */
  protected replaceSubject(placeholderData: Record<string, string>): string {
    const templateSubject = this.template.subject;
    return this.#replacePlaceholders(templateSubject, placeholderData);
  }

  /**
   * Abstract method to be implemented by subclasses for writing the notification message.
   * This is part of the Template Method pattern.
   */
  abstract writeMessage(): string;

  /**
   * Replaces message placeholders with dynamic values.
   * @param {Record<string, string>} placeholderData - An object with data to replace the placeholders.
   * @returns {string} The message with replaced placeholders.
   */
  protected replaceMessage(placeholderData: Record<string, string>): string {
    const templateMessage = this.template.message;
    return this.#replacePlaceholders(templateMessage, placeholderData);
  }

  /**
   * Replaces placeholders in a template with dynamic values.
   * @param {string} template - The template with placeholders.
   * @param {Record<string, string>} data - An object with data to replace the placeholders.
   * @returns {string} The message with replaced placeholders.
   */
  #replacePlaceholders(template: string, data: Record<string, string>): string {
    const placeholderRegex: RegExp = /\{(\w+)\}/g;
    const replacer = (match: string, key: string): string => data[key] || match;
    return template.replace(placeholderRegex, replacer);
  }
}
