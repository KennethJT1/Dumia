import { PartialType } from '@nestjs/mapped-types';
import { UserRegistrationDto } from './user-registration.dto';

export class UpdateUserDto extends PartialType(UserRegistrationDto) {}
