import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { refresh: false },
  reducers: {
    setDashboardRefresh: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { setDashboardRefresh } = dashboardSlice.actions;
export default dashboardSlice.reducer;
