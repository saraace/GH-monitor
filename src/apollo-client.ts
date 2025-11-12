import { ApolloClient, InMemoryCache, createHttpLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from environment variable
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
