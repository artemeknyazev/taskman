import {
  clearSelectionInCurrentProject,
  moveItemUpInCurrentProject,
  moveItemDownInCurrentProject,
  moveSelectionUpInCurrentProject,
  moveSelectionDownInCurrentProject,
  deleteSelectedItemInCurrentProject,
  startSelectedItemEditingInCurrentProject,
  addAfterSelectedItemInCurrentProject,
} from 'client/reducers/task-list'

export default [
  {
    type: 'keydown',
    check: (key, { control, meta }) => key === 'ArrowUp' && (control || meta),
    callback: (dispatch, state) => dispatch(moveItemUpInCurrentProject()),
  }, {
    type: 'keydown',
    check: (key, { control, meta }) => key === 'ArrowDown' && (control || meta),
    callback: (dispatch, state) => dispatch(moveItemDownInCurrentProject()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowUp',
    callback: (dispatch, state) => dispatch(moveSelectionUpInCurrentProject()),
  }, {
    type: 'keydown',
    check: (key) => key === 'ArrowDown',
    callback: (dispatch, state) => dispatch(moveSelectionDownInCurrentProject()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Delete' || key === 'Backspace',
    callback: (dispatch, state) => dispatch(deleteSelectedItemInCurrentProject()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Escape',
    callback: (dispatch, state) => dispatch(clearSelectionInCurrentProject()),
  }, {
    type: 'keyup',
    check: (key, { control, meta }) => key === 'Enter' && (control || meta),
    callback: (dispatch, state) => dispatch(addAfterSelectedItemInCurrentProject()),
  }, {
    type: 'keyup',
    check: (key) => key === 'Enter',
    callback: (dispatch, state) => dispatch(startSelectedItemEditingInCurrentProject()),
  }
]