import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

const NotFoundPage = () => (
  <div className="not-found-page app-page">
    <span className="not-found__text">
      Sorry, can't find what you are looking for. Start from the <Link to="/">main page?</Link>
    </span>
  </div>
)

export default NotFoundPage