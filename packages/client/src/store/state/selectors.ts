import { RootState } from '@Store/configureStore';

const getCurrentSearch = ({ pokemon: { currentSearch } }: RootState) => currentSearch;
const getCurrentTypeFilter = ({ pokemon: { currentTypeFilter } }: RootState) => currentTypeFilter;
const getCurrentPageSize = ({ pokemon: { currentPageSize } }: RootState) => currentPageSize;
const getCurrentQuery = ({ pokemon: { currentQuery } }: RootState) => currentQuery;

const getIsFetchingFilters = ({ pokemon: { filters } }: RootState) => filters.isFetching;
const getIsFetchedFilters = ({ pokemon: { filters } }: RootState) => filters.isFetched;
const getIsErrorFilters = ({ pokemon: { filters } }: RootState) => filters.isError;
const getFiltersError = ({ pokemon: { filters } }: RootState) => filters.error;
const getFilters = ({ pokemon: { filters } }: RootState) => filters.item;

const getIsFetchingData = ({ pokemon: { data } }: RootState) => data.isFetching;
const getIsFetchedData = ({ pokemon: { data } }: RootState) => data.isFetched;
const getIsErrorData = ({ pokemon: { data } }: RootState) => data.isError;
const getDataError = ({ pokemon: { data } }: RootState) => data.error;
const getData = ({ pokemon: { data } }: RootState) => data.item;

export default {
  getCurrentSearch,
  getCurrentTypeFilter,
  getCurrentPageSize,
  getCurrentQuery,

  getIsFetchingFilters,
  getIsFetchedFilters,
  getIsErrorFilters,
  getFiltersError,
  getFilters,

  getIsFetchingData,
  getIsFetchedData,
  getIsErrorData,
  getDataError,
  getData,
};
