import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('sign-up')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
}
