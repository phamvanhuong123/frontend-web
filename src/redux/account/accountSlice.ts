import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  avatar?: string;
}

interface IAccountState {
  accessToken: string;
  user: IUser | null;
  isAuthenticated: boolean;
  tempAvatar?: string; // Thêm trường tempAvatar để lưu avatar tạm thời khi upload
}

const initialState: IAccountState = {
  accessToken: "",
  user: null,
  isAuthenticated: false,
  tempAvatar: undefined,
};
export interface RootState {
  account: IAccountState;
}

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (
      state,
      action: PayloadAction<{
        accessToken: string;
        userInfo: IUser;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.userInfo;
      state.isAuthenticated = true;
      state.tempAvatar = undefined; // Reset tempAvatar khi login
    },
    doLogoutAction: (state) => {
      return {
        ...state,
        accessToken: "",
        refreshToken: "",
        user: null,
        isAuthenticated: false,
        tempAvatar: undefined,
      };
    },
    doUploadAvatarAction: (
      state,
      action: PayloadAction<{ avatar: string }>
    ) => {
      state.tempAvatar = action.payload.avatar; // Lưu avatar tạm thời
    },
    doUpdateUserInfoAction: (
      state,
      action: PayloadAction<{
        name: string;
        phoneNumber: string;
        avatar?: string;
      }>
    ) => {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.phoneNumber = action.payload.phoneNumber;

        // Nếu có avatar trong payload hoặc có tempAvatar thì cập nhật
        if (action.payload.avatar || state.tempAvatar) {
          state.user.avatar = action.payload.avatar || state.tempAvatar;
          state.tempAvatar = undefined; // Reset tempAvatar sau khi cập nhật
        }
      }
    },
    // Thêm action để reset tempAvatar nếu cần
    doResetTempAvatarAction: (state) => {
      state.tempAvatar = undefined;
    },
    doGetAccountAction: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

// Export tất cả các actions
export const {
  doLoginAction,
  doLogoutAction,
  doUploadAvatarAction,
  doUpdateUserInfoAction,
  doResetTempAvatarAction,
  doGetAccountAction,
} = accountSlice.actions;

export default accountSlice.reducer;
