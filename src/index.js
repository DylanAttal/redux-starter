import { loadBugs, assignBugToUser } from './store/bugs'
import configureStore from './store/configureStore'

const store = configureStore()

store.dispatch(loadBugs())

setTimeout(() => {
  store.dispatch(assignBugToUser(1, 4))
}, 2000)
