import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';

import { UsersService } from '@messanger/src/users/users.service';
import { IUser } from '@messanger/interfaces';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private usersService: UsersService,
    private reflector: Reflector
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    let userModel: Model<IUser> = null;
    
    if (request.headers.authorization) {
      const apiKey = request.headers.authorization.substr(7);
      
      userModel = await this.usersService.findOneBy({ apiKey });
    } else if (request.body.personalId && request.body.password) {
      userModel = await this.usersService.findOneBy({
        personalId: request.body.personalId,
        password: request.body.password
      });
    }

    if (!userModel) {
      return false;
    }

    let hasAccess = true;
    requiredRoles.forEach(role => {
      if (!userModel.roles.includes(role)) {
        hasAccess = false;
      }
    });

    return hasAccess;
  }
}
