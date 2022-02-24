interface Node {
  classification: string;
  id: string;
  name: string;
  types: Array<string>;
}

interface Edge {
  node: Node;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface QueryResult {
  edges: Array<Edge>;
  pageInfo: PageInfo;
}

interface PokemonQueryResult {
  pokemonsByType?: QueryResult;
  pokemons?: QueryResult;
}

interface PokemonQueryVars {
  q?: string;
  after?: string;
  limit?: number;
}

interface PokemonByTypeQueryVars {
  type?: string;
  after?: string;
  limit?: number;
}

interface PokemonDataSource {
  key: string;
  name: string;
  types: string;
  classification: string;
}

interface QueryAdapterData {
  hasNextPage: boolean;
  endCursor: string;
  dataSource: Array<PokemonDataSource>;
  nodes: Array<Node>;
}

export default PokemonQueryResult;

export type {
  Edge,
  Node,
  PokemonDataSource,
  QueryAdapterData,
  PokemonQueryVars,
  PokemonByTypeQueryVars,
};
