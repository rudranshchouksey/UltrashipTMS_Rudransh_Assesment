import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
// @ts-ignore
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { getContext } from './context.js';
import { GraphQLContext } from './types/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Ultraship TMS GraphQL API is running. Access /graphql to use the API.');
});

async function startServer() {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Diagnostic Middleware for CORS and Preflight checks
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS' || req.headers.origin) {
      console.log(`[Diagnostic CORS] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'None'}`);
    }
    next();
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: getContext as any,
    }) as unknown as express.RequestHandler
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server', err);
});
