import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { EventDto } from '../models/event.dto';
import { NotificationEntity } from './notification.entity';
import { TemplateEntity } from './template.entity';

export interface BuildNotifications {
  template: TemplateEntity;
  data: any;
  build(): Promise<NotificationEntity>;
  loadTemplate(event: EventDto): Promise<TemplateEntity>;
  loadData(event: EventDto): Promise<any>;
  writeSubject(template: TemplateEntity, data: any): string;
  writeMessage(template: TemplateEntity, data: any): string;
}

export abstract class NotificationBuilder implements BuildNotifications {
  constructor(
    protected readonly event: EventDto,
    protected readonly templateRepository: EntityRepository<TemplateEntity>,
    protected readonly entityManager: EntityManager,
  ) {}
  template: TemplateEntity;
  data: any;
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
  abstract loadData(event: EventDto): Promise<any>;
  abstract writeSubject(template: TemplateEntity, data: any): string;
  abstract writeMessage(template: TemplateEntity, data: any): string;

  async build(): Promise<NotificationEntity> {
    this.template = await this.loadTemplate(this.event);
    this.data = await this.loadData(this.event);
    const notification = new NotificationEntity();
    notification.subject = this.writeSubject(this.template, this.data);
    notification.message = this.writeMessage(this.template, this.data);
    return notification;
  }
}
