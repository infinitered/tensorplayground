import React from 'react'
// modals
import Modal from 'react-modal'

const ShareRow = props => {
  if (props.isOpen) {
    return (
      <div className="modalTop">
        <div className="leftSide">
          <input
            type="text"
            value={window.location.href}
            class="shareBox"
            readonly
          />
        </div>
        <div className="modalClose">
          <button
            className="modalButton"
            onClick={() => {
              props.hideModal()
            }}
          >
            copy
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
        <h1>Load Model:</h1>
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
