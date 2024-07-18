import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { UserDto } from 'src/infraestructure/dtos/user.dto';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
    private readonly loggingService: LoggingService
  ) {}

  async run(email: string, password: string): Promise<{ user: UserDto; token: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      const userDto = new UserDto(user.userId, user.email);
      const token = await this.authService.generateJwt(userDto);
      await this.loggingService.logAction('GET', 'User', user.userId, user.userId, JSON.stringify(user));
      return { user: userDto, token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
  
}