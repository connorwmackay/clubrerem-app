import { configureStore } from '@reduxjs/toolkit'
// ...

import authenticatedUser from './authenticatedUser'
import findUser from './findUser'
import navbar from './navbar'
import updateUser from './updateUser'
import updateProfile from './profileUpdate'
import signup from './signup'
import search from './search'
import friendList from './friendsList'
import findClub from './findClub'
import createClub from './createClub'
import joinClub from './joinClub'
import findClubMember from './findClubMember'
import findAllClubMembers from './findAllClubMembers'
import findClubBulletin from './findClubBulletin'
import findAllClubBulletins from './findAllClubBulletins'
import createClubBulletin from './createClubBulletin'
import clubList from './ClubList'

export const store = configureStore({
  reducer: {
    authenticatedUser: authenticatedUser,
    findUser: findUser,
    updateUser: updateUser,
    updateProfile: updateProfile,
    navbar: navbar,
    signup: signup,
    search: search,
    friendList: friendList,
    findClub: findClub,
    createClub: createClub,
    joinClub: joinClub,
    findClubMember: findClubMember,
    findAllClubMembers: findAllClubMembers,
    findClubBulletin: findClubBulletin,
    findAllClubBulletins: findAllClubBulletins,
    createClubBulletin: createClubBulletin,
    clubList: clubList
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch