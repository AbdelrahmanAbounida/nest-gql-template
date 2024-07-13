import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { Public } from '../guards/public.guard';
import { UserRoleEnum } from 'src/common/enums/role.enum';

// a sample decorator to merge all together

export function Auth(role: UserRoleEnum, isPublic: boolean) {
  if (isPublic) {
    return applyDecorators(SetMetadata('role', role), Public());
  } else {
    return applyDecorators(SetMetadata('role', role), UseGuards(JWTAuthGuard));
  }
}
