import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const APIURL = 'https://api.studio.thegraph.com/query/55781/ethonline2023/v0.0.2';

export const allDAOEventsQuery = `
{
  daocreateds {
    id
    daoId
    daoTba
    daoGovernor
    daoUri
    data
    price
  }
  daojoineds {
    id
    daoId
    member
    price
  }
}
`;

export const apollo = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

/*
apollo
  .query({
    query: gql(allDAOEventsQuery),
  })
  .then((data) => console.log('Subgraph data: ', data))
  .catch((err) => {
    console.log('Error fetching data: ', err)
});
*/
