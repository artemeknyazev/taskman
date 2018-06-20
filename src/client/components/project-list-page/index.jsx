import React from 'react'
import { connect } from 'react-redux'

import { clearSelection } from 'client/reducers/project-list'
import shortcuts from './shortcuts'
import DocumentShortcuts from 'client/components/common/document-shortcuts'
import ProjectList from './project-list'

class ProjectListPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this._clearSelection = this._clearSelection.bind(this)
  }

  _clearSelection() {
    this.props.dispatch(clearSelection())
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
      >
        <ProjectList />
      </DocumentShortcuts>
    )
  }
}

export default connect()(ProjectListPage)