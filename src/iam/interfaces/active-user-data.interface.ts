import { Role } from 'src/generated/prisma/enums';

export interface ActiveUserData {
  sub: string;
  email: string;
  role: Role;
}
