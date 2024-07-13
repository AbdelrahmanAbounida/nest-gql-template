import { registerEnumType } from '@nestjs/graphql';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
  description: 'User roles',
});
