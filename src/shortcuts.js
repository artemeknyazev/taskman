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
    check: (key, { control, meta }) => key === 'ArrowUp' && (control || meta),
    callback: (dispatch) => dispatch(moveItemUp()),
  }, {
    type: 'keydown',
    check: (key, { control, meta }) => key === 'ArrowDown' && (control || meta),
    callback: (dispatch) => dispatch(moveItemDown()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowUp',
    callback: (dispatch) => dispatch(moveSelectionUp()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowDown',
    callback: (dispatch) => dispatch(moveSelectionDown()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Escape',
    callback: (dispatch) => dispatch(clearSelection()),
  }
]
