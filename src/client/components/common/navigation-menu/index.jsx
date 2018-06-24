import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaButton from 'client/components/common/fa-button'
import Button from 'client/components/common/button'

import './index.scss'

class NavigationMenu extends React.Component {
  constructor(props) {
    super(props)
    this._navigateBack = this._navigateBack.bind(this)
    this._navigateTo = this._navigateTo.bind(this)
  }

  _navigateBack() {
    const { links } = this.props
    if (links.length > 1)
      this._navigateTo(links[links.length - 2].path)
  }

  _navigateTo(path) {
    this.props.navigateTo(path)
  }

  _renderItem({ path, title }, index, links) {
    return [(
      <Button
        key={path}
        className="navigation-menu__link-list-element navigation-menu__link"
        tooltip={'Navigate to ' + title}
        onClick={(ev) => (ev.stopPropagation(), this._navigateTo(path))}
      >
        {title}
      </Button>
    ), (
      index === links.length - 1 ? null : (
        <FontAwesomeIcon
          className="navigation-menu__link-list-element navigation-menu__list-separator"
          key={path + '-separator'}
          icon="chevron-right"
        />
      )
    )]
  }

  render() {
    const { links } = this.props
    return (
      <div className="navigation-menu">
        <div
          className={cx({
            'navigation-menu__back-container': true,
            'navigation-menu__back-container--invisible': links.length < 2,
          })}
        >
          <FaButton
            className="navigation-menu__back"
            icon="arrow-left"
            onClick={this._navigateBack}
          />
        </div>
        <div className="navigation-menu__links-container">
          {links.map((link, index, links) => (
            this._renderItem(link, index, links)
          ))}
        </div>
      </div>
    )
  }
}

NavigationMenu.displayName = 'NavigationMenu'

NavigationMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired).isRequired
}

const mapDispatchToProps = (dispatch) => ({
  navigateTo: (path) => dispatch(push(path)),
})

export default connect(null, mapDispatchToProps)(NavigationMenu)