import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types

export type User={
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  bio: string;
  password?: string; // Optional for OAuth users
}

// Store type
type StudySyncStore = {
  
  // UI state
  sidebarOpen: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;

};



// Create the store
export const useStore = create<StudySyncStore>()(
  persist(
    (set, get) => ({
      // Initial data

      // UI state
      sidebarOpen: true,

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "studysync-storage",
    }
  )
);
// for local development
// Uncomment the line below to clear the local storage
// useStore.persist.clearStorage();
