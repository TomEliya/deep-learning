import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  regular: true,
  fake: false,
  real: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    regular(state) {
      state.regular = true;
      state.fake = false;
      state.real = false;
    },
    fake(state) {
      state.regular = false;
      state.fake = true;
      state.real = false;
    },
    real(state) {
      state.regular = false;
      state.fake = false;
      state.real = true;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
