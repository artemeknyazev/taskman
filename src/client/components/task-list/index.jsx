import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import {
  setSelection,
  moveItemTo,
  itemStartEditing,
  stopEditing,
  editItem,
  deleteItem,
  getOrderedList,
} from 'client/reducers'
import TaskItem from './task-item'

import './index.scss'

const SortableTaskItem = SortableElement(TaskItem)
const SortableTaskList = SortableContainer(List)

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    // keep item text in list because component could be unmounted
    // and remounted while scrolling when editing
    this.state = {
      editingId: -1,
      editingText: '',
      isEditing: false,
    }
    this._inputRef = React.createRef()
    this._onItemTextChange = this._onItemTextChange.bind(this)
    this._onItemTextKeyUp = this._onItemTextKeyUp.bind(this)
    this._onItemCancelChanges = this._onItemCancelChanges.bind(this)
    this._onItemApplyChanges = this._onItemApplyChanges.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { list, selected } = props
    let { editingId, editingText, isEditing } = state
    if (!state.isEditing && props.isEditing) {
      const { id, text } = list[selected]
      isEditing = true
      editingId = id
      editingText = text
    } else if (state.isEditing && !props.isEditing) {
      isEditing = false
      editingId = -1
      editingText = ''
    }
    return { editingId, editingText, isEditing }
  }

  componentDidMount() {
    if (this.state.isEditing)
      this._inputRef.current.focus()
  }

  componentDidUpdate() {
    if (this.state.isEditing)
      this._inputRef.current.focus()
  }

  _onItemTextChange(ev) {
    this.setState({ editingText: ev.target.value })
  }

  _onItemCancelChanges() {
    this.setState({
      editingId: -1,
      editingText: '',
      isEditing: false,
    }, () => {
      this.props.onItemStopEditing()
    })
  }

  _onItemApplyChanges() {
    const { editingId, editingText } = this.state
    this.setState({
      editingId: -1,
      editingText: '',
      isEditing: false,
    }, () => {
      this.props.onItemEditFinished(editingId, { text: editingText })
    })
  }

  _onItemTextKeyUp(ev) {
    if (ev.nativeEvent.key === 'Escape') {
      this._onItemCancelChanges()
    } else if (ev.nativeEvent.key === 'Enter') {
      this._onItemApplyChanges()
    }
  }

  // TODO: check why selecting an item and then scrolling is laggy in Safari
  _renderRow({ index, key, style, isScrolling }) {
    const {
      list, selected,
      onItemSelect, onItemDelete, onItemStartEditing,
    } = this.props
    const { editingId, editingText } = this.state
    const { id, text } = list[index]
    const isItemSelected = selected === index
    const isItemEditing = id === editingId
    const elem = (
      <SortableTaskItem
        index={index}
        id={id}
        text={text}
        isSelected={isItemSelected}
        isEditing={isItemEditing}
        inputText={editingText}
        inputRef={this._inputRef}
        onTextClick={() => onItemStartEditing(id)}
        onTextChange={this._onItemTextChange}
        onTextKeyUp={this._onItemTextKeyUp}
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

  render() {
    const { defaultHeight, defaultWidth, list, selected } = this.props
    const { editingText } = this.state
    return (
      <AutoSizer
        defaultHeight={defaultHeight}
        defaultWidth={defaultWidth}
      >
        {({ height, width }) => (
          <SortableTaskList
            lockAxis="y"
            distance={4}
            className="task-list"
            width={width}
            height={height}
            rowCount={list.length}
            rowHeight={45}
            overscanRowCount={10}
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

const mapStateToProps = (state) => {
  return {
    list: getOrderedList(state),
    selected: state.selected,
    isEditing: state.isEditing,
    isFetching: state.isFetching,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onItemSelect: (index) => dispatch(setSelection(index)),
  onItemMoveTo: (oldIndex, newIndex) => dispatch(moveItemTo(oldIndex, newIndex)),
  onItemStartEditing: (id) => dispatch(itemStartEditing(id)),
  onItemStopEditing: () => dispatch(stopEditing()),
  onItemEditFinished: (id, data) => dispatch(editItem(id, data)),
  onItemDelete: (id) => dispatch(deleteItem(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)