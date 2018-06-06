import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AutoSizer, List } from 'react-virtualized'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { setSelection, moveItemTo } from 'reducers/index.js'
import TaskItem, { TaskItemScrolling } from './task-item'

import './index.scss'

const SortableTaskItem = SortableElement(TaskItem)
const SortableTaskList = SortableContainer(List)

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  renderRow(props) {
    const { list, selected, onItemClick } = this.props
    const { index, key, style, isScrolling } = props
    const { id, text } = list[index]
    const elem = isScrolling ? (
        <TaskItemScrolling />
      ) : (
        <SortableTaskItem
          index={index}
          id={id}
          text={text}
          selected={index === selected}
          onItemClick={() => onItemClick(index)}
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

  onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex)
      this.props.onItemMoveTo(oldIndex, newIndex)
  }

  render() {
    const { defaultHeight, defaultWidth, list, selected } = this.props
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
            rowRenderer={this.renderRow}
            onSortEnd={this.onSortEnd}
            /* note: rerenders when one of the props below has changed */
            scrollToIndex={selected}
            list={list}
            selected={selected}
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
}

const mapStateToProps = (state) => {
  return {
    list: state.list,
    selected: state.selected,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onItemClick: (index) => 
    dispatch(setSelection(index)),
  onItemMoveTo: (oldIndex, newIndex) =>
    dispatch(moveItemTo(oldIndex, newIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
