import { clamp, arrayMove } from 'utils'
import {
  getTasks,
  editTask,
  deleteTask,
} from 'client/api/tasks'

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

const CLEAR_SELECTION = 'CLEAR_SELECTION'
export const clearSelection = () => ({
  type: CLEAR_SELECTION
})

const MOVE_SELECTION_UP = 'MOVE_SELECTION_UP'
export const moveSelectionUp = () => ({
  type: MOVE_SELECTION_UP
})

const MOVE_SELECTION_DOWN = 'MOVE_SELECTION_DOWN'
export const moveSelectionDown = () => ({
  type: MOVE_SELECTION_DOWN
})

const SET_SELECTION = 'SET_SELECTION'
export const setSelection = (selected) => ({
  type: SET_SELECTION,
  selected
})

const MOVE_ITEM_UP = 'MOVE_ITEM_UP'
export const moveItemUp = () => ({
  type: MOVE_ITEM_UP
})

const MOVE_ITEM_DOWN = 'MOVE_ITEM_DOWN'
export const moveItemDown = () => ({
  type: MOVE_ITEM_DOWN
})

const MOVE_ITEM_TO = 'MOVE_ITEM_TO'
export const moveItemTo = (oldIndex, newIndex) => ({
  type: MOVE_ITEM_TO,
  oldIndex,
  newIndex,
})

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
    const { list, selected } = getState()
    if (selected === -1)
      return Promise.resolve()
    const { id } = list[selected]
    return dispatch(deleteItem(id))
  }

// TODO: handle edit fail!
// TODO: optimistic update
const START_EDITING = 'START_EDITING'
export const startEditing = () => ({
  type: START_EDITING,
})
const STOP_EDITING = 'STOP_EDITING'
export const stopEditing = () => ({
  type: STOP_EDITING,
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
export const editSelectedItem = (data = {}) =>
  (dispatch, getState) => {
    const { list, selected } = getState()
    if (selected === -1)
      return Promise.resolve()
    const { id } = list[selected]
    return dispatch(editItem(id, data))
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

const reducer = (
  state = {
    isEditing: false,
    isFetching: false,
    list: [],
    selected: -1,
  },
  action
) => {
  switch (action.type) {
    case FETCH_TASKS: {
      if (action.result) {
        return {
          ...state,
          isFetching: false,
          list: action.result.collection,
        }
      } else if (action.error) {
        return {
          ...state,
          isFetching: false,
        }
      } else {
        return {
          ...state,
          isFetching: true,
        }
      }
    }

    case CLEAR_SELECTION: {
      return {
        ...state,
        selected: -1
      }
    }

    case MOVE_SELECTION_UP: {
      let selected = state.selected === -1 ? state.list.length-1 : state.selected-1
      return {
        ...state,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case MOVE_SELECTION_DOWN: {
      let selected = state.selected === -1 ? 0 : state.selected+1
      return {
        ...state,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case SET_SELECTION: {
      const { selected } = action
      return {
        ...state,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case MOVE_ITEM_UP: {
      let { selected, list } = state
      if (selected <= 0) return state
      return {
        ...state,
        selected: selected-1,
        list: arrayMove(list, selected, selected-1),
      }
    }

    case MOVE_ITEM_DOWN: {
      let { selected, list } = state
      if (selected === -1 || selected === list.length-1) return state
      return {
        ...state,
        selected: selected+1,
        list: arrayMove(list, selected, selected+1)
      }
    }

    case MOVE_ITEM_TO: {
      const { oldIndex, newIndex } = action
      if (newIndex === oldIndex) return state
      const { selected, list } = state
      return {
        ...state,
        selected: newIndex,
        list: arrayMove(list, oldIndex, newIndex),
      }
    }

    case DELETE_ITEM: {
      if (action.result) {
        const { selected, list } = state
        const index = list.findIndex(({ id }) => action.id === id)
        const newList = list.slice()
        newList.splice(index, 1)
        let newSelected = selected !== -1 && newList.length
          ? clamp(selected, 0, newList.length - 1)
          : -1
        return {
          ...state,
          selected: newSelected,
          list: newList,
        }
      } else {
        return state
      }
    }

    case START_EDITING: {
      return {
        ...state,
        isEditing: true,
      }
    }

    case STOP_EDITING: {
      return {
        ...state,
        isEditing: false,
      }
    }

    case EDIT_ITEM: {
      let { list } = state
      let isEditing = false
      if (action.result) {
        list = list.map(item =>
          action.id === item.id
            ? { ...action.result }
            : item
        )
      }
      return {
        ...state,
        list,
        isEditing,
      }
    }
  }

  return state
}

export default reducer