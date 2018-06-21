import React from 'react'
import { connect } from 'react-redux'

import { clearSelectionInCurrentProject } from 'client/reducers/task-list'
import shortcuts from './shortcuts'
import DocumentShortcuts from 'client/components/common/document-shortcuts'
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
    return (
      <DocumentShortcuts
        shortcuts={shortcuts}
        isPreventKeyboardScroll={true}
        dispatch={this.props.dispatch}
      >
        <TaskList />
      </DocumentShortcuts>
    )
  }
}

export default connect()(ProjectTaskListPage)