import {
  clearSelection,
  moveItemUp,
  moveItemDown,
  moveSelectionUp,
  moveSelectionDown,
  deleteSelectedItem,
  startSelectedItemEditing,
  addAfterSelectedItem,
} from 'client/reducers'

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
    check: (key) => key === 'Delete' || key === 'Backspace',
    callback: (dispatch) => dispatch(deleteSelectedItem()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Escape',
    callback: (dispatch) => dispatch(clearSelection()),
  }, {
    type: 'keyup',
    check: (key, { control, meta }) => key === 'Enter' && (control || meta),
    callback: (dispatch) => dispatch(addAfterSelectedItem()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Enter',
    callback: (dispatch) => dispatch(startSelectedItemEditing()),
  }
]
