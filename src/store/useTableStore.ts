import { create } from 'zustand';

export interface TableRecord {
  id: string;
  name: string;
  date: string;
  value: number;
}

interface TableStore {
  records: TableRecord[];
  searchQuery: string;

  addRecord: (record: TableRecord) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (updatedRecord: TableRecord) => void;
  setSearchQuery: (query: string) => void;
}

export const useTableStore = create<TableStore>((set) => ({
  records: [],
  searchQuery: '',


  addRecord: (record) =>
    set((state) => ({ records: [...state.records, record] })),

  deleteRecord: (id) =>
    set((state) => ({ records: state.records.filter((r) => r.id !== id) })),

  updateRecord: (updatedRecord) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === updatedRecord.id ? updatedRecord : r
      )
    })),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),
}));