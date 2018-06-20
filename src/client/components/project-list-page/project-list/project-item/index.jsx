import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './index.scss'

const ProjectItem = ({
  id,
  name,
  slug,
  isSelected,
  onClick,
}) => (
  <div
    className={cx({
      'project-item': true,
      'project-item--selected': isSelected,
    })}
    onClick={(ev) => onClick(id, slug) && ev.stopPropagation()}
  >
    <div className="project-item__name-container">
      <span className="project-item__name">
        {name}
      </span>
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
}

export default ProjectItem