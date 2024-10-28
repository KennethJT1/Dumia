import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from 'src/utilities/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utilities/decorators/authorize-role.decorator';
import { Roles } from 'src/utilities/common/user-role.enum';
import { AuthorizationGuard } from 'src/utilities/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async register(@Body() user: UserRegistrationDto): Promise<UserEntity> {
    return this.usersService.register(user);
  }

  @Post('login')
  async login(@Body() loginUserDto: UserLoginDto): Promise<{
    user: UserEntity;
    accessToken: string;
}> {
    const user = await this.usersService.login(loginUserDto);
    const accessToken = await this.usersService.accessToken(user)
    return { user, accessToken }
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Get('all')
  async findAll(): Promise<{
    counts: number;
    data: UserEntity[];
}>{
    return this.usersService.findAll();
  }

  @Get('myprofile')
  async getProfile(@User() currentUser: UserEntity){
    return currentUser;
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
