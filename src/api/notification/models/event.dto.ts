import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { TemplateEvent } from './template-event.enum';
/**
 * Event DTO with something to notify
 * @description The template name and data asociated
 */
export class EventDto {
  @IsString()
  @IsNotEmpty()
  name: TemplateEvent;

  @IsObject()
  data: string;
}
