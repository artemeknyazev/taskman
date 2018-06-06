import React from 'react'
import PropTypes from 'prop-types'

import Handle from 'components/common/handle'
import './index.scss'

const TaskItem = ({
  id, text, selected, onItemClick,
}) => (
  <div
    className={"task-item " + (selected ? "task-item--selected" : "")}
    data-task-item-id={id}
    onClick={onItemClick}
  >
    <Handle className="task-item__handle" />
    <div className="task-item__text-container">
      <span className="task-item__text">{text}</span>
    </div>
  </div>
)

TaskItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func.isRequired,
}

export default TaskItem
