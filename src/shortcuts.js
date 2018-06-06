import {
  clearSelection,
  moveItemUp,
  moveItemDown,
  moveSelectionUp,
  moveSelectionDown,
} from 'reducers'

export default [
  {
    type: 'keyup',
    check: ({ key }, { control }) => key === 'ArrowUp' && control,
    callback: (dispatch) => dispatch(moveItemUp()),
  }, {
    type: 'keyup',
    check: ({ key }, { control }) => key === 'ArrowDown' && control,
    callback: (dispatch) => dispatch(moveItemDown()),
  }, {
    type: 'keyup',
    check: ({ key }) => key === 'ArrowUp',
    callback: (dispatch) => dispatch(moveSelectionUp())
  }, {
    type: 'keyup',
    check: ({ key }) => key === 'ArrowDown',
    callback: (dispatch) => dispatch(moveSelectionDown())
  }, {
    type: 'keyup',
    check: ({ key }) => key === 'Escape',
    callback: (dispatch) => { dispatch(clearSelection()) }
  }
]
