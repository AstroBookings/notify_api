import { IsNotEmpty, IsObject, IsString } from 'class-validator';
/**
 * Event DTO
 * @description DTO for event data
 */
export class EventDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  data: Record<string, any>;
}
