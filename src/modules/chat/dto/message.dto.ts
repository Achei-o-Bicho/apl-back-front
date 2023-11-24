import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RoomDto } from './room.dto';

export class MessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  userIdReceiver: string;

  @IsNotEmpty()
  room: RoomDto;
}
