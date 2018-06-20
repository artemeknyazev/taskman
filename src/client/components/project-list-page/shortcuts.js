import {
  clearSelection,
  moveSelectionUp,
  moveSelectionDown,
} from 'client/reducers/project-list'
import {
  getProjectListSelectedProjectSlug,
} from 'client/reducers'

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
    callback: (dispatch, state, { history }) => {
      const slug = getProjectListSelectedProjectSlug(state)
      if (slug)
        history.push(`/projects/${slug}`)
    },
  }
]
