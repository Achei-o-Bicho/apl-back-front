import { Module } from '@nestjs/common';
import { LambdaService } from './lambda.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [LambdaService],
  providers: [LambdaService],
})
export class LambdaModule {}
