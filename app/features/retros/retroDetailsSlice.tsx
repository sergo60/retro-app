import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RetroDetailsState {
  keep: string[];
  drop: string[];
  start: string[];
  mood: number | null;
}

const initialState: RetroDetailsState = {
  keep: [],
  drop: [],
  start: [],
  mood: null,
};

const retroDetailsSlice = createSlice({
  name: 'retroDetails',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ tab: 'Keep' | 'Drop' | 'Start'; value: string }>) {
      state[action.payload.tab.toLowerCase() as keyof RetroDetailsState].push(action.payload.value);
    },
    deleteItem(state, action: PayloadAction<{ tab: 'Keep' | 'Drop' | 'Start'; index: number }>) {
      state[action.payload.tab.toLowerCase() as keyof RetroDetailsState].splice(
        action.payload.index,
        1,
      );
    },
    setMood(state, action: PayloadAction<number | null>) {
      state.mood = action.payload;
    },
    reset(state) {
      state.keep = [];
      state.drop = [];
      state.start = [];
      state.mood = null;
    },
    setInitialData(
      state,
      action: PayloadAction<{
        keep: string[];
        drop: string[];
        start: string[];
        mood: number | null;
      }>,
    ) {
      state.keep = action.payload.keep;
      state.drop = action.payload.drop;
      state.start = action.payload.start;
      state.mood = action.payload.mood;
    },
  },
});

export const { addItem, deleteItem, setMood, reset, setInitialData } = retroDetailsSlice.actions;
export default retroDetailsSlice.reducer;
