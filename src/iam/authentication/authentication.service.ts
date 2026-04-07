import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from 'src/prisma.service';

import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    try {
      const hashedPassword = await this.hashingService.hash(signUpDto.password);

      await this.prismaService.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
        },
      });
    } catch (err: unknown) {
      const uniqueConstraintErrorCode = 'P2002';

      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === uniqueConstraintErrorCode
      ) {
        throw new ConflictException('Email already exists.');
      }

      throw err;
    }
  }

  async signin(signInDto: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Signin unsuccessfully.');
    }

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Signin unsuccessfully!');
    }

    // TODO
    return true;
  }
}
