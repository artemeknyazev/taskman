import { uniq } from 'lodash'
import { clamp, sortItemsByField } from 'utils'
import {
  getTasks,
  addTask,
  editTask,
  deleteTask,
} from 'client/api/tasks'
import {
  getTaskList,
  getCurrentProjectId,
} from './index'

const getOrderBetweenIndices = (beforeIndex, afterIndex, orderedIds, byId) => {
  if (beforeIndex < 0 && afterIndex >= 0)
    return byId[orderedIds[afterIndex]].order - 1.0
  else if (beforeIndex < orderedIds.length && afterIndex >= orderedIds.length)
    return byId[orderedIds[beforeIndex]].order + 1.0
  else
    return byId[orderedIds[beforeIndex]].order + (byId[orderedIds[afterIndex]].order -
      byId[orderedIds[beforeIndex]].order) / 2
}

const prepareFilteredOrderedIds = ({ query }, orderedIds, byId) => {
  const lcQuery = typeof query === 'string' && query.length > 2
    ? query.toLocaleLowerCase() : ''
  return orderedIds.filter(id => {
    const { text } = byId[id]
    let result = true
    if (result && lcQuery)
      result = result && text.toLocaleLowerCase().includes(lcQuery)
    return result
  })
}

const insertIntoOrderedList = (id, order, orderedIds, byId) => {
  const prevIndex = orderedIds.indexOf(id)
  const result = prevIndex === -1 ? [ ...orderedIds ] :
    [ ...orderedIds.slice(0, prevIndex), ...orderedIds.slice(prevIndex + 1) ]
  const index = result.findIndex(itemId => order < byId[itemId].order)
  if (index === -1) result.push(id)
  else result.splice(index, 0, id)
  return result
}

/* ----------------------------------- ACTIONS ----------------------------------- */

const FETCH_TASKS = 'TASK_LIST/FETCH_TASKS'
const fetchTasksAction = (
  error = null,
  result = null,
) => ({
  type: FETCH_TASKS,
  error,
  result,
})
export const fetchTasks = (
  filter = {},
  offset = undefined,
  limit = undefined,
) =>
  (dispatch) => {
    dispatch(fetchTasksAction())
    return getTasks(filter, offset, limit).then(
      ({ result }) => dispatch(fetchTasksAction(null, result)),
      ({ error }) => dispatch(fetchTasksAction(error))
    )
  }

const ADD_ITEM = 'TASK_LIST/ADD_ITEM'
export const addItemAction = (projectId, data, error, result) => ({
  type: ADD_ITEM,
  projectId,
  data,
  error,
  result,
})
export const addItemAfter = (projectId, id = null) =>
  (dispatch, getState) => {
    const { byId, orderedIds, filteredOrderedIds } = getProjectTasklist(projectId, getState())
    let data = {
      text: 'New task',
      completed: false,
      projectId,
    }
    if (id === null || orderedIds.length === 0) {
      data.order = 0.0
    } else if (filteredOrderedIds.length === 0) {
      data.order = byId[orderedIds[orderedIds.length-1]].order + 1.0
    } else {
      const orderedIndex = orderedIds.indexOf(id)
      data.order = getOrderBetweenIndices(orderedIndex, orderedIndex + 1, orderedIds, byId)
    }
    dispatch(addItemAction(projectId, data))
    return addTask(data).then(
      ({ result }) => dispatch(addItemAction(projectId, data, null, result)),
      ({ error }) => dispatch(addItemAction(projectId, data, error)),
    )
  }
export const addAfterSelectedItemInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { selectedId, filteredOrderedIds } = getProjectTasklist(projectId, state)
    return dispatch(addItemAfter(
      projectId,
      selectedId === null
        ? filteredOrderedIds.length - 1
        : filteredOrderedIds.indexOf(selectedId)
    ))
  }

// TODO: handle delete fail
// TODO: optimistic update
const DELETE_ITEM = 'TASK_LIST/DELETE_ITEM'
const deleteItemAction = (projectId, id, error, result) => ({
  type: DELETE_ITEM,
  projectId,
  id,
  error,
  result,
})
export const deleteItem = (projectId, id) =>
  (dispatch) => {
    dispatch(deleteItemAction(projectId, id))
    return deleteTask(id).then(
      ({ result }) => dispatch(deleteItemAction(projectId, id, null, result)),
      ({ error }) => dispatch(deleteItemAction(projectId, id, error)),
    )
  }
export const deleteSelectedItemInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { selectedId } = getProjectTasklist(projectId, state)
    if (selectedId === null)
      return Promise.resolve()
    return dispatch(deleteItem(projectId, selectedId))
  }

// TODO: handle edit fail!
// TODO: optimistic update
const START_SELECTED_ITEM_EDITING = 'TASK_LIST/START_SELECTED_ITEM_EDITING'
export const startSelectedItemEditingInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    dispatch({
      type: START_SELECTED_ITEM_EDITING,
      projectId,
    })
  }
const ITEM_START_EDITING = 'TASK_LIST/ITEM_START_EDITING'
export const itemStartEditing = (projectId, id) => ({
  type: ITEM_START_EDITING,
  projectId,
  id,
})
const CANCEL_EDITING = 'TASK_LIST/STOP_EDITING'
export const stopEditing = (projectId, id) => ({
  type: CANCEL_EDITING,
  projectId,
  id,
})
const EDIT_ITEM = 'TASK_LIST/EDIT_ITEM'
const editItemAction = (projectId, id, data, error, result) => ({
  type: EDIT_ITEM,
  projectId,
  id,
  data,
  error,
  result,
})
export const editItem = (projectId, id, data = {}) =>
  (dispatch) => {
    dispatch(editItemAction(projectId, id, data))
    return editTask(id, data).then(
      ({ result }) => dispatch(editItemAction(projectId, id, data, null, result)),
      ({ error }) => dispatch(editItemAction(projectId, id, data, error)),
    )
  }

const SET_SELECTION = 'TASK_LIST/SET_SELECTION'
export const setSelection = (projectId, selectedId) => ({
  type: SET_SELECTION,
  projectId,
  selectedId,
})
export const clearSelectionInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    return dispatch(setSelection(projectId, null))
  }
export const moveSelectionUpInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { selectedId, filteredOrderedIds } = getProjectTasklist(projectId, state)
    if (filteredOrderedIds.length) {
      const index = filteredOrderedIds.indexOf(selectedId)
      if (index <= 0)
        return dispatch(setSelection(projectId, filteredOrderedIds[filteredOrderedIds.length - 1]))
      else
        return dispatch(setSelection(projectId, filteredOrderedIds[index - 1]))
    }
    return dispatch(clearSelectionInCurrentProject())
  }
export const moveSelectionDownInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { selectedId, filteredOrderedIds } = getProjectTasklist(projectId, state)
    if (filteredOrderedIds.length) {
      const index = filteredOrderedIds.indexOf(selectedId)
      if (index === -1 || index >= filteredOrderedIds.length - 1)
        return dispatch(setSelection(projectId, filteredOrderedIds[0]))
      else
        return dispatch(setSelection(projectId, filteredOrderedIds[index + 1]))
    }
    return dispatch(clearSelectionInCurrentProject())
  }

export const moveItemTo = (projectId, movedId, movedToId) =>
  (dispatch, getState) => {
    const { filteredOrderedIds, orderedIds, byId } = getProjectTasklist(projectId, getState())
    const oldIndex = filteredOrderedIds.indexOf(movedId)
    const newIndex = filteredOrderedIds.indexOf(movedToId)
    let orderedIndex = orderedIds.indexOf(movedToId)
    let beforeOrderedIndex, afterOrderedIndex
    if (newIndex < oldIndex) {
      beforeOrderedIndex = orderedIndex - 1
      afterOrderedIndex = orderedIndex
    } else { // newIndex > oldIndex
      beforeOrderedIndex = orderedIndex
      afterOrderedIndex = orderedIndex + 1
    }
    const order = getOrderBetweenIndices(beforeOrderedIndex, afterOrderedIndex, orderedIds, byId)
    return dispatch(editItem(projectId, movedId, { order }))
      .then(dispatch(setSelection(projectId, movedId)))
  }
export const moveItemUpInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { filteredOrderedIds, selectedId } = getProjectTasklist(projectId, state)
    const index = filteredOrderedIds.indexOf(selectedId)
    if (index <= 0 || index >= filteredOrderedIds.length)
      return Promise.resolve()
    return dispatch(moveItemTo(projectId, selectedId, filteredOrderedIds[index - 1]))
  }
export const moveItemDownInCurrentProject = () =>
  (dispatch, getState) => {
    const state = getState()
    const projectId = getCurrentProjectId(state)
    const { filteredOrderedIds, selectedId } = getProjectTasklist(projectId, state)
    const index = filteredOrderedIds.indexOf(selectedId)
    if (index < 0 || index >= filteredOrderedIds.length - 1)
      return Promise.resolve()
    return dispatch(moveItemTo(projectId, selectedId, filteredOrderedIds[index + 1]))
  }

const SET_FILTER = 'TASK_LIST/SET_FILTER'
export const setFilter = (projectId, filter) => {
  return {
    type: SET_FILTER,
    projectId,
    filter,
  }
}

/* ----------------------------------- REDUCER ----------------------------------- */

export default (
  state = {
    isFetching: false,
    byProjectId: {},
    allProjectIds: {},
  },
  action
) => {
  switch (action.type) {
    case SET_SELECTION: {
      return {
        ...state,
        byProjectId: {
          ...state.byProjectId,
          [action.projectId]: {
            ...state.byProjectId[action.projectId],
            selectedId: action.selectedId,
            isEditing: false,
          }
        }
      }
    }

    case SET_FILTER: {
      const { byId, filter, orderedIds, selectedId } = state.byProjectId[action.projectId]
      const newFilter = { ...filter, ...action.filter }
      const newFilteredOrderedIds =
        prepareFilteredOrderedIds(newFilter, orderedIds, byId)
      const newSelectedId =
        newFilteredOrderedIds.includes(selectedId) ? selectedId : null
      return {
        ...state,
        byProjectId: {
          ...state.byProjectId,
          [action.projectId]: {
            ...state.byProjectId[action.projectId],
            filter: newFilter,
            filteredOrderedIds: newFilteredOrderedIds,
            selectedId: newSelectedId,
            isEditing: false,
          }
        }
      }
    }

    case FETCH_TASKS: {
      if (action.result) {
        let byProjectId = {}
        let allProjectIds = []
        action.result.collection.forEach(item => {
          const { id, projectId } = item
          const byProject = (byProjectId[projectId] = byProjectId[projectId] || {
            filter: { query: '' },
            isEditing: false,
            byId: {},
            allIds: [],
            orderedIds: [],
            filteredOrderedIds: [],
            selectedId: null,
          })
          allProjectIds.push(projectId)
          byProject.byId[id] = item
          byProject.allIds.push(id)
        })
        allProjectIds = uniq(allProjectIds)
        allProjectIds.forEach(projectId => {
          const byProject = byProjectId[projectId]
          byProject.orderedIds =
            sortItemsByField(byProject.allIds, byProject.byId, 'order')
          byProject.filteredOrderedIds =
            prepareFilteredOrderedIds(byProject.filter, byProject.orderedIds, byProject.byId)
        })
        return {
          ...state,
          isFetching: false,
          byProjectId,
          allProjectIds,
        }
      } else if (action.error)
        return { ...state, isFetching: false }
      else
        return { ...state, isFetching: true }
    }

    case DELETE_ITEM: {
      if (action.result) {
        const { selectedId, byId, allIds, orderedIds, filteredOrderedIds } = state.byProjectId[action.projectId]
        const newAllIds = allIds.slice()
        newAllIds.indexOf(newAllIds.indexOf(action.id), 1)
        const newById = newAllIds.reduce((newByIdByProject, id) =>
          (newByIdByProject[id] = byId[id], newByIdByProject), {})
        const newOrderedIds = orderedIds.slice()
        newOrderedIds.splice(newOrderedIds.indexOf(action.id), 1)
        let newFilteredOrderedIds = filteredOrderedIds
        let newSelectedId = selectedId
        const selectedIndex = newFilteredOrderedIds.indexOf(selectedId)
        const deletedIndex = newFilteredOrderedIds.indexOf(action.id)
        if (deletedIndex !== -1) {
          newFilteredOrderedIds = [
            ...newFilteredOrderedIds.slice(0, deletedIndex),
            ...newFilteredOrderedIds.slice(deletedIndex + 1),
          ]
        }
        if (selectedId === action.id) {
          newSelectedId = newFilteredOrderedIds.length
            ? newFilteredOrderedIds[clamp(selectedIndex, 0, newFilteredOrderedIds.length - 1)]
            : null
        }
        return {
          ...state,
          byProjectId: {
            ...state.byProjectId,
            [action.projectId]: {
              ...state.byProjectId[action.projectId],
              selectedId: newSelectedId,
              byId: newById,
              allIds: newAllIds,
              orderedIdsByProject: newOrderedIds,
              filteredOrderedIds: newFilteredOrderedIds,
            }
          },
        }
      } else {
        return {
          ...state,
          byProjectId: {
            ...state.byProjectId,
            [action.projectId]: {
              ...state.byProjectId[action.projectId],
              isEditing: false,
            }
          }
        }
      }
    }

    case START_SELECTED_ITEM_EDITING: {
      return {
        ...state,
        byProjectId: {
          ...state.byProjectId,
          [action.projectId]: {
            ...state.byProjectId[action.projectId],
            isEditing: true,
          }
        },
      }
    }

    case ITEM_START_EDITING: {
      return {
        ...state,
        byProjectId: {
          ...state.byProjectId,
          [action.projectId]: {
            ...state.byProjectId[action.projectId],
            isEditing: true,
            selectedId: action.id,
          }
        },
      }
    }

    case CANCEL_EDITING: {
      return {
        ...state,
        isEditing: false,
        byProjectId: {
          ...state.byProjectId,
          [action.projectId]: {
            ...state.byProjectId[action.projectId],
            isEditing: false,
          }
        },
      }
    }

    case EDIT_ITEM: {
      if (action.result) {
        const { result: item } = action
        const { filter, byId, orderedIds } = state.byProjectId[action.projectId]
        const newById = { ...byId, [item.id]: item }
        const newOrderedIds =
          insertIntoOrderedList(item.id, item.order, orderedIds, newById)
        let newFilteredOrderedIds =
          prepareFilteredOrderedIds(filter, newOrderedIds, newById)
        // Keep an edited item in a new filtered array even if it is not filtered
        newFilteredOrderedIds =
          insertIntoOrderedList(item.id, item.order, newFilteredOrderedIds, newById)

        return {
          ...state,
          byProjectId: {
            ...state.byProjectId,
            [action.projectId]: {
              ...state.byProjectId[action.projectId],
              byId: newById,
              orderedIds: newOrderedIds,
              filteredOrderedIds: newFilteredOrderedIds,
            }
          },
        }
      } else {
        return {
          ...state,
          isEditing: false,
          byProjectId: {
            ...state.byProjectId,
            [action.projectId]: {
              ...state.byProjectId[action.projectId],
              isEditing: false,
            }
          },
        }
      }
    }

    case ADD_ITEM: {
      if (action.result) {
        const { result: item } = action
        const { filter, byId, orderedIds, allIds } = state.byProjectId[action.projectId]
        const newById = { ...byId, [item.id]: item }
        const newAllIds = [ ...allIds, item.id ]
        const newOrderedIds =
          insertIntoOrderedList(item.id, item.order, orderedIds, newById)
        let newFilteredOrderedIds =
          prepareFilteredOrderedIds(filter, newOrderedIds, newById)
        // Keep an added item in a filtered array to allow a user to edit it
        newFilteredOrderedIds =
          insertIntoOrderedList(item.id, item.order, newFilteredOrderedIds, newById)
        return {
          ...state,
          byProjectId: {
            ...state.byProjectId,
            [action.projectId]: {
              ...state.byProjectId[action.projectId],
              byId: newById,
              orderedIds: newOrderedIds,
              allIds: newAllIds,
              selectedId: item.id,
              isEditing: true,
              filteredOrderedIds: newFilteredOrderedIds,
            }
          }
        }
      } else {
        return { ...state, isEditing: false }
      }
    }
  }

  return state
}

/* ---------------------------------- SELECTORS ---------------------------------- */

// TODO: this computes derived data, so result is always new;
//       should use memoized selector to fix rerendering
const getProjectTasklist = (projectId, state) =>
  state.byProjectId[projectId]

export const getFilteredOrderedListByProjectId = (projectId, state) => {
  const { byId, filteredOrderedIds } = getProjectTasklist(projectId, state)
  return filteredOrderedIds.map(id => byId[id])
}

export const getSelectedIdByProjectId = (projectId, state) =>
  getProjectTasklist(projectId, state).selectedId

export const getIsEditingByProjectId = (projectId, state) =>
  getProjectTasklist(projectId, state).isEditing

export const getIsFetchingByProjectId = (projectId, state) =>
  state.isFetching