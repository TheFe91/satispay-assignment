import { gql } from '@apollo/client';

const POKEMONS = gql`
    query pokemons($q: String, $after: ID, $limit: Int) {
        pokemons(q: $q, after: $after, limit: $limit) {
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
    query pokemonsByType($type: String!, $after: Int, $limit: Int) {
        pokemonsByType(type: $type, after: $after, limit: $limit) {
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
