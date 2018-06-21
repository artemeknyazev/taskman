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

export const getProjectIdByProjectSlug = (slug, state) =>
  ProjectList.getProjectIdByProjectSlug(slug, getProjectList(state))

export const getCurrentProjectId = (state) => {
  const { pathname } = state.router.location
  const matched = pathname.match(/^\/projects\/([^\/]+)/)
  if (!matched) return null
  return getProjectIdByProjectSlug(matched[1], state)
}

// TaskList
export const getTaskList = (state) =>
  state.taskList

export const getTaskListFilteredOrderedListByProjectId = (projectId, state) =>
  TaskList.getFilteredOrderedListByProjectId(projectId, getTaskList(state))

export const getTaskListSelectedIdByProjectId = (projectId, state) =>
  TaskList.getSelectedIdByProjectId(projectId, getTaskList(state))

export const getTaskListIsEditingByProjectId = (projectId, state) =>
  TaskList.getIsEditingByProjectId(projectId, getTaskList(state))

export const getTaskListIsFetchingByProjectId = (projectId, state) =>
  TaskList.getIsFetchingByProjectId(projectId, getTaskList(state))