import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { EventDto } from '../models/event.dto';
import { NotificationEntity } from './notification.entity';
import { TemplateEntity } from './template.entity';

/**
 * BuildNotifications interface defines the contract for notification builders.
 * This is part of the Builder pattern.
 */
export interface BuildNotifications {
  template: TemplateEntity;
  data: any;
  build(): Promise<NotificationEntity>;
  loadTemplate(event: EventDto): Promise<TemplateEntity>;
  loadData(event: EventDto): Promise<any>;
  writeSubject(template: TemplateEntity, data: any): string;
  writeMessage(template: TemplateEntity, data: any): string;
}

/**
 * NotificationBuilder is an abstract class that implements the Template Method pattern.
 * It provides a skeleton of algorithms for building notifications, with some steps
 * deferred to subclasses.
 */
export abstract class NotificationBuilder implements BuildNotifications {
  constructor(
    protected readonly event: EventDto,
    protected readonly templateRepository: EntityRepository<TemplateEntity>,
    protected readonly entityManager: EntityManager,
  ) {}
  template: TemplateEntity;
  data: any;
  notification: NotificationEntity;

  /**
   * Template method for loading the notification template.
   * This is part of the Template Method pattern.
   */
  async loadTemplate(event: EventDto): Promise<TemplateEntity> {
    this.template = await this.templateRepository.findOne({
      eventName: event.name,
    });
    if (!this.template) {
      throw new NotFoundException(
        `Template not found for event: ${event.name}`,
      );
    }
    return this.template;
  }

  /**
   * Abstract method to be implemented by subclasses for loading event-specific data.
   * This is part of the Template Method pattern.
   */
  abstract loadData(event: EventDto): Promise<any>;

  /**
   * Abstract method to be implemented by subclasses for writing the notification subject.
   * This is part of the Template Method pattern.
   */
  abstract writeSubject(template: TemplateEntity, data: any): string;

  /**
   * Abstract method to be implemented by subclasses for writing the notification message.
   * This is part of the Template Method pattern.
   */
  abstract writeMessage(template: TemplateEntity, data: any): string;

  /**
   * Template method that defines the skeleton of the notification building algorithm.
   * This is the core of the Template Method pattern.
   */
  async build(): Promise<NotificationEntity> {
    this.template = await this.loadTemplate(this.event);
    this.data = await this.loadData(this.event);
    console.log(`🤖 data: ${JSON.stringify(this.data)}`);
    this.notification = new NotificationEntity();
    this.notification.subject = this.writeSubject(this.template, this.data);
    this.notification.message = this.writeMessage(this.template, this.data);
    this.notification.template = this.template;
    this.notification.recipientName = this.data.agency.contact_info;
    this.notification.recipientEmail = this.data.agency.contact_email;
    this.notification.data = this.data;
    this.notification.userId = this.data.userId;
    this.notification.status = 'pending';
    this.notification.createdAt = new Date();
    return this.notification;
  }
}
