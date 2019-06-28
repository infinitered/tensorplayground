import React from 'react'
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faAlignLeft,
  faExternalLinkAlt,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'

export default props => (
  <nav id="runNav">
    <div className="leftSide">
      <button
        title="Run Code (shift + enter)"
        className="navButton"
        id="run"
        onClick={props.run}
      >
        <FontAwesomeIcon icon={faPlay} /> Run
      </button>
      <button
        title="Reset Code"
        className="navButton"
        id="reset"
        onClick={props.reset}
      >
        <FontAwesomeIcon icon={faAlignLeft} /> Reset
      </button>
      <button
        title="Share this playground"
        className="navButton"
        id="share"
        onClick={props.share}
      >
        <FontAwesomeIcon icon={faExternalLinkAlt} /> Share
      </button>
      <button
        title="Load an external model"
        className="navButton"
        id="load"
        onClick={props.load}
      >
        <FontAwesomeIcon icon={faLayerGroup} /> Load Model
      </button>
    </div>
    <div className="rightSide">
      <a href="#" id="learnLink">
        Learn Machine Learning
      </a>
    </div>
  </nav>
)
