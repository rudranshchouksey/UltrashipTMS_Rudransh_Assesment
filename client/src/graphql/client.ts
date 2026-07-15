import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the user role from local storage if it exists
  const role = localStorage.getItem('userRole') || 'ADMIN';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-user-role': role,
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Shipment: {
        fields: {
          origin: {
            merge: true,
          },
          destination: {
            merge: true,
          },
        },
      },
    },
  })
});
