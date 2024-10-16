import { User } from '@prisma/client';

export const generateToken = (jwt: any, user: User) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.username });
};
