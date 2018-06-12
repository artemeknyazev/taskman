import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Handle from 'client/components/common/handle'
import './index.scss'

const TaskItem = ({
  id, text, inputText, inputRef, isSelected, isEditing,
  onItemClick, onTextClick, onTextChange, onTextKeyUp,
}) => (
  <div
    className={cx({
      'task-item': true,
      'task-item--selected': isSelected,
      'task-item--editing': isEditing,
    })}
    data-task-item-id={id}
    onClick={(ev) => onItemClick && onItemClick(ev)}
  >
    <Handle className="task-item__handle" />
    <div className="task-item__text-container">
      {isEditing ? (
        <span className="task-item__input">
          <input
            type="text"
            value={inputText}
            ref={inputRef}
            onChange={(ev) => onTextChange && onTextChange(ev)}
            onKeyUp={(ev) => onTextKeyUp && onTextKeyUp(ev)}
          />
        </span>
      ) : (
        <span
          className="task-item__text"
          onClick={(ev) => onTextClick && onTextClick(ev)}
        >
          {text}
        </span>  
      )}
    </div>
  </div>
)

TaskItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  inputText: PropTypes.string.isRequired,
  inputRef: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  onTextClick: PropTypes.func,
  onTextChange: PropTypes.func,
  onTextKeyUp: PropTypes.func,
}

export const TaskItemScrolling = () => (
  <div className="task-item">
    <Handle className="task-item__handle" />
    <div className="task-item__text-container">
      <span className="task-item__text">&#8230;</span>
    </div>
  </div>
)

export default TaskItem
