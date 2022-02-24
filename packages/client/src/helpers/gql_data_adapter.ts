import PokemonQueryResult, { Edge, PokemonDataSource, QueryAdapterData } from '../interfaces/interfaces';

function GqlDataAdapter(data: PokemonQueryResult): QueryAdapterData {
  const { pokemonsByType, pokemons } = data;

  const { pageInfo: { hasNextPage, endCursor }, edges } = (pokemons || pokemonsByType)!;

  const dataSource: PokemonDataSource[] = edges.map(({
    node: {
      id, name, types, classification,
    },
  }: Edge) => ({
    key: id,
    name,
    types: types.reduce((acc: string, el: string) => `${acc}${el} - `, '').slice(0, -3),
    classification,
  }));

  return {
    hasNextPage,
    endCursor,
    dataSource,
    nodes: edges.map(({ node }) => node),
  };
}

export default GqlDataAdapter;
