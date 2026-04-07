import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsService } from './post.service';
import { PrismaService } from './prisma.service';
import { UsersService } from './user.service';
import { UserModule } from './user/user.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [UserModule, IamModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, PostsService],
})
export class AppModule {}
