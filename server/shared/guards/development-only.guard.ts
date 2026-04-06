import { Injectable, CanActivate, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevelopmentOnlyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(): boolean {
    const nodeEnv: string | undefined = this.configService.get('NODE_ENV');

    if (nodeEnv === 'production') {
      throw new ForbiddenException('This endpoint is only available in development environment');
    }

    return true;
  }
}
