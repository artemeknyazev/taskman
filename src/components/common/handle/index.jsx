import * as React from 'react'

import './index.scss'

const Handle = ({ className = '' }) =>
  <div className={'handle ' + className}>
    <svg className="handle__draggable" viewBox="0 0 32 32">
      <rect x="4" y="4" width="4" height="4"></rect>
      <rect x="4" y="12" width="4" height="4"></rect>
      <rect x="4" y="20" width="4" height="4"></rect>
      <rect x="4" y="28" width="4" height="4"></rect>
      <rect x="12" y="4" width="4" height="4"></rect>
      <rect x="12" y="12" width="4" height="4"></rect>
      <rect x="12" y="20" width="4" height="4"></rect>
      <rect x="12" y="28" width="4" height="4"></rect>
      <rect x="20" y="4" width="4" height="4"></rect>
      <rect x="20" y="12" width="4" height="4"></rect>
      <rect x="20" y="20" width="4" height="4"></rect>
      <rect x="20" y="28" width="4" height="4"></rect>
      <rect x="28" y="4" width="4" height="4"></rect>
      <rect x="28" y="12" width="4" height="4"></rect>
      <rect x="28" y="20" width="4" height="4"></rect>
      <rect x="28" y="28" width="4" height="4"></rect>
    </svg>
  </div>

export default Handle
