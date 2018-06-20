import { sortItemsByField } from 'utils'
import {
  getProjects,
} from 'client/api/projects'
import {
  getProjectList
} from './index'

/* ----------------------------------- ACTIONS ----------------------------------- */

const FETCH_PROJECTS = 'PROJECT_LIST/FETCH_PROJECTS'
const fetchProjectsAction = (
  error = null,
  result = null,
) => ({
  type: FETCH_PROJECTS,
  error,
  result,
})
export const fetchProjects = () =>
  (dispatch) => {
    dispatch(fetchProjectsAction())
    return getProjects().then(
      ({ result }) => dispatch(fetchProjectsAction(null, result)),
      ({ error }) => dispatch(fetchProjectsAction(error)),
    )
  }

const SET_SELECTION = 'PROJECT_LIST/SET_SELECTION'
export const setSelection = (selectedId) => ({
  type: SET_SELECTION,
  selectedId
})
export const clearSelection = () =>
  setSelection(null)
export const moveSelectionUp = () =>
  (dispatch, getState) => {
    const { selectedId, orderedIds } = getProjectList(getState())
    if (orderedIds.length) {
      const index = orderedIds.indexOf(selectedId)
      if (index <= 0)
        return dispatch(setSelection(orderedIds[orderedIds.length - 1]))
      else
        return dispatch(setSelection(orderedIds[index - 1]))
    }
    return dispatch(clearSelection())
  }
export const moveSelectionDown = () =>
  (dispatch, getState) => {
    const { selectedId, orderedIds } = getProjectList(getState())
    if (orderedIds.length) {
      const index = orderedIds.indexOf(selectedId)
      if (index === -1 || index >= orderedIds.length - 1)
        return dispatch(setSelection(orderedIds[0]))
      else
        return dispatch(setSelection(orderedIds[index + 1]))
    }
    return dispatch(clearSelection())
  }

/* ----------------------------------- REDUCER ----------------------------------- */

const reducer = (
  state = {
    isFetching: false,
    byId: {},
    allIds: [],
    orderedIds: [],
    selectedId: null,
  },
  action,
) => {
  switch (action.type) {
    case SET_SELECTION:
      return { ...state, selectedId: action.selectedId }

    case FETCH_PROJECTS: {
      if (action.result) {
        let byId = {}
        let allIds = []
        action.result.collection.forEach(item => {
          byId[item.id] = item
          allIds.push(item.id)
        })
        let orderedIds = sortItemsByField(allIds, byId, 'title')
        return {
          ...state,
          isFetching: false,
          byId,
          allIds,
          orderedIds,
        }
      } else if (action.error) {
        return { ...state, isFetching: false }
      } else {
        return { ...state, isFetching: true }
      }
    }
  }

  return state
}

export default reducer

/* ---------------------------------- SELECTORS ---------------------------------- */

// TODO: memoized selector
export const getOrderedList = (state) =>
  state.orderedIds.map(id => state.byId[id])

export const getSelectedId = (state) =>
  state.selectedId

export const getSelectedProjectSlug = (state) =>
  state.selectedId
    ? state.byId[state.selectedId].slug
    : null

export const getIsFetching = (state) =>
  state.isFetching