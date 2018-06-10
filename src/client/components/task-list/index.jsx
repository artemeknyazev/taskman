import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import {
  setSelection,
  moveItemTo,
  startItemEdit,
  stopItemEdit,
  cancelItemEdit,
} from 'reducers/index.js'
import TaskItem from './task-item'

import './index.scss'

const SortableTaskItem = SortableElement(TaskItem)
const SortableTaskList = SortableContainer(List)

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    // keep item text in list because component could be unmounted and remounted while scrolling when editing
    this.state = { editingText: '', isEditing: false }
    this._inputRef = React.createRef()
    this._focusItemInputIfEditing = this._focusItemInputIfEditing.bind(this)
    this._onItemTextChange = this._onItemTextChange.bind(this)
    this._onItemTextKeyUp = this._onItemTextKeyUp.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { list, selected } = props
    let editingText = state.editingText
    if (!state.isEditing && props.isEditing)
      editingText = list[selected].text
    else if (state.isEditing && !props.isEditing)
      editingText = ''
    return {
      editingText,
      isEditing: props.isEditing,
    }
  }

  componentDidMount() {
    this._focusItemInputIfEditing()
  }

  componentDidUpdate() {
    this._focusItemInputIfEditing()
  }

  _focusItemInputIfEditing() {
    if (this.state.isEditing && this._inputRef.current)
      this._inputRef.current.focus()
  }

  _onItemTextChange(ev) {
    this.setState({ editingText: ev.target.value })
  }

  _onItemTextKeyUp(ev) {
    if (ev.nativeEvent.key === 'Escape')
      this.props.onCancelEdit()
    else if (ev.nativeEvent.key === 'Enter')
      this.props.onStopEdit(this.state.editingText)
  }

  _renderRow(props) {
    const { list, selected, isEditing, onItemClick, onTextClick } = this.props
    const { index, key, style, isScrolling } = props
    const { editingText } = this.state
    const { id, text } = list[index]
    const isItemSelected = selected === index
    const isItemEditing = isItemSelected && isEditing
    // TODO: check why selecting an item and then scrolling is laggy
    const elem = (
      <SortableTaskItem
        index={index}
        id={id}
        text={text}
        isSelected={isItemSelected}
        isEditing={isItemEditing}
        onItemClick={() => onItemClick(index)}
        inputText={isItemEditing ? editingText : ''}
        inputRef={this._inputRef}
        onTextClick={isItemEditing ? null : onTextClick}
        onTextChange={isItemEditing ? this._onItemTextChange : null}
        onTextKeyUp={isItemEditing ? this._onItemTextKeyUp : null}
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
            lockAxis={'y'}
            distance={4}
            className="task-list"
            width={width}
            height={height}
            rowCount={list.length}
            rowHeight={45}
            overscanRowCount={10}
            rowRenderer={this._renderRow}
            onSortEnd={this._onSortEnd}
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
}

const mapStateToProps = (state) => {
  return {
    list: state.list,
    selected: state.selected,
    isEditing: state.isEditing,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onItemClick: (index) => 
    dispatch(setSelection(index)),
  onItemMoveTo: (oldIndex, newIndex) =>
    dispatch(moveItemTo(oldIndex, newIndex)),
  onTextClick: () =>
    dispatch(startItemEdit()),
  onCancelEdit: () =>
    dispatch(cancelItemEdit()),
  onStopEdit: (text) =>
    dispatch(stopItemEdit(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
