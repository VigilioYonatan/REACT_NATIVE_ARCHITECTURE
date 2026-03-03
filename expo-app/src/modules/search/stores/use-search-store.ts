import { storage } from "@src/infrastructure/utils/storage";
import { create } from "zustand";


interface SearchState {
  query: string;
  isFiltersOpen: boolean;
  filters: {
    genre_id?: number;
    year?: number;
    rating?: number;
  };
  recentSearches: string[];
  
  setQuery: (query: string) => void;
  setFiltersOpen: (isOpen: boolean) => void;
  setFilters: (filters: SearchState["filters"]) => void;
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  isFiltersOpen: false,
  filters: {},
  recentSearches: JSON.parse(storage.getString("recent_searches") || "[]"),

  setQuery: (query) => set({ query }),
  setFiltersOpen: (isOpen) => set({ isFiltersOpen: isOpen }),
  setFilters: (filters) => set({ filters }),
  
  addRecentSearch: (term) => {
    if (!term.trim()) return;
    const current = get().recentSearches;
    const updated = [term, ...current.filter((t) => t !== term)].slice(0, 10);
    storage.set("recent_searches", JSON.stringify(updated));
    set({ recentSearches: updated });
  },

  removeRecentSearch: (term) => {
    const current = get().recentSearches;
    const updated = current.filter((t) => t !== term);
    storage.set("recent_searches", JSON.stringify(updated));
    set({ recentSearches: updated });
  },

  clearHistory: () => {
    storage.remove("recent_searches");
    set({ recentSearches: [] });
  }
}));
