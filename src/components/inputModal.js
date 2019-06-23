import React from 'react'
// modals
import Modal from 'react-modal'

const ShareRow = props => {
  if (props.isOpen) {
    return (
      <div className="modalTop">
        <div className="leftSide">
          <input type="text" class="shareBox" />
        </div>
        <div className="modalClose">
          <button
            className="copyButton"
            onClick={() => {
              props.setInput('https://i.imgur.com/PieUY1f.jpg')
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
