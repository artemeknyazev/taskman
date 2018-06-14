import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import {
  setSelection,
  moveItemTo,
  editItem,
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
    this._onItemTextClick = this._onItemTextClick.bind(this)
    this._onItemTextChange = this._onItemTextChange.bind(this)
    this._onItemTextKeyUp = this._onItemTextKeyUp.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const { list, selected } = props
    let { isEditing, editingId, editingText } = state
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
    return {
      editingId,
      editingText,
      isEditing,
    }
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

  _onItemTextKeyUp(ev) {
    if (ev.nativeEvent.key === 'Escape') {
      this.setState({
        editingId: -1,
        editingText: '',
        isEditing: false,
      })
    } else if (ev.nativeEvent.key === 'Enter') {
      const { editingId, editingText } = this.state
      this.setState({
        editingId: -1,
        editingText: '',
        isEditing: false,
      }, () => {
        this.props.onItemEdit(editingId, { text: editingText })
      })
    }
  }

  _onItemTextClick(id, text) {
    this.setState({
      editingId: id,
      editingText: text,
      isEditing: true,
    })
  }

  // TODO: check why selecting an item and then scrolling is laggy in Safari
  _renderRow({ index, key, style, isScrolling }) {
    const { list, selected, onItemSelect } = this.props
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
        onItemClick={onItemSelect.bind(null, index)}
        inputText={isItemEditing ? editingText : ''}
        inputRef={this._inputRef}
        onTextClick={isItemEditing ? null : this._onItemTextClick.bind(id, text)}
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
  onItemSelect: (index) =>
    dispatch(setSelection(index)),
  onItemMoveTo: (oldIndex, newIndex) =>
    dispatch(moveItemTo(oldIndex, newIndex)),
  onItemEdit: (id, data) =>
    dispatch(editItem(id, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
