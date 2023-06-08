import { Controller, Get } from '@nestjs/common';

@Controller('pets')
export class PetsController {
  @Get()
  public async getPetById(): Promise<string> {
    return 'Olá';
  }
}
