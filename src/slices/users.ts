import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BoardSlice } from '@/src/types/boards'

const initialState = {
  users: [],
  fetching: false,
  status: 'idle',
  error: ''
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice }
  let users = board.board.users
  const createdBy = board.board.createdBy

  console.log('fetching users', users)

  users = [...users, createdBy]

  let userPromise: any[] = []
  for (let i = 0; i < users.length; i++) {
    userPromise.push(fetch(`/api/users/${users[i]}`))
  }

  userPromise = await Promise.all(userPromise)
  const jsonPromise: any[] = []

  for (let i = 0; i < userPromise.length; i++) {
    const json = userPromise[i].json()
    jsonPromise.push(json)
  }

  const usersData = await Promise.all(jsonPromise)

  return usersData
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsersData: () => initialState
  },
  extraReducers: {
    [fetchUsers.pending.toString()]: (state) => {
      state.status = 'pending'
    },
    [fetchUsers.fulfilled.toString()]: (state, { payload }) => {
      state.status = 'success'
      state.users = payload
    },
    [fetchUsers.rejected.toString()]: (state, { payload }) => {
      state.status = 'failed'
      state.error = payload && payload.error
    }
  }
})

export const { resetUsersData } = usersSlice.actions

export default usersSlice.reducer
