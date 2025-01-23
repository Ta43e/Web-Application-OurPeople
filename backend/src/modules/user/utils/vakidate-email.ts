import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';

import { UserService } from '../user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueLogin implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {  }

  async validate(login: string) {
    const user = await this.userService.findByEmail(login);
    return !user;
  }
}
