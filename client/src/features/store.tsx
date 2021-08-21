import { configureStore } from '@reduxjs/toolkit'
// ...

import authenticatedUser from './authenticatedUser'
import navbar from './navbar'

export const store = configureStore({
  reducer: {
    authenticatedUser: authenticatedUser,
    navbar: navbar
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch