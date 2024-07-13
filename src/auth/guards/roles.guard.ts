import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/common/enums/role.enum';

// this is anthor way to change req metadata
export const Roles = Reflector.createDecorator<UserRoleEnum>();
