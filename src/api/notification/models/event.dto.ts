import { IsNotEmpty, IsString } from 'class-validator';
import { TemplateEvent } from './template-event.enum';
/**
 * Event DTO with something to notify
 * @description Input data to notify something
 */
export class EventDto {
  /**
   * The template name
   * @example 'launch_scheduled'
   */
  @IsString()
  @IsNotEmpty()
  name: TemplateEvent;
  /**
   * The data to notify
   * @example "lnch_1"
   */
  @IsString()
  data: string;
}
