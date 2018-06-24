import { combineReducers } from 'redux'
import projectListReducer, * as ProjectList from './project-list'
import taskListReducer, * as TaskList from './task-list'

const APP_INIT = 'INIT_APP'
const appInitAction = (result) => ({
  type: APP_INIT,
  result,
})
export const appInit = () =>
  (dispatch, getState) => {
    dispatch(appInitAction())
    return dispatch(ProjectList.fetchProjects())
      .then(() => {
        const allIds = getAllProjectIds(getState())
        return Promise.all(
          allIds.map(projectId => (
            dispatch(TaskList.fetchTasksByProject(projectId))
          ))
        )
      })
      .then(dispatch(appInitAction(true)))
  }

export default combineReducers({
  projectList: projectListReducer,
  taskList: taskListReducer,
})

// ProjectList
export const getAllProjectListData = (state) =>
  state.projectList

export const getProjectListOrderedList = (state) =>
  ProjectList.getOrderedList(getAllProjectListData(state))

export const getProjectListSelectedId = (state) =>
  ProjectList.getSelectedId(getAllProjectListData(state))

export const getProjectListIsFetching = (state) =>
  ProjectList.getIsFetching(getAllProjectListData(state))

export const getProjectIdByProjectSlug = (slug, state) =>
  ProjectList.getProjectIdByProjectSlug(slug, getAllProjectListData(state))

export const getProjectNameByProjectSlug = (slug, state) =>
  ProjectList.getProjectNameByProjectSlug(slug, getAllProjectListData(state))

export const getAllProjectIds = (state) =>
  ProjectList.getAllProjectIds(getAllProjectListData(state))

export const getCurrentProjectId = (state) => {
  const { pathname } = state.router.location
  const matched = pathname.match(/^\/projects\/([^\/]+)/)
  return matched ? getProjectIdByProjectSlug(matched[1], state) : null
}

export const getCurrentProjectSlug = (state) => {
  const { pathname } = state.router.location
  const matched = pathname.match(/^\/projects\/([^\/]+)/)
  return matched ? matched[1] : null
}

export const getCurrentProjectName = (state) => {
  const { pathname } = state.router.location
  const matched = pathname.match(/^\/projects\/([^\/]+)/)
  return matched ? getProjectNameByProjectSlug(matched[1], state) : null
}

export const existsProjectBySlug = (slug, state) =>
  ProjectList.existsProjectBySlug(slug, getAllProjectListData(state))

export const isRequiredToFetchProjects = (state) =>
  ProjectList.isRequiredToFetch(getAllProjectListData(state))

// TaskList
export const getAllTaskListData = (state) =>
  state.taskList

export const getTaskListDataByProjectId = (projectId, state) =>
  TaskList.getTaskListDataByProjectId(projectId, getAllTaskListData(state))

export const getTaskListFilteredOrderedListByProjectId = (projectId, state) =>
  TaskList.getFilteredOrderedListByProjectId(projectId, getAllTaskListData(state))

export const getTaskListSelectedIdByProjectId = (projectId, state) =>
  TaskList.getSelectedIdByProjectId(projectId, getAllTaskListData(state))

export const getTaskListIsEditingByProjectId = (projectId, state) =>
  TaskList.getIsEditingByProjectId(projectId, getAllTaskListData(state))

export const getTaskListIsFetchingByProjectId = (projectId, state) =>
  TaskList.getIsFetchingByProjectId(projectId, getAllTaskListData(state))

export const existsTaskByIdAnProjectSlug = (id, projectSlug, state) => {
  const projectId = getProjectIdByProjectSlug(projectSlug, state)
  if (projectId === undefined) return false
  return TaskList.existsTaskByIdAnProjectSlug(id, projectId, state)
}

export const isRequiredToFetchTaskListByProject = (projectId, state) =>
  TaskList.isRequiredToFetchByProjectId(projectId, getAllTaskListData(state))