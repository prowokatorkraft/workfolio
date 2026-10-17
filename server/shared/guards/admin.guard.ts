import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const adminKeyEnv: string | undefined = this.configService.get('ADMIN_KEY');
    if (!adminKeyEnv) {
      throw new InternalServerErrorException('Environment don`t have admin key');
    }
    const request = context.switchToHttp().getRequest<Request>();
    const adminKey = request.headers['adminkey'];
    if (!adminKey || adminKey !== adminKeyEnv) {
      throw new ForbiddenException('This endpoint is only available in admin environment');
    }
    return true;
  }
}
