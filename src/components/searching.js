import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    return (data, state, action) => {
      const query = (state?.[searchField] ?? '').toString().trim();
      if (!query) return data; // эквивалентно "skipEmptyTargetValues"
  
      // поиск по нескольким полям, как в задании
      const compare = createComparison([
        ['searchMultipleFields', searchField, ['date', 'customer', 'seller'], false],
      ]);
  
      return data.filter(row => compare(row, state));
    };
  }