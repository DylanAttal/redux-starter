import { bugAdded, bugResolved, getUnresolvedBugs } from './store/bugs'
import { projectAdded } from './store/projects'
import configureStore from './store/configureStore'

const store = configureStore()

store.subscribe(() => {
  console.log('Store changed')
})

store.dispatch(projectAdded({ name: 'Project 1' }))

store.dispatch(bugAdded({ description: 'Bug 1' }))
store.dispatch(bugAdded({ description: 'Bug 2' }))
store.dispatch(bugAdded({ description: 'Bug 3' }))

store.dispatch(bugResolved({ id: 1 }))

const x = getUnresolvedBugs(store.getState())
const y = getUnresolvedBugs(store.getState())

console.log(x === y)
