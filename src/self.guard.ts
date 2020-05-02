import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '@messanger/src/users/users.service';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers.authorization.substr(7);
    const sourceUser = await this.usersService.findOneBy({ apiKey });

    if (sourceUser['_id'].toString() === request.params.id) {
      return true
    }

    return false;
  }
}
