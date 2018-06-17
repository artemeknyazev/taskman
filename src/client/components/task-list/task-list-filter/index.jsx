import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import TextInput from 'client/components/common/text-input'

import './index.scss'

const TaskListFilter = ({
  query = '',
  inputRef = null,
  onChange,
  onKeyUp,
}) => (
  <div className="task-list-filter">
    <div className="task-list-filter__icon-container">
      <FontAwesomeIcon className="task-list-filter__icon" icon="search" />
    </div>
    <div className="task-list-filter__input-container">
      <TextInput
        className="task-list-filter__input"
        inputRef={inputRef}
        value={query}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder="Search tasks"
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