import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'

import './index.scss'

const Button = ({
  className = "",
  onClick = null,
  tooltip = "",
  children,
}) => {
  let elem = (
    <button
      className={"button " + className}
      onClick={(ev) => onClick && onClick(ev)}
    >
      <span className="button__text">{children}</span>
    </button>
  )
  return tooltip ? (
    <Tooltip
      placement="top"
      trigger={[ 'hover' ]}
      overlay={tooltip}
    >
      {elem}
    </Tooltip>
  ) : (
    elem
  )
}

Button.displayName = 'Button'

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
}

export default Button