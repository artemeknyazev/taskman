import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { SortableHandle } from 'react-sortable-hoc'

import Handle from 'client/components/common/handle'
import Button from 'client/components/common/button'
import TextInput from 'client/components/common/text-input'
import './index.scss'

const TaskItemHandle = SortableHandle(() => (
  <Handle className="task-item__handle" />
))

const TaskItem = ({
  id = null,
  text,
  inputText,
  inputRef = null,
  isSelected = false,
  isEditing = false,
  onItemClick = null,
  onTextChange = null,
  onTextKeyUp = null,
  onItemStartEditing = null,
  onItemApplyChanges = null,
  onItemCancelChanges = null,
  onItemAddAfter = null,
  onItemDelete = null,
}) => (
  <div
    className={cx({
      'task-item': true,
      'task-item--selected': isSelected,
      'task-item--editing': isEditing,
    })}
    data-task-item-id={id}
    onClick={(ev) => onItemClick && onItemClick(ev) && ev.stopPropagation()}
  >
    <TaskItemHandle />
    <div className="task-item__text-container">
      {isEditing ? (
        <span className="task-item__input">
          <TextInput
            inputRef={inputRef}
            value={inputText}
            onChange={(ev) => onTextChange && onTextChange(ev)}
            onKeyUp={(ev) => onTextKeyUp && onTextKeyUp(ev)}
          />
        </span>
      ) : (
        <span
          className="task-item__text"
        >
          {text}
        </span>  
      )}
    </div>
    <div className="task-item__controls-container">
      <Button
        className="task-item__edit-button"
          onClick={(ev) => onItemAddAfter && onItemAddAfter(ev) && ev.stopPropagation()}
      >
        +
      </Button>
      <Button
        className="task-item__edit-button"
        onClick={(ev) => onItemStartEditing && onItemStartEditing(ev) && ev.stopPropagation()}
      >
        ✏
      </Button>
      <Button
        className="task-item__delete-button"
        onClick={(ev) => onItemDelete && onItemDelete(ev) && ev.stopPropagation()}
      >
        ♲
      </Button>
      <Button
        className="task-item__apply-button"
        onClick={(ev) => onItemApplyChanges && onItemApplyChanges(ev) && ev.stopPropagation()}
      >
        ✓
      </Button>
      <Button
        className="task-item__cancel-button"
        onClick={(ev) => onItemCancelChanges && onItemCancelChanges(ev) && ev.stopPropagation()}
      >
        ✖
      </Button>
    </div>
  </div>
)

TaskItem.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string.isRequired,
  inputText: PropTypes.string.isRequired,
  inputRef: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func,
  onTextClick: PropTypes.func,
  onTextChange: PropTypes.func,
  onTextKeyUp: PropTypes.func,
  onItemAddAfter: PropTypes.func,
  onItemStartEditing: PropTypes.func,
  onItemApplyChanges: PropTypes.func,
  onItemCancelChanges: PropTypes.func,
  onItemDelete: PropTypes.func,
}

export default TaskItem