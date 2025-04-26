import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addressApi } from "~/services/axios.address";

// Định nghĩa kiểu dữ liệu cho địa chỉ
interface AddressItem {
  code: string;
  name: string;
}

interface AddressState {
  cities: AddressItem[];
  districts: AddressItem[];
  wards: AddressItem[];
  loading: {
    cities: boolean;
    districts: boolean;
    wards: boolean;
  };
  selected: {
    city?: string;
    district?: string;
    ward?: string;
  };
  error: {
    cities?: string;
    districts?: string;
    wards?: string;
  };
  fullAddress?: string; // Chuỗi địa chỉ đầy đủ
  search: {
    cities: AddressItem[];
    districts: AddressItem[];
    wards: AddressItem[];
  }; // Kết quả tìm kiếm
}

// Đảm bảo trạng thái ban đầu tương thích với redux-persist
const initialState: AddressState = {
  cities: [],
  districts: [],
  wards: [],
  loading: {
    cities: false,
    districts: false,
    wards: false,
  },
  selected: {},
  error: {},
  fullAddress: undefined,
  search: {
    cities: [],
    districts: [],
    wards: [],
  },
};

// Async Thunks
export const fetchProvinces = createAsyncThunk(
  "address/fetchProvinces",
  async (_, { rejectWithValue }) => {
    try {
      return await addressApi.getProvinces();
    } catch (error) {
      return rejectWithValue("Không thể tải danh sách tỉnh/thành phố");
    }
  }
);

export const fetchDistricts = createAsyncThunk(
  "address/fetchDistricts",
  async (provinceCode: string, { rejectWithValue }) => {
    try {
      return await addressApi.getDistrictsByProvince(provinceCode);
    } catch (error) {
      return rejectWithValue("Không thể tải danh sách quận/huyện");
    }
  }
);

export const fetchWards = createAsyncThunk(
  "address/fetchWards",
  async (districtCode: string, { rejectWithValue }) => {
    try {
      return await addressApi.getWardsByDistrict(districtCode);
    } catch (error) {
      return rejectWithValue("Không thể tải danh sách phường/xã");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // Reset toàn bộ trạng thái
    resetAddress: (state) => {
      state.districts = [];
      state.wards = [];
      state.selected = {};
      state.fullAddress = undefined;
      state.error = {};
      state.search = { cities: [], districts: [], wards: [] };
    },
    // Reset quận/huyện và phường/xã
    resetDistrictsAndWards: (state) => {
      state.districts = [];
      state.wards = [];
      state.selected.district = undefined;
      state.selected.ward = undefined;
      state.fullAddress = undefined;
      state.search.districts = [];
      state.search.wards = [];
    },
    // Reset phường/xã
    resetWards: (state) => {
      state.wards = [];
      state.selected.ward = undefined;
      state.fullAddress = undefined;
      state.search.wards = [];
    },
    // Cập nhật địa chỉ đã chọn và tạo fullAddress
    doSetSelectedAddressAction: (
      state,
      action: PayloadAction<{
        city?: string;
        district?: string;
        ward?: string;
      }>
    ) => {
      const { city, district, ward } = action.payload;
      state.selected = {
        city: city ?? state.selected.city,
        district: district ?? state.selected.district,
        ward: ward ?? state.selected.ward,
      };

      // Tạo chuỗi địa chỉ đầy đủ
      const cityName = state.cities.find(
        (p) => p.code === state.selected.city
      )?.name;
      const districtName = state.districts.find(
        (d) => d.code === state.selected.district
      )?.name;
      const wardName = state.wards.find(
        (w) => w.code === state.selected.ward
      )?.name;

      const addressParts = [wardName, districtName, cityName].filter(
        (part) => part
      );
      state.fullAddress =
        addressParts.length > 0 ? addressParts.join(", ") : undefined;
    },
    // Tìm kiếm địa chỉ
    searchAddress: (
      state,
      action: PayloadAction<{
        level: "cities" | "districts" | "wards";
        keyword: string;
      }>
    ) => {
      const { level, keyword } = action.payload;
      const data = state[level];
      state.search[level] = keyword
        ? data.filter((item) =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
          )
        : data;
    },
  },
  extraReducers: (builder) => {
    builder
      // Provinces
      .addCase(fetchProvinces.pending, (state) => {
        state.loading.cities = true;
        state.error.cities = undefined;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.search.cities = action.payload; // Đồng bộ với tìm kiếm
        state.loading.cities = false;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading.cities = false;
        state.error.cities = action.payload as string;
      })

      // Districts
      .addCase(fetchDistricts.pending, (state) => {
        state.loading.districts = true;
        state.error.districts = undefined;
        state.wards = [];
        state.selected.district = undefined;
        state.selected.ward = undefined;
        state.fullAddress = undefined;
        state.search.districts = [];
        state.search.wards = [];
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.search.districts = action.payload; // Đồng bộ với tìm kiếm
        state.loading.districts = false;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.loading.districts = false;
        state.error.districts = action.payload as string;
      })

      // Wards
      .addCase(fetchWards.pending, (state) => {
        state.loading.wards = true;
        state.error.wards = undefined;
        state.selected.ward = undefined;
        state.fullAddress = undefined;
        state.search.wards = [];
      })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.wards = action.payload;
        state.search.wards = action.payload; // Đồng bộ với tìm kiếm
        state.loading.wards = false;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.loading.wards = false;
        state.error.wards = action.payload as string;
      });
  },
});

// Validate địa chỉ
export const validateAddress = (selected: AddressState["selected"]) => {
  const errors: string[] = [];
  if (!selected.city) errors.push("Vui lòng chọn tỉnh/thành phố");
  if (!selected.district) errors.push("Vui lòng chọn quận/huyện");
  if (!selected.ward) errors.push("Vui lòng chọn phường/xã");
  return errors.length > 0 ? errors : null;
};

// Export actions
export const {
  resetAddress,
  resetDistrictsAndWards,
  resetWards,
  doSetSelectedAddressAction,
  searchAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
