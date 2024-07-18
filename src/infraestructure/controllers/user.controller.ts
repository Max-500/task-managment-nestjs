import { Controller, Post, Body, ConflictException, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { ResponseDto } from '../dtos/responses.dto';
import { RegisterUserUseCase } from 'src/application/usecases/register-user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/login-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const userDto = await this.createUserUseCase.run(createUserDto);
      return new ResponseDto('User registered successfully', userDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<ResponseDto> {
    try {
      const { email, password } = loginUserDto;
      const userDto = await this.loginUserUseCase.run(email, password);
      return new ResponseDto('Login successful', userDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }
  
}