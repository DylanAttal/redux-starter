import { createAction, createReducer } from '@reduxjs/toolkit'

// Action creators
export const bugAdded = createAction('bugAdded')
export const bugRemoved = createAction('bugRemoved')
export const bugResolved = createAction('bugResolved')

// Reducers
let lastId = 0

export default createReducer([], {
  // key: value
  // actions: functions (event) => event-handler
  [bugAdded.type]: (bugs, action) => {
    bugs.push({
      id: ++lastId,
      description: action.payload.description,
      resolved: false,
    })
  },
  [bugResolved.type]: (bugs, action) => {
    index = bugs.findIndex((bug) => bug.id === action.payload.id)
    bugs[index].resolved = true
  },
})
