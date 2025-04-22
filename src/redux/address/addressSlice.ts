// src/redux/address/addressSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressApi } from '~/services/axios.address';

interface AddressState {
  provinces: any[];
  districts: any[];
  wards: any[];
  loading: {
    provinces: boolean;
    districts: boolean;
    wards: boolean;
  };
  selected: {
    province?: string;
    district?: string;
    ward?: string;
  };
}

const initialState: AddressState = {
  provinces: [],
  districts: [],
  wards: [],
  loading: {
    provinces: false,
    districts: false,
    wards: false
  },
  selected: {}
};

export const fetchProvinces = createAsyncThunk(
  'address/fetchProvinces',
  async () => {
    return await addressApi.getProvinces();
  }
);

export const fetchDistricts = createAsyncThunk(
  'address/fetchDistricts',
  async (provinceCode: string) => {
    return await addressApi.getDistrictsByProvince(provinceCode);
  }
);

export const fetchWards = createAsyncThunk(
  'address/fetchWards',
  async (districtCode: string) => {
    return await addressApi.getWardsByDistrict(districtCode);
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetAddress: (state) => {
      state.districts = [];
      state.wards = [];
      state.selected = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading.provinces = true;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.provinces = action.payload;
        state.loading.provinces = false;
      })
      .addCase(fetchProvinces.rejected, (state) => {
        state.loading.provinces = false;
      })
      
      // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading.districts = true;
        state.wards = [];
        state.selected.district = undefined;
        state.selected.ward = undefined;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.loading.districts = false;
      })
      .addCase(fetchDistricts.rejected, (state) => {
        state.loading.districts = false;
      })
      
      // Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading.wards = true;
        state.selected.ward = undefined;
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.wards = action.payload;
        state.loading.wards = false;
      })
      .addCase(fetchWards.rejected, (state) => {
        state.loading.wards = false;
      });
  }
});

export const { resetAddress } = addressSlice.actions;
export default addressSlice.reducer;