import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { TemplateEvent } from './template-event.enum';
/**
 * Event DTO with something to notify
 * @description Input data to notify something
 * @example { "name": "user_created", "data": { "userId": "123", "userName": "John Doe" } }
 * @property {TemplateEvent} name - The template name
 * @property {object} data - The data to notify
 */
export class EventDto {
  @IsString()
  @IsNotEmpty()
  name: TemplateEvent;

  @IsObject()
  data: string;
}
