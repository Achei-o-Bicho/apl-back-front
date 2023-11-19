import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeatureFlagService } from './feature-flag.service';
import { IFeatureFlag } from './feature-flag.interface';

@ApiTags('Feature Flag')
@Controller('feature-flag')
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a flag de recurso para a chave especificada.',
  })
  async getFeatureFlag<T>(
    @Query('flag') flag: string,
    @Res() res,
  ): Promise<IFeatureFlag<T>> {
    const feature = await this.featureFlagService.get<T>(flag);
    return res.status(HttpStatus.OK).json(feature);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Define a flag de recurso para a chave especificada.',
  })
  async setFeatureFlag<T>(
    @Query('flag') flag: string,
    @Body() body: { value: T; isEnabled: boolean },
    @Res() res,
  ): Promise<IFeatureFlag<T>> {
    const { value, isEnabled } = body;
    const feature = await this.featureFlagService.set<T>(
      flag,
      value,
      isEnabled,
    );

    return res.status(HttpStatus.OK).json(feature);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Flag updated successfully',
  })
  async updateFlag<T>(
    @Query('flag') flag: string,
    @Body() body: { value: T; isEnabled: boolean },
    @Res() res,
  ): Promise<IFeatureFlag<T>> {
    const { value, isEnabled } = body;
    const feature = await this.featureFlagService.update<T>(
      flag,
      value,
      isEnabled,
    );

    return res.status(HttpStatus.OK).json(feature);
  }
}
