import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'

import store from 'store'
import shortcuts from './shortcuts'
import DocumentShortcuts from 'components/common/document-shortcuts'
import TaskList from 'components/task-list'

import './index.scss'

const AppDocumentShortcuts = connect()(DocumentShortcuts)
window.onload = () => {
  render(
    <Provider store={store}>
      <AppDocumentShortcuts shortcuts={shortcuts}>
        <TaskList defaultHeight={100} defaultWidth={500}/>
      </AppDocumentShortcuts>
    </Provider>,
    document.getElementById('root')
  )
}

// prevent default scroll behavior because virtualized list
// scrolls and rerenders too
window.addEventListener('keydown', (e) => {
  if ([32, 37, 38, 39, 40].includes(e.keyCode))
    e.preventDefault();
});