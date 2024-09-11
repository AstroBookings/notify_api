import { ConfigService } from '@nestjs/config';

export const jwtConfigFactory = (configService: ConfigService) => configService.get('jwt');
