import PokemonQueryResult, { Edge, PokemonDataSource, QueryAdapterData } from '@Interfaces/interfaces';

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

function GqlTypesAdapter(data: PokemonQueryResult): Array<string> {
  if (data) {
    const { pokemons } = data;

    const { edges } = pokemons!;

    const allTypes = edges.map(({ node: { types } }: Edge) => types);

    return [...new Set(allTypes.flat())].sort();
  }

  return [];
}

export default GqlDataAdapter;

export {
  GqlTypesAdapter,
};
