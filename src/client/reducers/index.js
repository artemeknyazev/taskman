import { clamp, sortItemsByField } from 'utils'
import {
  getTasks,
  addTask,
  editTask,
  deleteTask,
} from 'client/api/tasks'

const getOrderBetweenIndices = (beforeIndex, afterIndex, byId, orderedIds) => {
  if (beforeIndex < 0 && afterIndex >= 0)
    return byId[orderedIds[afterIndex]].order - 1.0
  else if (beforeIndex < orderedIds.length && afterIndex >= orderedIds.length)
    return byId[orderedIds[beforeIndex]].order + 1.0
  else
    return byId[orderedIds[beforeIndex]].order + (byId[orderedIds[afterIndex]].order -
      byId[orderedIds[beforeIndex]].order) / 2
}

const prepareFilteredOrderedIds = (query, orderedIds, byId) =>
  query && query.length > 2 ? (
    orderedIds.filter(id => (
      byId[id].text.toLowerCase().includes(query.toLowerCase())
    ))
  ) : (
    orderedIds
  )

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

const ADD_ITEM = 'ADD_ITEM_AT_INDEX'
export const addItemAction = (data, error, result) => ({
  type: ADD_ITEM,
  data,
  error,
  result,
})
export const addItemAtIndex = (index) =>
  (dispatch, getState) => {
    const { byId, orderedIds } = getState()
    const data = {
      text: 'New task',
      completed: false,
      order: getOrderBetweenIndices(index - 1, index, byId, orderedIds),
    }
    dispatch(addItemAction(data))
    return addTask(data).then(
      ({ result }) => dispatch(addItemAction(data, null, result)),
      ({ error }) => dispatch(addItemAction(data, error)),
    )
  }
export const addAfterSelectedItem = () =>
  (dispatch, getState) => {
    const { selected } = getState()
    return dispatch(addItemAtIndex(selected + 1))
  }
export const addBeforeSelectedItem = () =>
  (dispatch, getState) => {
    const { selected } = getState()
    return dispatch(addItemAtIndex(selected === -1 ? 0 : selected))
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
    const id = orderedIds[oldIndex]
    const [ beforeIndex, afterIndex ] = newIndex < oldIndex
      ? [ newIndex - 1, newIndex ] : [ newIndex, newIndex + 1 ]
    const order = getOrderBetweenIndices(beforeIndex, afterIndex, byId, orderedIds)
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

const CHANGE_FILTER = 'CHANGE_FILTER'
export const changeFilter = (query) => {
  return {
    type: CHANGE_FILTER,
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
    selected: -1,
  },
  action
) => {
  switch (action.type) {
    case SET_SELECTION:
      return { ...state, selected: action.selected, isEditing: false }

    case CHANGE_FILTER: {
      const { byId, filter, orderedIds } = state
      const { query } = action
      return {
        ...state,
        filter: { ...filter, query },
        filteredOrderedIds:
          prepareFilteredOrderedIds(query, orderedIds, byId),
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
          isFetching: false,
          byId,
          allIds,
          orderedIds,
          filteredOrderedIds:
            prepareFilteredOrderedIds(state.filter.query, orderedIds, byId),
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
          filteredOrderedIds:
            prepareFilteredOrderedIds(state.filter.query, orderedIds, byId),
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
          filter: { ...state.filter, query: '' },
          byId,
          orderedIds: newOrderedIds,
          filteredOrderedIds:
            prepareFilteredOrderedIds(state.filter.query, orderedIds, byId),
        }
      } else {
        return { ...state, isEditing: false }
      }
    }

    case ADD_ITEM: {
      if (action.result) {
        const item = action.result
        const { selected, byId, allIds, orderedIds } = state
        const index = orderedIds.findIndex(id => item.order < byId[id].order)
        const newOrderedIds = index === -1 ? [
          ...orderedIds, item.id
        ] : [
          ...orderedIds.slice(0, index), item.id, ...orderedIds.slice(index)
        ]
        const newById = { ...byId, [item.id]: item }
        const newAllIds = [ ...allIds, item.id ]
        return {
          ...state,
          filter: { ...state.filter, query: '' },
          byId: newById,
          orderedIds: newOrderedIds,
          allIds: newAllIds,
          selected: index === -1 ? newOrderedIds.length - 1 : index,
          isEditing: true,
          filteredOrderedIds:
            prepareFilteredOrderedIds(state.filter.query, orderedIds, byId),
        }
      } else {
        return { ...state, isEditing: false }
      }
    }
  }

  return state
}

/* ---------------------------------- SELECTORS ---------------------------------- */

export const getFilteredOrderedList = (state) =>
  state.filteredOrderedIds.map(id => state.byId[id])