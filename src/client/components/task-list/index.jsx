import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import _ from 'lodash'
import {
  setSelection,
  moveItemTo,
  itemStartEditing,
  stopEditing,
  editItem,
  deleteItem,
  addItemAfterIndex,
  setFilter,
  getFilteredOrderedList,
} from 'client/reducers'
import TaskItem from './task-item'
import TaskListFilter from './task-list-filter'

import './index.scss'

const SortableTaskItem = SortableElement(TaskItem)
const SortableTaskList = SortableContainer(List)

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    // keep item text in list because component could be unmounted
    // and remounted while scrolling when editing
    this.state = {
      query: '',
      editingText: '',
      isEditing: false,
    }
    this._itemInputRef = React.createRef()
    this._filterInputRef = React.createRef()
    this._onFilterChange = this._onFilterChange.bind(this)
    this._onFilterKeyUp = this._onFilterKeyUp.bind(this)
    this._onFilterClear = this._onFilterClear.bind(this)
    this._onFilterApply = _.debounce(this._onFilterApply.bind(this), 300)
    this._onItemTextChange = this._onItemTextChange.bind(this)
    this._onItemTextKeyUp = this._onItemTextKeyUp.bind(this)
    this._onItemCancelChanges = this._onItemCancelChanges.bind(this)
    this._onItemApplyChanges = this._onItemApplyChanges.bind(this)
    this._renderEmpty = this._renderEmpty.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { list, selected } = props
    let { editingText, isEditing } = state
    if (!state.isEditing && props.isEditing) {
      const { id, text } = list[selected]
      isEditing = true
      editingText = text
    } else if (state.isEditing && !props.isEditing) {
      isEditing = false
      editingText = ''
    }
    return { editingText, isEditing }
  }

  componentDidMount() {
    if (this.state.isEditing)
      this._itemInputRef.current.focus()
  }

  componentDidUpdate() {
    if (this.state.isEditing)
      this._itemInputRef.current.focus()
  }

  _onItemTextChange(ev) {
    this.setState({ editingText: ev.target.value })
  }

  _onItemCancelChanges() {
    this.props.onItemStopEditing()
  }

  _onItemApplyChanges() {
    const { editingText } = this.state
    const { list, selected } = this.props
    const id = list[selected].id
    this.props.onItemEditFinished(id, { text: editingText })
  }

  _onItemTextKeyUp(ev) {
    if (ev.nativeEvent.key === 'Escape') {
      this._onItemCancelChanges()
    } else if (ev.nativeEvent.key === 'Enter') {
      this._onItemApplyChanges()
    }
  }

  _renderEmpty() {
    const { onItemAddAfter } = this.props
    const { query } = this.state
    return (
      <div className="task-list__empty">
        <span className="task-list__empty-text">
          {query ? ('No tasks are matching this filter.') : ('There are no tasks in this project.')}
          <a href="#" onClick={onItemAddAfter}>Add one?</a>
        </span>
      </div>
    )
  }

  // TODO: check why selecting an item and then scrolling is laggy in Safari
  _renderRow({ index, key, style, isScrolling }) {
    const {
      list, selected,
      onItemSelect, onItemDelete, onItemStartEditing, onItemAddAfter,
    } = this.props
    const { isEditing, editingText } = this.state
    const { id, text } = list[index]
    const isItemSelected = selected === index
    const isItemEditing = isItemSelected && isEditing
    const elem = (
      <SortableTaskItem
        index={index}
        id={id}
        text={text}
        isSelected={isItemSelected}
        isEditing={isItemEditing}
        inputText={editingText}
        inputRef={this._itemInputRef}
        onTextChange={this._onItemTextChange}
        onTextKeyUp={this._onItemTextKeyUp}
        onItemAddAfter={() => onItemAddAfter(index)}
        onItemClick={() => onItemSelect(index)}
        onItemStartEditing={() => onItemStartEditing(id)}
        onItemCancelChanges={this._onItemCancelChanges}
        onItemApplyChanges={this._onItemApplyChanges}
        onItemDelete={() => onItemDelete(id)}
      />
    )
    return (
      <div
        key={key}
        style={style}
        className="task-list__task-item-container noselect"
      >
        {elem}
      </div>
    )
  }

  _onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex)
      this.props.onItemMoveTo(oldIndex, newIndex)
  }

  _onFilterChange(ev) {
    this.setState({ query: ev.target.value }, this._onFilterApply)
  }

  _onFilterClear() {
    this.setState({ query: '' }, this._onFilterApply)
  }

  _onFilterKeyUp(ev) {
    if (ev.nativeEvent.key === 'Escape') {
      this._filterInputRef.current.blur()
    } else if (ev.nativeEvent.key === 'Enter') {
      this._onFilterApply()
      this._filterInputRef.current.blur()
      this.props.onItemSelect(0)
    }
  }

  _onFilterApply() {
    this.props.onFilterApply(this.state.query)
  }

  render() {
    const { defaultHeight, defaultWidth, list, selected } = this.props
    const { editingText, query } = this.state
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
            defaultHeight={defaultHeight}
            defaultWidth={defaultWidth}
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
                scrollToIndex={selected}
                list={list}
                selected={selected}
                editingText={editingText}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
}

TaskList.propTypes = {
  list: PropTypes.array.isRequired,
  selected: PropTypes.number.isRequired,
  defaultHeight: PropTypes.number.isRequired,
  defaultWidth: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  list: getFilteredOrderedList(state),
  selected: state.selected,
  isEditing: state.isEditing,
  isFetching: state.isFetching,
})

const mapDispatchToProps = (dispatch) => ({
  onFilterApply: (query) => dispatch(setFilter(query)),
  onItemAddAfter: (index = null) => dispatch(addItemAfterIndex(index)),
  onItemSelect: (index) => dispatch(setSelection(index)),
  onItemMoveTo: (oldIndex, newIndex) => dispatch(moveItemTo(oldIndex, newIndex)),
  onItemStartEditing: (id) => dispatch(itemStartEditing(id)),
  onItemStopEditing: () => dispatch(stopEditing()),
  onItemEditFinished: (id, data) => dispatch(editItem(id, data)),
  onItemDelete: (id) => dispatch(deleteItem(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)