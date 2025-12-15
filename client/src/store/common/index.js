import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* GET */
export const getFeatureImages = createAsyncThunk("feature/get", async () => {
  const res = await axios.get("http://localhost:5000/api/common/feature/get", {
    withCredentials: true,
  });
  return res.data;
});

/* ADD */
export const addFeatureImage = createAsyncThunk(
  "feature/add",
  async (image) => {
    const res = await axios.post(
      "http://localhost:5000/api/common/feature/add",
      { image },
      { withCredentials: true }
    );
    return res.data;
  }
);

/* ✅ DELETE */
export const deleteFeatureImage = createAsyncThunk(
  "feature/delete",
  async (id) => {
    const res = await axios.delete(
      `http://localhost:5000/api/common/feature/delete/${id}`,
      { withCredentials: true }
    );
    return { id, ...res.data };
  }
);

const commonFeatureSlice = createSlice({
  name: "commonFeature",
  initialState: {
    featureImageList: [],
    isLoading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.featureImageList = action.payload.data;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (item) => item._id !== action.payload.id
        );
      });
  },
});

export default commonFeatureSlice.reducer;
