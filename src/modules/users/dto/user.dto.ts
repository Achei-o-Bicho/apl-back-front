import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ContactDto {
  @ApiProperty({
    type: String,
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of the user',
    example: '+5511987654321',
  })
  @IsNotEmpty()
  phone: string;
}

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'Document of the user',
    example: '12345678900',
  })
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    type: String,
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: ContactDto,
    description: 'Contact information of the user',
  })
  @IsNotEmpty()
  contact: ContactDto;

  @ApiProperty({
    type: String,
    description: 'Password for the user',
    example: 'secretpassword',
  })
  @IsNotEmpty()
  password: string;
}
