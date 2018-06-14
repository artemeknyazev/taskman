import { clamp, sortItemsByField } from 'utils'
import {
  getTasks,
  editTask,
  deleteTask,
} from 'client/api/tasks'

/* ----------------------------------- ACTIONS ----------------------------------- */

const FETCH_TASKS = 'FETCH_TASKS'
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
  (dispatch, getState) => {
    dispatch(fetchTasksAction())
    return getTasks(filter, offset, limit).then(
      ({ result }) => dispatch(fetchTasksAction(null, result)),
      ({ error }) => dispatch(fetchTasksAction(error))
    )
  }

// TODO: handle delete fail
// TODO: optimistic update
const DELETE_ITEM = 'DELETE_ITEM'
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
    const { selected, orderedIds } = getState()
    if (selected === -1)
      return Promise.resolve()
    const id = orderedIds[selected]
    return dispatch(deleteItem(id))
  }

// TODO: handle edit fail!
// TODO: optimistic update
const START_SELECTED_ITEM_EDITING = 'START_SELECTED_ITEM_EDITING'
export const startSelectedItemEditing = () => ({
  type: START_SELECTED_ITEM_EDITING
})
const ITEM_START_EDITING = 'ITEM_START_EDITING'
export const itemStartEditing = (id) => ({
  type: ITEM_START_EDITING,
  id,
})
const CANCEL_EDITING = 'STOP_EDITING'
export const stopEditing = () => ({
  type: CANCEL_EDITING,
})
const EDIT_ITEM = 'EDIT_ITEM'
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

const APP_INIT = 'INIT_APP'
const appInitAction = (result) => ({
  type: APP_INIT,
  result,
})
export const appInit = () =>
  (dispatch) => {
    dispatch(appInitAction())
    return dispatch(fetchTasks())
      .then(dispatch(appInitAction(true)))
  }

const SET_SELECTION = 'SET_SELECTION'
export const setSelection = (selected) => ({
  type: SET_SELECTION,
  selected
})
export const clearSelection = () =>
  setSelection(-1)
export const moveSelectionUp = () =>
  (dispatch, getState) => {
    const { selected, orderedIds } = getState()
    if (selected === -1)
      return dispatch(setSelection(orderedIds.length - 1))
    if (selected > 0)
      return dispatch(setSelection(selected - 1))
    return Promise.resolve()
  }
export const moveSelectionDown = () =>
  (dispatch, getState) => {
    const { selected, orderedIds } = getState()
    if (selected === -1)
      return dispatch(setSelection(0))
    if (selected < orderedIds.length - 1)
      return dispatch(setSelection(selected + 1))
    return Promise.resolve()
  }

export const moveItemTo = (oldIndex, newIndex) =>
  (dispatch, getState) => {
    const { orderedIds, byId } = getState()
    let id = orderedIds[oldIndex]
    let [ beforeIndex, afterIndex ] = newIndex < oldIndex
      ? [ newIndex - 1, newIndex ] : [ newIndex, newIndex + 1 ]
    let order
    if (beforeIndex < 0 && afterIndex >= 0)
      order = byId[orderedIds[afterIndex]].order - 1.0
    else if (beforeIndex < orderedIds.length && afterIndex >= orderedIds.length)
      order = byId[orderedIds[beforeIndex]].order + 1.0
    else
      order = byId[orderedIds[beforeIndex]].order + (byId[orderedIds[afterIndex]].order -
        byId[orderedIds[beforeIndex]].order) / 2
    return dispatch(editItem(id, { order }))
      .then(dispatch(setSelection(newIndex)))
  }
export const moveItemUp = () =>
  (dispatch, getState) => {
    const { orderedIds, selected } = getState()
    if (selected <= 0 || selected >= orderedIds.length)
      return Promise.resolve()
    return dispatch(moveItemTo(selected, selected - 1))
  }
export const moveItemDown = () =>
  (dispatch, getState) => {
    const { orderedIds, selected } = getState()
    if (selected < 0 || selected >= orderedIds.length - 1)
      return Promise.resolve()
    return dispatch(moveItemTo(selected, selected + 1))
  }

/* ----------------------------------- REDUCER ----------------------------------- */

export default (
  state = {
    isEditing: false,
    isFetching: false,
    byId: {},
    allIds: [],
    orderedIds: [],
    selected: -1,
  },
  action
) => {
  switch (action.type) {
    case SET_SELECTION:
      return { ...state, selected: action.selected, isEditing: false }

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
          isFetching: false,
          byId,
          allIds,
          orderedIds,
        }
      } else if (action.error)
        return { ...state, isFetching: false }
      else
        return { ...state, isFetching: true }
    }

    case DELETE_ITEM: {
      if (action.result) {
        const { selected, orderedIds, allIds, byId } = state
        const newOrderedIds = orderedIds.slice()
        newOrderedIds.splice(newOrderedIds.findIndex(id => id === action.id), 1)
        const newAllIds = allIds.slice()
        newAllIds.splice(newAllIds.findIndex(id => id === action.id), 1)
        let newSelected = selected !== -1 && newOrderedIds.length
          ? clamp(selected, 0, newOrderedIds.length - 1) : -1
        let newById = newAllIds.reduce((newById, id) =>
          (newById[id] = byId[id], newById), {})
        return {
          ...state,
          selected: newSelected,
          byId: newById,
          allIds: newAllIds,
          orderedIds: newOrderedIds,
        }
      } else {
        return { ...state, isEditing: false }
      }
    }

    case START_SELECTED_ITEM_EDITING:
      return { ...state, isEditing: true }

    case ITEM_START_EDITING: {
      const selected = state.orderedIds.findIndex(id => id === action.id)
      return { ...state, selected, isEditing: true }
    }

    case CANCEL_EDITING:
      return { ...state, isEditing: false }

    case EDIT_ITEM: {
      if (action.result) {
        const { allIds, orderedIds } = state
        const { result: item, data } = action
        const byId = { ...state.byId, [item.id]: item }
        // reorder only when order has changed
        const newOrderedIds = data.hasOwnProperty('order')
          ? sortItemsByField(allIds, byId, 'order') : orderedIds
        return {
          ...state,
          byId,
          orderedIds: newOrderedIds,
        }
      } else {
        return { ...state, isEditing: false }
      }
    }
  }

  return state
}

/* ---------------------------------- SELECTORS ---------------------------------- */

export const getOrderedList = (state) =>
  state.orderedIds.map(id => state.byId[id])