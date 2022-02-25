import { RootState } from '@Store/configureStore';

const getCurrentSearch = ({ pokemon: { currentSearch } }: RootState) => currentSearch;
const getCurrentTypeFilter = ({ pokemon: { currentTypeFilter } }: RootState) => currentTypeFilter;
const getCurrentPageSize = ({ pokemon: { currentPageSize } }: RootState) => currentPageSize;
const getCurrentQuery = ({ pokemon: { currentQuery } }: RootState) => currentQuery;
const getFilters = ({ pokemon: { filters } }: RootState) => filters;
const getData = ({ pokemon: { data } }: RootState) => data;

export default {
  getCurrentSearch,
  getCurrentTypeFilter,
  getCurrentPageSize,
  getCurrentQuery,
  getFilters,
  getData,
};
