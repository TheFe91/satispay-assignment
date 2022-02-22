import PokemonQueryResult, { Edge, PokemonDataSource } from '../interfaces/pokemonByType';

const GqlDataAdapter = (data: PokemonQueryResult) => {
  const { pokemonsByType, pokemons } = data;

  const { pageInfo, edges } = (pokemons || pokemonsByType)!;

  const nodes: PokemonDataSource[] = edges.map(({
    node: {
      id, name, types, classification,
    },
  }: Edge) => ({
    key: id,
    name,
    type: types.reduce((acc: string, el: string) => `${acc} ${el}`, ''),
    classification,
  }));

  return {
    hasNextPage: pageInfo.hasNextPage,
    nodes,
  };
};

export default GqlDataAdapter;
