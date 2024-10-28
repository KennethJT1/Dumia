import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from "bcrypt"
import { UserLoginDto } from './dto/user-login.dto';
import { sign } from "jsonwebtoken"

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  async register(user: UserRegistrationDto): Promise<UserEntity> {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser)
      throw new BadRequestException('Email already exists');

    user.password = await hash(user.password, 10)

    let newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async login(loginUserDto: UserLoginDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email', { email: loginUserDto.email }).getOne();

    if (!existingUser)
      throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await compare(loginUserDto.password, existingUser.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    delete existingUser.password;
    return existingUser;
  }

  async findAll(): Promise<{
    counts: number;
    data: UserEntity[];
  }> {
    const users = await this.usersRepository.find()
    return {
      counts: users.length,
      data: users
    }
  }

  async findOne(id: string) : Promise<UserEntity>{
    const user = await this.usersRepository.findOneBy({ id })
  
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return await sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
  }
}
