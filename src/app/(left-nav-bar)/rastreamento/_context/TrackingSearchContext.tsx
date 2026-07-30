"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type TrackingSearchContextValue = {
  query: string;
  setQuery: (query: string) => void;
};

const TrackingSearchContext =
  createContext<TrackingSearchContextValue | null>(null);

export function TrackingSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);

  return (
    <TrackingSearchContext.Provider value={value}>
      {children}
    </TrackingSearchContext.Provider>
  );
}

export function useTrackingSearch() {
  const context = useContext(TrackingSearchContext);

  if (!context) {
    throw new Error(
      "useTrackingSearch deve ser usado dentro de TrackingSearchProvider.",
    );
  }

  return context;
}
