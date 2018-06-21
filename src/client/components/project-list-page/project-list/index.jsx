import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ProjectItem from './project-item';
import {
  openProject,
  setSelection,
} from 'client/reducers/project-list'
import {
  getProjectListOrderedList,
  getProjectListSelectedId,
  getProjectListIsFetching,
} from 'client/reducers'
import './index.scss'

class ProjectList extends React.Component {
  constructor(props) {
    super(props)
    this._onItemClick = this._onItemClick.bind(this)
    this._onItemOpen = this._onItemOpen.bind(this)
    this._renderRow = this._renderRow.bind(this)
  }

  _onItemClick(id) {
    this.props.onItemClick(id)
  }

  _onItemOpen(id) {
    this.props.onItemOpen(id)
  }

  _renderRow({ id, slug, name }, index) {
    const { selectedId } = this.props
    return (
      <div
        className="project-list__project-item-container"
        key={id}
      >
        <ProjectItem
          id={id}
          name={name}
          isSelected={id === selectedId}
          onClick={this._onItemClick}
          onOpen={this._onItemOpen}
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
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  selectedId: PropTypes.string,
}

const mapStateToProps = (state) => {
  return ({
    list: getProjectListOrderedList(state),
    selectedId: getProjectListSelectedId(state),
    isFetching: getProjectListIsFetching(state),
  })
}

const mapDispatchToProps = (dispatch) => ({
  onItemClick: (id) => dispatch(setSelection(id)),
  onItemOpen: (id) => dispatch(openProject(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)