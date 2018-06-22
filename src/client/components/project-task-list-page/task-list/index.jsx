import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { debounce } from 'lodash'
import {
  setSelection,
  moveItemTo,
  itemStartEditing,
  stopEditing,
  editItem,
  deleteItem,
  addItemAfter,
  setFilter,
} from 'client/reducers/task-list'
import {
  getTaskListFilteredOrderedListByProjectId,
  getTaskListSelectedIdByProjectId,
  getTaskListIsEditingByProjectId,
  getTaskListIsFetchingByProjectId,
  getCurrentProjectId,
} from 'client/reducers'
import TaskListItem from './task-list-item'
import TaskListFilter from './task-list-filter'

import './index.scss'

const SortableTaskListItem = SortableElement(TaskListItem)
const SortableTaskList = SortableContainer(List)

class ProjectTaskList extends React.Component {
  constructor(props) {
    super(props)
    // keep item text in list because component could be unmounted
    // and remounted while scrolling when editing
    this.state = {
      selectedIndex: -1,
      query: '',
      editingText: '',
      isEditing: false,
    }
    this._itemInputRef = React.createRef()
    this._filterInputRef = React.createRef()
    this._onFilterChange = this._onFilterChange.bind(this)
    this._onFilterKeyUp = this._onFilterKeyUp.bind(this)
    this._onFilterClear = this._onFilterClear.bind(this)
    this._onFilterApply = debounce(this._onFilterApply.bind(this), 300)
    this._onItemSelect = this._onItemSelect.bind(this)
    this._onItemAddAfter = this._onItemAddAfter.bind(this)
    this._onItemDelete = this._onItemDelete.bind(this)
    this._onItemTextChange = this._onItemTextChange.bind(this)
    this._onItemTextKeyUp = this._onItemTextKeyUp.bind(this)
    this._onItemStartEditing = this._onItemStartEditing.bind(this)
    this._onItemCancelChanges = this._onItemCancelChanges.bind(this)
    this._onItemApplyChanges = this._onItemApplyChanges.bind(this)
    this._renderEmpty = this._renderEmpty.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { list, selectedId } = props
    let { editingText, isEditing } = state
    const selectedIndex = list.findIndex(item => item.id === selectedId)
    if (!state.isEditing && props.isEditing) {
      isEditing = true
      editingText = list[selectedIndex].text
    } else if (state.isEditing && !props.isEditing) {
      isEditing = false
      editingText = ''
    }
    return { editingText, isEditing, selectedIndex }
  }

  componentDidMount() {
    if (this.state.isEditing)
      this._itemInputRef.current.focus()
  }

  componentDidUpdate() {
    if (this.state.isEditing)
      this._itemInputRef.current.focus()
  }

  _onItemSelect(projectId, id) {
    this.props.onItemSelect(projectId, id)
  }

  _onItemAddAfter(projectId, id) {
    this.props.onItemAddAfter(projectId, id)
  }

  _onItemDelete(projectId, id) {
    this.props.onItemDelete(projectId, id)
  }

  _onItemTextChange(text) {
    this.setState({ editingText: text })
  }

  _onItemTextKeyUp(key) {
    if (key === 'Escape') {
      this._onItemCancelChanges()
    } else if (key === 'Enter') {
      this._onItemApplyChanges()
    }
  }

  _onItemStartEditing(projectId, id) {
    this.props.onItemStartEditing(projectId, id)
  }

  _onItemCancelChanges() {
    const { projectId, selectedId } = this.props
    this.props.onItemStopEditing(projectId, selectedId)
  }

  _onItemApplyChanges() {
    const { editingText } = this.state
    const { projectId, selectedId } = this.props
    this.props.onItemEditFinished(projectId, selectedId, { text: editingText })
  }

  _renderEmpty() {
    const { projectId, onItemAddAfter } = this.props
    const { query } = this.state
    return (
      <div className="task-list__empty">
        <span className="task-list__empty-text">
          {query ? ('No tasks are matching this filter.') : ('There are no tasks in this project.')}
          <a href="#" onClick={() => onItemAddAfter(projectId, null)}>Add one?</a>
        </span>
      </div>
    )
  }

  // TODO: check why selecting an item and then scrolling is laggy in Safari
  _renderRow({ index, key, style, isScrolling }) {
    const { list, selectedId } = this.props
    const { isEditing, editingText } = this.state
    const { id, projectId, text } = list[index]
    const isItemSelected = selectedId === id
    const isItemEditing = isItemSelected && isEditing
    const elem = (
      <SortableTaskListItem
        index={index}
        id={id}
        projectId={projectId}
        text={text}
        isSelected={isItemSelected}
        isEditing={isItemEditing}
        inputText={editingText}
        inputRef={this._itemInputRef}
        onTextChange={this._onItemTextChange}
        onTextKeyUp={this._onItemTextKeyUp}
        onItemAddAfter={this._onItemAddAfter}
        onItemClick={this._onItemSelect}
        onItemStartEditing={this._onItemStartEditing}
        onItemCancelChanges={this._onItemCancelChanges}
        onItemApplyChanges={this._onItemApplyChanges}
        onItemDelete={this._onItemDelete}
      />
    )
    return (
      <div
        key={key}
        style={style}
        className="task-list__task-list-item-container noselect"
      >
        {elem}
      </div>
    )
  }

  _onSortEnd({ oldIndex, newIndex }) {
    const { list, projectId } = this.props
    if (oldIndex !== newIndex)
      this.props.onItemMoveTo(projectId, list[oldIndex].id, list[newIndex].id)
  }

  _onFilterChange(query) {
    this.setState({ query }, this._onFilterApply)
  }

  _onFilterKeyUp(key) {
    if (key === 'Escape') {
      this._filterInputRef.current.blur()
    } else if (key === 'Enter') {
      this._onFilterApply()
      this._filterInputRef.current.blur()
      const { list, projectId } = this.props
      if (list.length)
        this.props.onItemSelect(projectId, list[0].id)
    }
  }

  _onFilterClear() {
    this.setState({ query: '' }, this._onFilterApply)
  }

  _onFilterApply() {
    this.props.onFilterApply(this.props.projectId, { query: this.state.query })
  }

  render() {
    const { list, selectedId } = this.props
    const { editingText, query, selectedIndex } = this.state
    return (
      <div className="task-list">
        <TaskListFilter
          inputRef={this._filterInputRef}
          query={query}
          onChange={this._onFilterChange}
          onKeyUp={this._onFilterKeyUp}
          onClear={this._onFilterClear}
        />
        <div className="task-list__list-container">
          <AutoSizer
            // TODO: think about better way of supplying initial dimensions
            defaultHeight={0}
            defaultWidth={0}
          >
            {({ height, width }) => (
              <SortableTaskList
                lockAxis="y"
                distance={4}
                width={width}
                height={height}
                rowCount={list.length}
                rowHeight={45}
                overscanRowCount={10}
                noRowsRenderer={this._renderEmpty}
                rowRenderer={this._renderRow}
                onSortEnd={this._onSortEnd}
                useDragHandle={true}
                /* note: rerenders when one of the props below has changed */
                scrollToIndex={selectedIndex}
                list={list}
                selectedId={selectedId}
                editingText={editingText}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

ProjectTaskList.propTypes = {
  projectId: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => {
  const projectId = getCurrentProjectId(state)
  return {
    projectId,
    list: getTaskListFilteredOrderedListByProjectId(projectId, state),
    selectedId: getTaskListSelectedIdByProjectId(projectId, state),
    isEditing: getTaskListIsEditingByProjectId(projectId, state),
    isFetching: getTaskListIsFetchingByProjectId(projectId, state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFilterApply: (projectId, filter) =>
    dispatch(setFilter(projectId, filter)),
  onItemAddAfter: (projectId, id) =>
    dispatch(addItemAfter(projectId, id)),
  onItemSelect: (projectId, id) =>
    dispatch(setSelection(projectId, id)),
  onItemMoveTo: (projectId, movingId, movedToId) =>
    dispatch(moveItemTo(projectId, movingId, movedToId)),
  onItemStartEditing: (projectId, id) =>
    dispatch(itemStartEditing(projectId, id)),
  onItemStopEditing: (projectId, id) =>
    dispatch(stopEditing(projectId, id)),
  onItemEditFinished: (projectId, id, data) =>
    dispatch(editItem(projectId, id, data)),
  onItemDelete: (projectId, id) =>
    dispatch(deleteItem(projectId, id)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTaskList))