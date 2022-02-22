import { gql } from '@apollo/client';

const POKEMONS = gql`
    query pokemons($q: String) {
        pokemons(q: $q) {
            edges {
                node {
                    id
                    name
                    types
                    classification
                }
            }
            pageInfo {
                endCursor,
                hasNextPage
            }
        }
    }
`;

const POKEMONS_BY_TYPE = gql`
    {
        pokemons {
            edges {
                node {
                    id
                    name
                    types
                    classification
                }
            }
            pageInfo {
                endCursor,
                hasNextPage
            }
        }
    }
`;

export default {
  POKEMONS,
  POKEMONS_BY_TYPE,
};
