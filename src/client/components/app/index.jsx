import React from 'react'
import { Provider, connect } from 'react-redux'

import shortcuts from './shortcuts'
import DocumentShortcuts from 'components/common/document-shortcuts'
import TaskList from 'components/task-list'

import './index.scss'

const AppDocumentShortcuts = connect()(DocumentShortcuts)
const App = () => (
  <AppDocumentShortcuts
    shortcuts={shortcuts}
    isPreventKeyboardScroll={true}
  >
    <TaskList
      defaultHeight={100}
      defaultWidth={500}
    />
  </AppDocumentShortcuts>
)

export default App