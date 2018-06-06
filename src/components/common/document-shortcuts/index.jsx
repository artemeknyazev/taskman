import React from 'react'
import PropTypes from 'prop-types'

class DocumentShortcuts extends React.Component {
  constructor(props) {
    super(props)
    this.state = { alt: false, control: false, meta: false, shift: false }
    this.processEvent = this.processEvent.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.processEvent)
    document.addEventListener('keyup', this.processEvent)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.processEvent)
    document.removeEventListener('keyup', this.processEvent)
  }

  processEvent(event) {
    // todo: either preventDefault in inputs, or check if event.target is a writable DOM node (input, textarea)
    const enabled = event.type === 'keydown'
    if (event.key === 'Alt')
      this.setState({ alt: enabled })
    else if (event.key === 'Control')
      this.setState({ control: enabled })
    else if (event.key === 'Meta')
      this.setState({ meta: enabled })
    else if (event.key === 'Shift')
      this.setState({ shift: enabled })
    else if (this.props.shortcuts && this.props.shortcuts.length)
      this.processShortcut(event)
  }

  processShortcut(event) {
    for (let shortcut of this.props.shortcuts)
      if (event.type === shortcut.type && shortcut.check(event, this.state))
        return shortcut.callback(this.props.dispatch)
  }

  render() {
    return this.props.children
  }
}

DocumentShortcuts.displayName = 'DocumentShortcuts'

DocumentShortcuts.defaultProps = {
  shortcuts: [],
  dispatch: () => undefined,
}

DocumentShortcuts.propTypes = {
  shortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([ 'keydown', 'keyup' ]).isRequired,
      check: PropTypes.func.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  dispatch: PropTypes.func,
}

export default DocumentShortcuts
