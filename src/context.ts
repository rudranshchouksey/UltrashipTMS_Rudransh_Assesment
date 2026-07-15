import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLContext, User, Role } from './types/index.js';
import { createDataLoaders } from './dataloaders/index.js';
import { GraphQLError } from 'graphql';

const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret_key';

export const getContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  let user: User | undefined;
  const dataLoaders = createDataLoaders();

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Expecting { id: string, role: string } in token payload
      const decoded = jwt.verify(token, JWT_SECRET) as User;
      if (Object.values(Role).includes(decoded.role as Role)) {
        user = decoded;
      }
    } catch (err) {
      console.warn('Invalid JWT Token', err);
    }
  }

  return { user, dataLoaders };
};

// Auth Guard utility
export const requireAuth = (user?: User) => {
  if (!user) {
    throw new GraphQLError('You must be logged in to perform this action.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

export const requireRole = (user: User | undefined, requiredRole: Role) => {
  requireAuth(user);
  if (user!.role !== requiredRole && user!.role !== Role.ADMIN) {
    throw new GraphQLError(`Requires ${requiredRole} privileges.`, {
      extensions: { code: 'FORBIDDEN' },
    });
  }
};
