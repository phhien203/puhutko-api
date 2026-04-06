import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (typeof connectionString !== 'string' || connectionString.length === 0) {
      throw new Error(
        'DATABASE_URL is missing or invalid. Ensure .env is loaded and DATABASE_URL is a non-empty string.',
      );
    }

    const adapter = new PrismaPg({
      connectionString,
    });

    super({ adapter });
  }
}
