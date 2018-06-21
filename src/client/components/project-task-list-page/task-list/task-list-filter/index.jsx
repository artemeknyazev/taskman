import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import TextInput from 'client/components/common/text-input'
import FaButton from 'client/components/common/fa-button'

import './index.scss'

const TaskListFilter = ({
  query = '',
  inputRef = null,
  onChange,
  onKeyUp,
  onClear,
}) => (
  <div
    className={cx({
      'task-list-filter': true,
      'task-list-filter--empty': query === '',
      'task-list-filter--not-empty': query !== '',
    })}
  >
    <div className="task-list-filter__icon-container">
      <FontAwesomeIcon className="task-list-filter__icon" icon="search" />
    </div>
    <div className="task-list-filter__input-container">
      <TextInput
        className="task-list-filter__input"
        inputRef={inputRef}
        value={query}
        onChange={(ev) => onChange && onChange(ev.target.value)}
        onKeyUp={(ev) => onKeyUp && onKeyUp(ev.nativeEvent.key)}
        placeholder="Search tasks"
      />
    </div>
    <div className="task-list-filter__controls-container">
      <FaButton
        className="task-list-filter__clear-filter-button task-list-filter__control-button"
        icon="times-circle"
        tooltip="Clear filter"
        onClick={(ev) => onClear() && ev.preventDefault()}
      />
    </div>
  </div>
)

TaskListFilter.displayName = 'TaskListFilter'

TaskListFilter.propTypes = {
  query: PropTypes.string,
  inputRef: PropTypes.object,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
}

export default TaskListFilter