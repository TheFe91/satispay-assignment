interface Node {
  classification: string;
  id: string;
  name: string;
  types: string[];
}

interface Edge {
  node: Node;
}

interface PageInfo {
  hasNextPage: boolean;
}

interface QueryResult {
  edges: Edge[];
  pageInfo: PageInfo;
}

interface PokemonQueryResult {
  pokemonsByType?: QueryResult;
  pokemons?: QueryResult;
}

interface PokemonDataSource {
  key: string;
  name: string;
  type: string;
  classification: string;
}

export default PokemonQueryResult;

export type {
  Edge,
  Node,
  PokemonDataSource,
};
