jest.mock('./user.service', () => ({
  UsersService: class UsersService {},
}));

jest.mock('./post.service', () => ({
  PostsService: class PostsService {},
}));

jest.mock('./prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PostsService } from './post.service';
import { PrismaService } from './prisma.service';
import { UsersService } from './user.service';

describe('AppController', () => {
  let appController: AppController;
  const prismaServiceMock = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    prismaServiceMock.$queryRaw.mockReset();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: PostsService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns an ok healthcheck when the database is reachable', async () => {
    prismaServiceMock.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    await expect(appController.healthcheck()).resolves.toEqual({
      status: 'ok',
      database: 'connected',
    });
  });

  it('throws service unavailable when the database check fails', async () => {
    prismaServiceMock.$queryRaw.mockRejectedValueOnce(new Error('db down'));

    await expect(appController.healthcheck()).rejects.toMatchObject({
      status: 503,
    });
  });
});
