import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'https://backend-six-plum.vercel.app/api/graphql' }), // Update this URL if needed
    cache: new InMemoryCache(),
  };
}

export const appConfig = {
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
};
