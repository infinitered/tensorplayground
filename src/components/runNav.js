import React from 'react'
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faAlignLeft,
  faExternalLinkAlt,
  faLayerGroup,
  faCodeBranch,
  faFileCode
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
// Get TF Version
const packageInfo = require('../../package.json')
const tfVersion = packageInfo.dependencies['@tensorflow/tfjs'].replace(
  /([^.|\d])/g,
  ''
)

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
      <FontAwesomeIcon icon={faFileCode} />{' '}
      <a
        className="navLink"
        href={`https://js.tensorflow.org/api/${tfVersion}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        TensorFlow.js Docs
      </a>
      <FontAwesomeIcon icon={faGithub} />{' '}
      <a
        className="navLink"
        href="https://github.com/infinitered/tensorplayground"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
      <FontAwesomeIcon icon={faCodeBranch} />{' '}
      <a
        className="navLink"
        href="https://infinite.red/machinelearning"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn
      </a>
    </div>
  </nav>
)
