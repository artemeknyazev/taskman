import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FaButton from 'client/components/common/fa-button'
import './index.scss'

const ProjectItem = ({
  id,
  name,
  slug,
  isSelected,
  onClick,
  onOpen,
}) => (
  <div
    className={cx({
      'project-item': true,
      'project-item--selected': isSelected,
    })}
    onClick={(ev) => onClick(id) && ev.stopPropagation()}
  >
    <div className="project-item__name-container">
      <span className="project-item__name">
        {name}
      </span>
    </div>
    <div className="project-item__controls-container">
        <FaButton
          className="project-item__open-button project-item__control-button fa-button--circle"
          icon="door-open"
          tooltip="Open project"
          onClick={(ev) => onOpen(id) && ev.stopPropagation()}
        />
    </div>
  </div>
)

ProjectItem.displayName = 'ProjectItem'

ProjectItem.propTypes = {
  id: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default ProjectItem