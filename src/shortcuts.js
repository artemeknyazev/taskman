import {
  clearSelection,
  moveItemUp,
  moveItemDown,
  moveSelectionUp,
  moveSelectionDown,
} from 'reducers'

export default [
  {
    type: 'keydown',
    check: ({ key }, { control }) => key === 'ArrowUp' && control,
    callback: (dispatch) => dispatch(moveItemUp()),
  }, {
    type: 'keydown',
    check: ({ key }, { control }) => key === 'ArrowDown' && control,
    callback: (dispatch) => dispatch(moveItemDown()),
  }, {
    type: 'keydown',
    check: ({ key }) => key === 'ArrowUp',
    callback: (dispatch) => dispatch(moveSelectionUp())
  }, {
    type: 'keydown',
    check: ({ key }) => key === 'ArrowDown',
    callback: (dispatch) => dispatch(moveSelectionDown())
  }, {
    type: 'keyup',
    check: ({ key }) => key === 'Escape',
    callback: (dispatch) => { dispatch(clearSelection()) }
  }
]
