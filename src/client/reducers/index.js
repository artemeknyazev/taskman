import { clamp, arrayMove } from 'utils'

const CLEAR_SELECTION = 'CLEAR_SELECTION'
const MOVE_SELECTION_UP = 'MOVE_SELECTION_UP'
const MOVE_SELECTION_DOWN = 'MOVE_SELECTION_DOWN'
const SET_SELECTION = 'SET_SELECTION'
const MOVE_ITEM_UP = 'MOVE_ITEM_UP'
const MOVE_ITEM_DOWN = 'MOVE_ITEM_DOWN'
const MOVE_ITEM_TO = 'MOVE_ITEM_TO'
const DELETE_SELECTED_ITEM = 'DELETE_SELECTED_ITEM'
const START_SELECTED_ITEM_EDIT = 'START_ITEM_EDIT'
const STOP_SELECTED_ITEM_EDIT = 'STOP_ITEM_EDIT'
const CANCEL_SELECTED_ITEM_EDIT = 'CANCEL_ITEM_EDIT'

export const clearSelection = () => ({
  type: CLEAR_SELECTION
})

export const moveSelectionUp = () => ({
  type: MOVE_SELECTION_UP
})

export const moveSelectionDown = () => ({
  type: MOVE_SELECTION_DOWN
})

export const setSelection = (selected) => ({
  type: SET_SELECTION,
  selected
})

export const moveItemUp = () => ({
  type: MOVE_ITEM_UP
})

export const moveItemDown = () => ({
  type: MOVE_ITEM_DOWN
})

export const moveItemTo = (oldIndex, newIndex) => ({
  type: MOVE_ITEM_TO,
  oldIndex,
  newIndex,
})

export const deleteSelectedItem = () => ({
  type: DELETE_SELECTED_ITEM,
})

export const startItemEdit = () => ({
  type: START_SELECTED_ITEM_EDIT,
})

export const stopItemEdit = (text) => ({
  type: STOP_SELECTED_ITEM_EDIT,
  text,
})

export const cancelItemEdit = () => ({
  type: CANCEL_SELECTED_ITEM_EDIT,
})

let initialList = []
for (let i = 0; i < 20000; ++i) {
  let text = i.toString() + ' (' + (i+1) + ', ' + (i+2) + ')'
  initialList.push({ id: i, text })
}

const reducer = (
  state = {
    selected: -1,
    isEditing: false,
    list: initialList,
  },
  action
) => {
  switch (action.type) {
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
        isEditing: false,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case MOVE_SELECTION_DOWN: {
      let selected = state.selected === -1 ? 0 : state.selected+1
      return {
        ...state,
        isEditing: false,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case SET_SELECTION: {
      const { selected } = action
      return {
        ...state,
        isEditing: false,
        selected: clamp(selected, 0, state.list.length-1),
      }
    }

    case MOVE_ITEM_UP: {
      let { selected, list } = state
      if (selected <= 0) return state
      return {
        ...state,
        isEditing: false,
        selected: selected-1,
        list: arrayMove(list, selected, selected-1),
      }
    }

    case MOVE_ITEM_DOWN: {
      let { selected, list } = state
      if (selected === -1 || selected === list.length-1) return state
      return {
        ...state,
        isEditing: false,
        selected: selected+1,
        list: arrayMove(list, selected, selected+1)
      }
    }

    case MOVE_ITEM_TO: {
      const { oldIndex, newIndex } = action
      if (newIndex === oldIndex) return state
      const { selected, list } = state
      console.log(newIndex)
      return {
        ...state,
        isEditing: false,
        selected: newIndex,
        list: arrayMove(list, oldIndex, newIndex),
      }
    }

    case DELETE_SELECTED_ITEM: {
      const { selected, list } = state
      if (selected === -1) return state
      const newList = [ ...list ]
      newList.splice(selected, 1)
      let newSelected = newList.length > 0
        ? clamp(selected, 0, newList.length - 1)
        : -1
      return {
        ...state,
        isEditing: false,
        selected: newSelected,
        list: newList,
      }
    }

    case START_SELECTED_ITEM_EDIT: {
      const { selected, list } = state
      return {
        ...state,
        isEditing: true,
      }
    }

    case STOP_SELECTED_ITEM_EDIT: {
      const { text } = action
      const { selected, list, editingText } = state
      return {
        ...state,
        isEditing: false,
        list: list.map((item, index) => (
          selected === index
            ? { ...item, text }
            : item
        ))
      }
    }

    case CANCEL_SELECTED_ITEM_EDIT: {
      return {
        ...state,
        isEditing: false,
      }
    }
  }

  return state
}

export default reducer