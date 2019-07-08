import React from 'react'
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faAlignLeft,
  faExternalLinkAlt,
  faLayerGroup,
  faCodeBranch,
  faFileCode,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'

export default props => (
  <button
    title="Clear Console"
    style={{ float: 'right' }}
    className="navButton"
    id="clearConsole"
    onClick={props.clear}
  >
    <FontAwesomeIcon icon={faTrashAlt} /> Clear Console
  </button>
)
