import {
  clearSelection,
  moveSelectionUp,
  moveSelectionDown,
  openSelectedProject,
} from 'client/reducers/project-list'

export default [
  {
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
  }, {
    type: 'keyup',
    check: (key) => key === 'Enter',
    callback: (dispatch) => dispatch(openSelectedProject()),
  }
]