import { combineReducers } from 'redux'
import projectListReducer, * as ProjectList from './project-list'
import taskListReducer, * as TaskList from './task-list'

const APP_INIT = 'INIT_APP'
const appInitAction = (result) => ({
  type: APP_INIT,
  result,
})
export const appInit = () =>
  (dispatch) => {
    dispatch(appInitAction())
    return Promise.all([
      dispatch(TaskList.fetchTasks()),
      dispatch(ProjectList.fetchProjects()),
    ]).then(dispatch(appInitAction(true)))
  }

export default combineReducers({
  projectList: projectListReducer,
  taskList: taskListReducer,
})

// ProjectList
export const getProjectList = (state) =>
  state.projectList

export const getProjectListOrderedList = (state) =>
  ProjectList.getOrderedList(getProjectList(state))

export const getProjectListSelectedId = (state) =>
  ProjectList.getSelectedId(getProjectList(state))

export const getProjectListIsFetching = (state) =>
  ProjectList.getIsFetching(getProjectList(state))

// TaskList
export const getTaskList = (state) =>
  state.taskList

export const getTaskListFilteredOrderedList = (state) =>
  TaskList.getFilteredOrderedList(getTaskList(state))

export const getTaskListSelectedId = (state) =>
  TaskList.getSelectedId(getTaskList(state))

export const getTaskListIsEditing = (state) =>
  TaskList.getIsEditing(getTaskList(state))

export const getTaskListIsFetching = (state) =>
  TaskList.getIsFetching(getTaskList(state))