import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ProjectItem from './project-item';
import {
  getProjectListOrderedList,
  getProjectListSelectedId,
  getProjectListIsFetching,
} from 'client/reducers'
import './index.scss'

class ProjectList extends React.Component {
  constructor(props) {
    super(props)
    this._onProjectClick = this._onProjectClick.bind(this)
    this._renderRow = this._renderRow.bind(this)
  }

  _onProjectClick(id, slug) {
    this.props.history.push(`/projects/${slug}`)
  }

  _renderRow({ id, slug, name }, index) {
    const { selectedProjectId } = this.props
    return (
      <div
        className="project-list__project-item-container"
        key={id}
      >
        <ProjectItem
          id={id}
          slug={slug}
          name={name}
          isSelected={id === selectedProjectId}
          onClick={this._onProjectClick}
        />
      </div>
    )
  }

  render() {
    const { list } = this.props
    return (
      <div className="project-list">
        {list.map((item, index) => (
          this._renderRow(item, index)
        ))}
      </div>
    )
  }
}

ProjectList.displayName = 'ProjectList'

ProjectList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  selectedProjectId: PropTypes.number,
}

const mapStateToProps = (state) => {
  return ({
    list: getProjectListOrderedList(state),
    selectedProjectId: getProjectListSelectedId(state),
    isFetching: getProjectListIsFetching(state),
  })
}

export default withRouter(connect(mapStateToProps)(ProjectList))