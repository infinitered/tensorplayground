import React, { useState } from 'react'
// modals
import Modal from 'react-modal'

// example: https://i.imgur.com/PieUY1f.jpg
const isValidUrl = string => {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  )
  return res !== null
}

const ShareRow = props => {
  const [inputURL, setInputURL] = useState('')
  const [urlValid, setURLValid] = useState(false)
  if (props.isOpen) {
    return (
      <div className="modalTop">
        <div className="leftSide">
          <input
            type="text"
            class="shareBox"
            value={inputURL}
            onChange={({ target }) => {
              setInputURL(target.value)
              setURLValid(isValidUrl(target.value))
            }}
          />
        </div>
        <div className="modalClose">
          <button
            disabled={!urlValid}
            className="modalButton"
            onClick={() => {
              props.setInput(inputURL)
              props.hideModal()
            }}
          >
            use
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <center>
        <h1>
          <span role="img" aria-label="done">
            👍
          </span>
        </h1>
      </center>
    )
  }
}

export default props => (
  <Modal
    isOpen={props.isOpen}
    onRequestClose={props.hideModal}
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEscape={true}
    closeTimeoutMS={750}
    className="modal"
    overlayClassName="overlay"
    contentLabel="share modal"
  >
    <div className="modalTop">
      <div className="leftSide">
        <h1>Input Tensor URL:</h1>
      </div>
      <div className="modalClose">
        <button className="navButton" onClick={props.hideModal}>
          🅧
        </button>
      </div>
    </div>
    <ShareRow {...props} />
  </Modal>
)
