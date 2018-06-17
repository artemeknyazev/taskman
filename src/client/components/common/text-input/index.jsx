import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const TextInput = ({
  inputRef = null,
  className = '',
  ...props
}) => (
  <span className={'text-input ' + (className ? className : '')}>
    <input
      {...props}
      type="text"
      ref={inputRef}
      className="text-input__input"
    />
  </span>
)

TextInput.propTypes = {
  className: PropTypes.string,
  ref: PropTypes.object,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
}

TextInput.displayName = 'TextInput'

export default TextInput