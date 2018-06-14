import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const Button = ({
  className = "",
  onClick,
  children,
}) =>
  <button
    className={"button " + className}
    onClick={(ev) => onClick && onClick(ev)}
  >
    <span className="button__text">{children}</span>
  </button>

Button.displayName = 'Button'

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default Button