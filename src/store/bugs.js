import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { apiCallBegan } from './api'
import moment from 'moment'
import axios from 'axios'

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
      bugs.lastFetch = Date.now()
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false
    },
    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload
      const index = bugs.list.findIndex((bug) => bug.id === bugId)
      bugs.list[index].userId = userId
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload)
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id)
      bugs.list[index].resolved = true
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

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs

  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')

  // Caching -- if we have loaded bugs in less than 10 minutes
  // then do not send request to server again.
  if (diffInMinutes < 10) {
    return
  }

  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  )
}

// export const addBug = (bug) => async (dispatch) => {
//   const response = await axios.request({
//     baseURL: 'http://localhost:9001/api',
//     url: '/bugs',
//     method: 'post',
//     data: bug,
//   })

//   dispatch(bugAdded(response.data))
// }

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: 'post',
    data: bug,
    onSuccess: bugAdded.type,
  })

export const resolveBug = (id) =>
  apiCallBegan({
    // PATCH /bugs/:bugId
    url: url + '/' + id,
    method: 'patch',
    data: { resolved: true },
    onSuccess: bugResolved.type,
  })

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + '/' + bugId,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type,
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
  (bugs, projects) => bugs.list.filter((bug) => !bug.resolved)
)

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  )
