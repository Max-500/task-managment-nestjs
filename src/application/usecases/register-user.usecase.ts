import { ConflictException, Inject } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/infraestructure/dtos/create-user.dto';
import { UserDto } from 'src/infraestructure/dtos/user.dto';

export class RegisterUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async run(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new User();
    user.email = createUserDto.email;
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createUserDto.password, salt);

    const savedUser = await this.userRepository.save(user);
    
    return new UserDto(savedUser.id, savedUser.email);
  }

}