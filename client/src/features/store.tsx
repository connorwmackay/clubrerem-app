import { configureStore } from '@reduxjs/toolkit'
// ...

import authenticatedUser from './authenticatedUser'
import findUser from './findUser'
import navbar from './navbar'
import updateUser from './updateUser'

export const store = configureStore({
  reducer: {
    authenticatedUser: authenticatedUser,
    findUser: findUser,
    updateUser:  updateUser,
    navbar: navbar
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch