import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//CREATE THE THUNK
export const postNewUser = createAsyncThunk(
  "users/postNewUser",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/users/register",
        info
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message
          ? error.response.data.message
          : error.response.data.errors.password.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "users/login", 
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/users/login",
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/auth/users",info);

      return res.data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const getUser = createAsyncThunk(
  'users/getUser',
  async (id, { rejectWithValue}) => {
    try {
      const res = await axios.get(`http://localhost:5000/auth/users/getuser/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/auth/users/${info.id}`, info.data, {
        headers: { token: localStorage.getItem('token') },
      });
      dispatch(getUsers());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const addPic = createAsyncThunk(
  'users/addpic',
  async (info, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    formData.append('picture', info.file);
    try {
      const res = await axios.post('http://localhost:5000/auth/users/register', formData, {
        headers: { token: localStorage.getItem('token') },
      });
      dispatch(getUsers());
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message
          ? error.response.data.message
          : error.response.data.errors.password.msg
      );
    }
  }
);
export const updateImage = createAsyncThunk(
  'users/uploadPic',
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('profileImg', info.file);
      const res = await axios.put(`http://localhost:5000/auth/users/uploadPic/${info._id}`, formData, {
        headers: { token: localStorage.getItem('token') },
      });
      dispatch(getUsers());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const updateAccount = createAsyncThunk(
  'posts/updateInfo',
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`http://localhost:5000/auth/users/updateInfo/${info._id}`, info.data, {
        headers: { token: localStorage.getItem('token') },
      });
      dispatch(getUser());
      return res.data;
    } catch (error)
   {
    console.log(error)
      return rejectWithValue(error.response.data.message);
    }
  }
);
//HANDLE ACTIONS IN THE REDUCERS

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users:[],
    user: {},
    loading: false,
    userErrors: null,
    usersErrors:null,
    Errors: null,
    userInfo: JSON.parse(localStorage.getItem('user')),
    registerErrors: null,
    loginErrors: null,
    token: localStorage.getItem('token'),
    isAuth: Boolean(localStorage.getItem('isAuth')),
  },
  reducers: {
    logout: (state) => {
      console.log('logout');
      state.isAuth = false;
      state.userInfo = {};
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuth');
    },
    clearErrors: (state) => {
      state.registerErrors = null;
      state.loginErrors = null;
    },
  },
  extraReducers: {
    [postNewUser.pending]: (state) => {
      state.loading = true;
    },
    [postNewUser.fulfilled]: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('isAuth', true);
    },
    [postNewUser.rejected]: (state, action) => {
      state.registerErrors = action.payload;
      state.isAuth = false;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('isAuth', true);
    },
    [login.rejected]: (state, action) => {
      state.loginErrors = action.payload;
      state.isAuth = false;
    },
    [getUsers.pending]: (state) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.usersErrors = null;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    [getUser.pending]: (state) => {
      state.loading = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.userErrors = null;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    [updateAccount.pending]: (state) => {
      state.loading = true;
    },
    [updateAccount.fulfilled]: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
    },
    [updateAccount.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },

  },
});

export default userSlice.reducer;
export const { logout, clearErrors } = userSlice.actions;
