import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/product/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "https://mern-ecom-7jq8.onrender.com/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const fetchAllproduct = createAsyncThunk(
  "/product/fetchAllproduct",
  async () => {
    const result = await axios.get(
      "https://mern-ecom-7jq8.onrender.com/api/admin/products/get"
    );
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/product/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `https://mern-ecom-7jq8.onrender.com/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `https://mern-ecom-7jq8.onrender.com/api/admin/products/delete/${id}`
    );
    return result?.data;
  }
);

const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllproduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllproduct.fulfilled, (state, action) => {
        console.log(action.payload.data);

        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllproduct.rejected, (state, action) => {
        console.log(action.payload);

        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductSlice.reducer;
