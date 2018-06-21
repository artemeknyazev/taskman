import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { SortableHandle } from 'react-sortable-hoc'

import Handle from 'client/components/common/handle'
import FaButton from 'client/components/common/fa-button'
import TextInput from 'client/components/common/text-input'
import './index.scss'

const TaskListItemHandle = SortableHandle(() => (
  <Handle className="task-list-item__handle" />
))

const TaskListItem = ({
  id,
  projectId,
  text,
  inputText,
  inputRef,
  isSelected,
  isEditing,
  onItemClick,
  onTextChange,
  onTextKeyUp,
  onItemStartEditing,
  onItemApplyChanges,
  onItemCancelChanges,
  onItemAddAfter,
  onItemDelete,
}) => (
  <div
    className={cx({
      'task-list-item': true,
      'task-list-item--selected': isSelected,
      'task-list-item--editing': isEditing,
    })}
    data-task-list-item-id={id}
    data-task-list-item-project-id={projectId}
    onMouseDown={(ev) => ev.stopPropagation()}
    onClick={(ev) => onItemClick && onItemClick(projectId, id) && ev.stopPropagation()}
  >
    <TaskListItemHandle />
    <div className="task-list-item__id-container">
      <span className="task-list-item__id">{id}</span>
    </div>
    <div className="task-list-item__text-container">
      {isEditing ? (
        <span className="task-list-item__input">
          <TextInput
            inputRef={inputRef}
            value={inputText}
            onChange={(ev) => onTextChange && onTextChange(ev.target.value)}
            onKeyUp={(ev) => onTextKeyUp && onTextKeyUp(ev.nativeEvent.key)}
          />
        </span>
      ) : (
        <span className="task-list-item__text">{text}</span>
      )}
    </div>
    <div className="task-list-item__controls-container">
      <FaButton
        className="task-list-item__add-after-button task-list-item__control-button fa-button--circle"
        icon="plus"
        tooltip="Add task after"
        onClick={(ev) => onItemAddAfter && onItemAddAfter(projectId, id) && ev.stopPropagation()}
      />
      <FaButton
        className="task-list-item__edit-button task-list-item__control-button fa-button--circle"
        icon="edit"
        tooltip="Edit task"
        onClick={(ev) => onItemStartEditing && onItemStartEditing(projectId, id) && ev.stopPropagation()}
      />
      <FaButton
        className="task-list-item__delete-button task-list-item__control-button fa-button--circle"
        icon="trash"
        tooltip="Delete task"
        onClick={(ev) => onItemDelete && onItemDelete(projectId, id) && ev.stopPropagation()}
      />
      <FaButton
        className="task-list-item__apply-button task-list-item__control-button fa-button--circle"
        icon="check"
        tooltip="Save changes"
        onClick={(ev) => onItemApplyChanges && onItemApplyChanges(projectId, id) && ev.stopPropagation()}
      />
      <FaButton
        className="task-list-item__cancel-button task-list-item__control-button fa-button--circle"
        icon="times"
        tooltip="Discard changes"
        onClick={(ev) => onItemCancelChanges && onItemCancelChanges(projectId) && ev.stopPropagation()}
      />
    </div>
  </div>
)

TaskListItem.propTypes = {
  id: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  inputText: PropTypes.string.isRequired,
  inputRef: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onTextKeyUp: PropTypes.func.isRequired,
  onItemAddAfter: PropTypes.func.isRequired,
  onItemStartEditing: PropTypes.func.isRequired,
  onItemApplyChanges: PropTypes.func.isRequired,
  onItemCancelChanges: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired,
}

export default TaskListItem