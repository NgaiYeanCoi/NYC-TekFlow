import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  sidebarCollapsed: boolean;
  lastDashboardTab: string;
};

const initialState: UiState = {
  sidebarCollapsed: false,
  lastDashboardTab: "posts",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setLastDashboardTab(state, action: PayloadAction<string>) {
      state.lastDashboardTab = action.payload;
    },
  },
});

export const { setLastDashboardTab, setSidebarCollapsed } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

