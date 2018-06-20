import { clamp, sortItemsByField } from 'utils'
import {
  getTasks,
  addTask,
  editTask,
  deleteTask,
} from 'client/api/tasks'
import {
  getTaskList
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
export const addItemAction = (data, error, result) => ({
  type: ADD_ITEM,
  data,
  error,
  result,
})
export const addItemAfterIndex = (index = null) =>
  (dispatch, getState) => {
    const { byId, orderedIds, filteredOrderedIds } = getTaskList(getState())
    let data = {
      text: 'New task',
      completed: false,
    }
    if (index === null || orderedIds.length === 0) {
      data.order = 0.0
    } else if (filteredOrderedIds.length === 0) {
      data.order = byId[orderedIds[orderedIds.length-1]].order + 1.0
    } else {
      const id = filteredOrderedIds[index]
      const orderedIndex = orderedIds.indexOf(id)
      data.order = getOrderBetweenIndices(orderedIndex, orderedIndex + 1, orderedIds, byId)
    }
    dispatch(addItemAction(data))
    return addTask(data).then(
      ({ result }) => dispatch(addItemAction(data, null, result)),
      ({ error }) => dispatch(addItemAction(data, error)),
    )
  }
export const addAfterSelectedItem = () =>
  (dispatch, getState) => {
    const { selectedId, filteredOrderedIds } = getTaskList(getState())
    return dispatch(addItemAfterIndex(
      selectedId === null
        ? filteredOrderedIds.length - 1
        : filteredOrderedIds.indexOf(selectedId)
    ))
  }

// TODO: handle delete fail
// TODO: optimistic update
const DELETE_ITEM = 'TASK_LIST/DELETE_ITEM'
const deleteItemAction = (id, error, result) => ({
  type: DELETE_ITEM,
  id,
  error,
  result,
})
export const deleteItem = (id) =>
  (dispatch) => {
    dispatch(deleteItemAction(id))
    return deleteTask(id).then(
      ({ result }) => dispatch(deleteItemAction(id, null, result)),
      ({ error }) => dispatch(deleteItemAction(id, error)),
    )
  }
export const deleteSelectedItem = () =>
  (dispatch, getState) => {
    const { selectedId } = getTaskList(getState())
    if (selectedId === null)
      return Promise.resolve()
    return dispatch(deleteItem(selectedId))
  }

// TODO: handle edit fail!
// TODO: optimistic update
const START_SELECTED_ITEM_EDITING = 'TASK_LIST/START_SELECTED_ITEM_EDITING'
export const startSelectedItemEditing = () => ({
  type: START_SELECTED_ITEM_EDITING
})
const ITEM_START_EDITING = 'TASK_LIST/ITEM_START_EDITING'
export const itemStartEditing = (id) => ({
  type: ITEM_START_EDITING,
  id,
})
const CANCEL_EDITING = 'TASK_LIST/STOP_EDITING'
export const stopEditing = () => ({
  type: CANCEL_EDITING,
})
const EDIT_ITEM = 'TASK_LIST/EDIT_ITEM'
const editItemAction = (id, data, error, result) => ({
  type: EDIT_ITEM,
  id,
  data,
  error,
  result,
})
export const editItem = (id, data = {}) =>
  (dispatch) => {
    dispatch(editItemAction(id, data))
    return editTask(id, data).then(
      ({ result }) => dispatch(editItemAction(id, data, null, result)),
      ({ error }) => dispatch(editItemAction(id, data, error)),
    )
  }

const SET_SELECTION = 'TASK_LIST/SET_SELECTION'
export const setSelection = (selectedId) => ({
  type: SET_SELECTION,
  selectedId
})
export const clearSelection = () =>
  setSelection(null)
export const moveSelectionUp = () =>
  (dispatch, getState) => {
    const { selectedId, filteredOrderedIds } = getTaskList(getState())
    if (filteredOrderedIds.length) {
      const index = filteredOrderedIds.indexOf(selectedId)
      if (index <= 0)
        return dispatch(setSelection(filteredOrderedIds[filteredOrderedIds.length - 1]))
      else
        return dispatch(setSelection(filteredOrderedIds[index - 1]))
    }
    return dispatch(clearSelection())
  }
export const moveSelectionDown = () =>
  (dispatch, getState) => {
    const { selectedId, filteredOrderedIds } = getTaskList(getState())
    if (filteredOrderedIds.length) {
      const index = filteredOrderedIds.indexOf(selectedId)
      if (index === -1 || index >= filteredOrderedIds.length - 1)
        return dispatch(setSelection(filteredOrderedIds[0]))
      else
        return dispatch(setSelection(filteredOrderedIds[index + 1]))
    }
    return dispatch(clearSelection())
  }

export const moveItemTo = (oldIndex, newIndex) =>
  (dispatch, getState) => {
    const { filteredOrderedIds, orderedIds, byId } = getTaskList(getState())
    const id = filteredOrderedIds[oldIndex]
    let orderedIndex = orderedIds.indexOf(filteredOrderedIds[newIndex])
    let beforeOrderedIndex, afterOrderedIndex;
    if (newIndex < oldIndex) {
      beforeOrderedIndex = orderedIndex - 1
      afterOrderedIndex = orderedIndex
    } else { // newIndex > oldIndex
      beforeOrderedIndex = orderedIndex
      afterOrderedIndex = orderedIndex + 1
    }
    const order = getOrderBetweenIndices(beforeOrderedIndex, afterOrderedIndex, orderedIds, byId)
    return dispatch(editItem(id, { order }))
      .then(dispatch(setSelection(id)))
  }
export const moveItemUp = () =>
  (dispatch, getState) => {
    const { filteredOrderedIds, selectedId } = getTaskList(getState())
    const index = filteredOrderedIds.indexOf(selectedId)
    if (index <= 0 || index >= filteredOrderedIds.length)
      return Promise.resolve()
    return dispatch(moveItemTo(index, index - 1))
  }
export const moveItemDown = () =>
  (dispatch, getState) => {
    const { filteredOrderedIds, selectedId } = getTaskList(getState())
    const index = filteredOrderedIds.indexOf(selectedId)
    if (index < 0 || index >= filteredOrderedIds.length - 1)
      return Promise.resolve()
    return dispatch(moveItemTo(index, index + 1))
  }

const SET_FILTER = 'TASK_LIST/SET_FILTER'
export const setFilter = (query) => {
  return {
    type: SET_FILTER,
    query,
  }
}

/* ----------------------------------- REDUCER ----------------------------------- */

export default (
  state = {
    filter: {
      query: '',
    },
    isEditing: false,
    isFetching: false,
    byId: {},
    allIds: [],
    orderedIds: [],
    filteredOrderedIds: [],
    selectedId: null,
  },
  action
) => {
  switch (action.type) {
    case SET_SELECTION:
      return { ...state, selectedId: action.selectedId, isEditing: false }

    case SET_FILTER: {
      const { byId, filter, orderedIds, selectedId } = state
      const { query } = action
      const newFilter = { ...filter, query }
      const newFilteredOrderedIds = prepareFilteredOrderedIds(newFilter, orderedIds, byId)
      const newSelectedId = newFilteredOrderedIds.includes(selectedId) ? selectedId : null
      return {
        ...state,
        filter: newFilter,
        filteredOrderedIds: newFilteredOrderedIds,
        selectedId: newSelectedId,
        isEditing: false,
      }
    }

    case FETCH_TASKS: {
      if (action.result) {
        let byId = {}
        let allIds = []
        action.result.collection.forEach(item => {
          byId[item.id] = item
          allIds.push(item.id)
        })
        let orderedIds = sortItemsByField(allIds, byId, 'order')
        return {
          ...state,
          filter: { ...state.filter, query: '' },
          isFetching: false,
          selectedId: null,
          byId,
          allIds,
          orderedIds,
          filteredOrderedIds:
            prepareFilteredOrderedIds(state.filter, orderedIds, byId),
        }
      } else if (action.error)
        return { ...state, isFetching: false }
      else
        return { ...state, isFetching: true }
    }

    case DELETE_ITEM: {
      if (action.result) {
        const { selectedId, orderedIds, filteredOrderedIds, allIds, byId } = state
        const newAllIds = allIds.slice()
        newAllIds.splice(newAllIds.indexOf(action.id), 1)
        let newById = newAllIds.reduce((newById, id) =>
          (newById[id] = byId[id], newById), {})
        const newOrderedIds = orderedIds.slice()
        newOrderedIds.splice(newOrderedIds.indexOf(action.id), 1)
        let newFilteredOrderedIds = filteredOrderedIds
        let newSelectedId = selectedId
        const selectedIndex = newFilteredOrderedIds.indexOf(selectedId)
        let deletedIndex = newFilteredOrderedIds.indexOf(action.id)
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
          selectedId: newSelectedId,
          byId: newById,
          allIds: newAllIds,
          orderedIds: newOrderedIds,
          filteredOrderedIds: newFilteredOrderedIds,
        }
      } else {
        return { ...state, isEditing: false }
      }
    }

    case START_SELECTED_ITEM_EDITING:
      return { ...state, isEditing: true }

    case ITEM_START_EDITING: {
      return { ...state, selectedId: action.id, isEditing: true }
    }

    case CANCEL_EDITING:
      return { ...state, isEditing: false }

    case EDIT_ITEM: {
      if (action.result) {
        const { filter, byId, allIds, orderedIds } = state
        const { result: item, data } = action
        const newById = { ...byId, [item.id]: item }
        const newOrderedIds = sortItemsByField(allIds, newById, 'order')
        let newFilteredOrderedIds =
          prepareFilteredOrderedIds(filter, newOrderedIds, newById)
        // Keep an edited item in a new filtered array even if it is not filtered
        newFilteredOrderedIds =
          insertIntoOrderedList(item.id, item.order, newFilteredOrderedIds, newById)
        return {
          ...state,
          byId: newById,
          orderedIds: newOrderedIds,
          filteredOrderedIds: newFilteredOrderedIds,
        }
      } else {
        return { ...state, isEditing: false }
      }
    }

    case ADD_ITEM: {
      if (action.result) {
        const item = action.result
        const { filter, byId, allIds, orderedIds } = state
        const newById = { ...byId, [item.id]: item }
        const newAllIds = [...allIds, item.id]
        const newOrderedIds =
          insertIntoOrderedList(item.id, item.order, orderedIds, newById)
        let newFilteredOrderedIds =
          prepareFilteredOrderedIds(filter, newOrderedIds, newById)
        // Keep an added item in a filtered array to allow a user to edit it
        newFilteredOrderedIds =
          insertIntoOrderedList(item.id, item.order, newFilteredOrderedIds, newById)
        return {
          ...state,
          byId: newById,
          orderedIds: newOrderedIds,
          allIds: newAllIds,
          selectedId: item.id,
          isEditing: true,
          filteredOrderedIds: newFilteredOrderedIds,
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
export const getFilteredOrderedList = (state) =>
  state.filteredOrderedIds.map(id => state.byId[id])

export const getSelectedId = (state) =>
  state.selectedId

export const getIsEditing = (state) =>
  state.isEditing

export const getIsFetching = (state) =>
  state.isFetching