import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { apiCallBegan } from './api'

let lastId = 0

const slice = createSlice({
  name: 'bugs',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload
      bugs.loading = false
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false
    },
    bugAssignedToUser: (bugs, action) => {
      const { bugId, userId } = action.payload
      const index = bugs.list.findIndex((bug) => bug.id === bugId)
      bugs[index].userId = userId
    },
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      })
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id)
      bugs[index].resolved = true
    },
  },
})

export const {
  bugAdded,
  bugAssignedToUser,
  bugResolved,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
} = slice.actions
export default slice.reducer

// Action creators
const url = '/bugs'

export const loadBugs = () =>
  apiCallBegan({
    url,
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestFailed.type,
  })

// Selector (takes state and returns computed state)
// export const getUnresolvedBugs = (state) =>
//   state.entities.bugs.filter((bug) => !bug.resolved)

// Memoization (a technique for optimizing expensive functions)
// f(x) => y (build a cache of inputs and outputs) {input: 1, output: 2}
// the next time we call this function, before we actually execute it and run
// through that expensive logic, we can look at the cache, and we know that we
// previously passed 1 as the input, so if we're passing 1 again we already know
// that the output should be 2 and we can just grab that from the cache.
// This improves the app's performance.
// We're using the 'reselect' library to help with this.
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (state) => state.entities.projects,
  (bugs, projects) => !bugs.list.resolved
)

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  )
