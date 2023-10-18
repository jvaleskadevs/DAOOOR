import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const APIURL = 'https://api.studio.thegraph.com/query/55781/ethonline2023/v0.0.1';

export const recentEventsQuery = `
{
  daocreateds(first: 5) {
    id
    daoTba
    daoId
    daoGovernor
  }
  daojoineds(first: 5) {
    id
    daoId
    member
  }
}
`;

export const apollo = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

apollo
  .query({
    query: gql(recentEventsQuery),
  })
  .then((data) => console.log('Subgraph data: ', data))
  .catch((err) => {
    console.log('Error fetching data: ', err)
});
