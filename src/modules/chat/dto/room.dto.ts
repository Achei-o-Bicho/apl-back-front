import { IsNotEmpty } from 'class-validator';

export class RoomDto {
  @IsNotEmpty()
  id: string;
}
