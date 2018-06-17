import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from 'client/components/common/button'

import './index.scss'

const FaButton = ({
  className = "",
  onClick = null,
  icon = "",
  tooltip = "",
}) => 
  <Button
    className={'fa-button ' + (className ? className : '')}
    tooltip={tooltip}
    onClick={(ev) => onClick && onClick(ev)}
  >
    <FontAwesomeIcon icon={icon} />
  </Button>

FaButton.displayName = 'FaButton'

FaButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  tooltip: PropTypes.string,
}

export default FaButton