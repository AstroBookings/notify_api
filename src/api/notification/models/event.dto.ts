import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { TemplateEvent } from './template-event.type';
/**
 * Event DTO
 * @description DTO for event data
 */
export class EventDto {
  @IsString()
  @IsNotEmpty()
  name: TemplateEvent;

  @IsObject()
  data: string;
}
