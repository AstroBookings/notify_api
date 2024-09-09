import { EventDto } from '@api/notification/models/event.dto';
import { NotificationEntity } from '@api/notification/services/notification.entity';
import { TemplateEntity } from '@api/notification/services/template.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';

/**
 * BuildNotifications interface defines the contract for notification builders.
 */
export interface BuildNotifications {
  build(): Promise<NotificationEntity[]>;
}

/**
 * NotificationBuilder is an abstract class that implements the Template Method pattern.
 */
export abstract class NotificationBuilder implements BuildNotifications {
  #template: TemplateEntity;
  protected data: Record<string, any> = {};
  protected subjectData: Record<string, any> = {};
  protected messageData: Record<string, any> = {};
  protected userIds: string[] = [];
  protected readonly connection = this.entityManager.getConnection();

  constructor(
    protected readonly event: EventDto,
    private readonly templateRepository: EntityRepository<TemplateEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Template method for building notifications.
   */
  public async build(): Promise<NotificationEntity[]> {
    this.#template = await this.loadTemplate();
    await this.loadData();
    const subject: string = this.writeSubject();
    const message: string = this.writeMessage();
    return this.#createNotifications(subject, message);
  }

  /**
   * Template method for loading the notification template.
   */
  protected async loadTemplate(): Promise<TemplateEntity> {
    const template: TemplateEntity | null = await this.templateRepository.findOne({ eventName: this.event.name });
    if (!template) {
      throw new NotFoundException(`Template not found for event: ${this.event.name}`);
    }
    return template;
  }

  /**
   * Abstract method to be implemented by subclasses for loading event-specific data.
   */
  protected abstract loadData(): Promise<void>;

  /**
   * Method to write the notification subject.
   */
  protected writeSubject(): string {
    return this.#replacePlaceholders(this.#template.subject, this.subjectData);
  }

  /**
   * Method to write the notification message.
   */
  protected writeMessage(): string {
    return this.#replacePlaceholders(this.#template.message, this.messageData);
  }

  /**
   * Replaces placeholders in a template with dynamic values.
   */
  #replacePlaceholders(template: string, data: Record<string, any>): string {
    const placeholderRegex: RegExp = /\{(\w+)\}/g;
    return template.replace(placeholderRegex, (match: string, key: string): string => data[key]?.toString() || match);
  }

  /**
   * Creates notification entities for each user.
   */
  #createNotifications(subject: string, message: string): NotificationEntity[] {
    return this.userIds.map((userId: string): NotificationEntity => {
      const notification: NotificationEntity = new NotificationEntity();
      notification.userId = userId;
      notification.subject = subject;
      notification.message = message;
      notification.data = this.data;
      notification.createdAt = new Date();
      notification.status = 'pending';
      notification.template = this.#template;
      return notification;
    });
  }
}
