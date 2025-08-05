import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Mood = number | null;

type RetroDetailsState = {
  keep: string[];
  drop: string[];
  start: string[];
  mood: Mood;
};

const initialState: RetroDetailsState = {
  keep: [],
  drop: [],
  start: [],
  mood: null,
};

export const retroDetailsSlice = createSlice({
  name: 'retroDetails',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ tab: 'Keep' | 'Drop' | 'Start'; value: string }>
    ) => {
      const { tab, value } = action.payload;
      if (!value.trim()) return;

      const target = tab.toLowerCase() as keyof RetroDetailsState;
      state[target].push(value.trim());
    },
    deleteItem: (
      state,
      action: PayloadAction<{ tab: 'Keep' | 'Drop' | 'Start'; index: number }>
    ) => {
      const { tab, index } = action.payload;
      const target = tab.toLowerCase() as keyof RetroDetailsState;
      state[target].splice(index, 1);
    },
    setMood: (state, action: PayloadAction<Mood>) => {
      state.mood = action.payload;
    },
    resetItems: state => {
      state.keep = [];
      state.drop = [];
      state.start = [];
      state.mood = null;
    },
    setItemsFromSnapshot: (
      state,
      action: PayloadAction<Partial<RetroDetailsState>>
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  addItem,
  deleteItem,
  setMood,
  resetItems,
  setItemsFromSnapshot,
} = retroDetailsSlice.actions;

export default retroDetailsSlice.reducer;
