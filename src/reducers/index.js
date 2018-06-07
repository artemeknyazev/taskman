import { clamp, arrayMove } from 'utils'

const CLEAR_SELECTION = 'CLEAR_SELECTION'
const MOVE_SELECTION_UP = 'MOVE_SELECTION_UP'
const MOVE_SELECTION_DOWN = 'MOVE_SELECTION_DOWN'
const SET_SELECTION = 'SET_SELECTION'
const MOVE_ITEM_UP = 'MOVE_ITEM_UP'
const MOVE_ITEM_DOWN = 'MOVE_ITEM_DOWN'
const MOVE_ITEM_TO = 'MOVE_ITEM_TO'
const DELETE_SELECTED_ITEM = 'DELETE_SELECTED_ITEM'

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

let initialList = []
for (let i = 0; i < 20000; ++i) {
  let text = i.toString() + ' (' + (i+1) + ', ' + (i+2) + ')'
  initialList.push({ id: i, text })
}

const reducer = (
  state = {
    selected: -1,
    list: initialList
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
      console.log(newIndex)
      return {
        ...state,
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
        selected: newSelected,
        list: newList,
      }
    }
  }

  return state
}

export default reducer