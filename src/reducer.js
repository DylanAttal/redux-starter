// Our store is an array of bugs
// [
//   {
//     id: 1,
//     description: 'sample description here',
//     resolved: false
//   },
//   {},
//   {}...
// ]

let lastId = 0

function reducer(state = [], action) {
  if (action.type === 'bugAdded') {
    return [
      ...state,
      {
        id: ++lastId,
        description: action.payload.description,
        resolved: false,
      },
    ]
  } else if (action.type === 'bugRemoved') {
    return state.filter((bug) => bug.id !== action.payload.id)
  }

  return state
}
