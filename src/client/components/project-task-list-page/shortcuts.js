import {
  clearSelection,
  moveItemUp,
  moveItemDown,
  moveSelectionUp,
  moveSelectionDown,
  deleteSelectedItem,
  startSelectedItemEditing,
  addAfterSelectedItem,
} from 'client/reducers/task-list'

export default [
  {
    type: 'keydown',
    check: (key, { control, meta }) => key === 'ArrowUp' && (control || meta),
    callback: (dispatch, state, { match }) => dispatch(moveItemUp()),
  }, {
    type: 'keydown',
    check: (key, { control, meta }) => key === 'ArrowDown' && (control || meta),
    callback: (dispatch, state, { match }) => dispatch(moveItemDown()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowUp',
    callback: (dispatch, state, { match }) => dispatch(moveSelectionUp()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowDown',
    callback: (dispatch, state, { match }) => dispatch(moveSelectionDown()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Delete' || key === 'Backspace',
    callback: (dispatch, state, { match }) => dispatch(deleteSelectedItem()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Escape',
    callback: (dispatch, state, { match }) => dispatch(clearSelection()),
  }, {
    type: 'keyup',
    check: (key, { control, meta }) => key === 'Enter' && (control || meta),
    callback: (dispatch, state, { match }) => dispatch(addAfterSelectedItem()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Enter',
    callback: (dispatch, state, { match }) => dispatch(startSelectedItemEditing()),
  }
]