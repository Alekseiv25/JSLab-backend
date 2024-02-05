import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { makeUnauthorizedMessage } from '../utils/generators/messageGenerators';
import { IAccessToken, TokensService } from '../tokens/tokens.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const userDataFromToken: IAccessToken | null = this.tokensService.validateAccessToken(token);

    if (!userDataFromToken) {
      throw new UnauthorizedException();
    }

    if (userDataFromToken.status === 'Suspended') {
      throw new HttpException(makeUnauthorizedMessage(), HttpStatus.FORBIDDEN);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
