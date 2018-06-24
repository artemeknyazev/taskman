import React from 'react'
import { connect } from 'react-redux'

import { clearSelection } from 'client/reducers/project-list'
import shortcuts from './shortcuts'
import DocumentShortcuts from 'client/components/common/document-shortcuts'
import NavigationMenu from 'client/components/common/navigation-menu'
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
            }
          ]}
        />
        <ProjectList />
      </DocumentShortcuts>
    )
  }
}

export default connect()(ProjectListPage)