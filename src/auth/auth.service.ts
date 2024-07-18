import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/infraestructure/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: UserDto): Promise<string> {
    const payload = { sub: user.uuid, email: user.email };
    return this.jwtService.sign(payload);
  }
  
}