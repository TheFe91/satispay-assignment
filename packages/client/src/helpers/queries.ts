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
    query pokemonsByType($type: String!, $after: ID, $limit: Int) {
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

const TYPES = gql`
    {
        pokemons(limit: 151) {
            edges {
                node {
                    types
                }
            }
        }
    }
`;

export default {
  POKEMONS,
  POKEMONS_BY_TYPE,
  TYPES,
};
