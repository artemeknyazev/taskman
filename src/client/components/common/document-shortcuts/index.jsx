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
    // HACK: shortcuts should be explicitly allowed on nodes with text editing
    // NOTE: there's also a contentEditable property allowing to edit any node's content
    // FIXME: use a more general approach later
    const isEditableTarget = ["INPUT", "TEXTAREA"].includes(event.target.tagName)

    // NOTE: prevents default scroll behavior because virtualized lists scroll and rerender too
    // FIXME: Ctrl+Arrow on editable targets results in scroll too!
    if (!isEditableTarget && this.props.isPreventKeyboardScroll)
      if ([ "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight" ].includes(event.key))
        event.preventDefault();

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
      this.processShortcut(event.type, event.key, isEditableTarget)
  }

  processShortcut(type, key, isEditableTarget) {
    for (let shortcut of this.props.shortcuts)
      if (
        type === shortcut.type &&
        (isEditableTarget ? shortcut.allowOnEditableTarget : true) &&
        shortcut.check(key, this.state)
      )
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
  isPreventKeyboardScroll: false,
}

DocumentShortcuts.propTypes = {
  shortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([ 'keydown', 'keyup' ]).isRequired,
      check: PropTypes.func.isRequired,
      callback: PropTypes.func.isRequired,
    }).isRequired
  ),
  dispatch: PropTypes.func,
  isPreventKeyboardScroll: PropTypes.bool,
}

export default DocumentShortcuts
