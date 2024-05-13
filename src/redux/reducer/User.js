import { createSlice } from '@reduxjs/toolkit';

export const expenseSlice = createSlice({
  name: 'expenseData',
  initialState: {
    expenseData: [],
    isDelete: false,
  },
  reducers: {
    addExp: (state, action) => {
      state.expenseData.push(action.payload);
    },
    toggleDelete: (state) => {
      state.isDelete = !state.isDelete
    },
    deleteExpense: (state, action) => {
      state.expenseData = state.expenseData.filter((data, index) => index !== action.payload)
    },
    resetExpenses: (state) => {
      state.expenseData = [];
    },
  }
});

export const { addExp, toggleDelete, deleteExpense, resetExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
