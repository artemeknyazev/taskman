import React from 'react'
import { connect } from 'react-redux'

import { clearSelectionInCurrentProject } from 'client/reducers/task-list'
import shortcuts from './shortcuts'
import DocumentShortcuts from 'client/components/common/document-shortcuts'
import NavigationMenu from 'client/components/common/navigation-menu'
import * as Root from 'client/reducers'
import TaskList from './task-list'

class ProjectTaskListPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this._clearSelection = this._clearSelection.bind(this)
  }

  _clearSelection() {
    this.props.dispatch(clearSelectionInCurrentProject())
  }

  componentDidMount() {
    window.addEventListener('mousedown', this._clearSelection)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this._clearSelection)
  }

  render() {
    const { projectSlug, projectName } = this.props
    return (
      <DocumentShortcuts
        shortcuts={shortcuts}
        isPreventKeyboardScroll={true}
        dispatch={this.props.dispatch}
      >
        <NavigationMenu
          links={[
            {
              path: '/',
              title: 'Home',
            }, {
              path: '/projects',
              title: 'Projects',
            }, {
              path: `/projects/${projectSlug}`,
              title: projectName,
            }, {
              path: `/projects/${projectSlug}/tasks`,
              title: 'Tasks',
            }
          ]}
        />
        <TaskList />
      </DocumentShortcuts>
    )
  }
}

const mapStateToProps = (state) => ({
  projectSlug: Root.getCurrentProjectSlug(state),
  projectName: Root.getCurrentProjectName(state),
})

export default connect(mapStateToProps)(ProjectTaskListPage)