import React, { useState, useEffect } from 'react'
// modals
import Modal from 'react-modal'
import copyToClipboard from '../lib/copyToClipboard'
import { BitlyClient } from 'bitly'

const bitly = new BitlyClient(process.env.REACT_APP_BITLY_TOKEN, {})

const ShareRow = props => {
  const [shareLink, setShareLink] = useState(window.location.href)

  // onload
  useEffect(() => {
    const generateLink = async () => {
      const shortLink = await bitly.shorten(window.location.href)
      setShareLink(shortLink.url)
    }
    generateLink()
  }, [])

  if (props.isOpen) {
    return (
      <div className="modalTop">
        <div className="leftSide">
          <input type="text" value={shareLink} className="shareBox" readOnly />
        </div>
        <div className="modalClose">
          <button
            className="modalButton"
            onClick={() => {
              try {
                copyToClipboard(shareLink)
              } catch (e) {
                throw e
              }
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
        <h1>Share Link:</h1>
      </div>
      <div className="modalClose">
        <button className="navButton" onClick={props.hideModal}>
          🅧
        </button>
      </div>
    </div>
    <ShareRow {...props} link={'loading'} />
  </Modal>
)
