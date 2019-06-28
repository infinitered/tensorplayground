import React, {useState} from 'react'
// modals
import Modal from 'react-modal'
// dropdown
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
// Awesome button
import ProgressButton from 'react-progress-button'
import '../../node_modules/react-progress-button/react-progress-button.css'

const options = [
  {
    value: 'customurl', label: 'Custom URL', className: 'customURL', info: 'Custom URL'
  },
  {
   type: 'group', name: 'TF Hub Models', items: [
     { value: 'mobilenetv2', label: 'Mobilenet v2', info: 'Expects [batch, 224, 224, 3] input' },
     { value: 'inceptionv3', label: 'Inception v3', info: 'Expects [batch, 299, 200, 3] input' },
     { value: 'resnetv2', label: 'Resnet v2', info: 'Expects [batch, 224, 224, 3] input' }
   ]
  },
  {
   type: 'group', name: 'Community Models', items: [
     { value: 'face', label: 'Face Detection', info: 'Expects [batch, 224, 224, 3] input' },
     { value: 'nsfwjs', label: 'NSFWJS', info: 'Expects [batch, 224, 224, 3] input' }
   ]
  }
]

export default props => {
  const [currentModel, setCurrentModel] = useState({})

  const getFullInfo = mKey => {
    const choices = options.map(x => x.value ? x : null || (x.items && x.items.map(y => y.value ? y : null))).flat()
    return choices.find(x => x.value === mKey)    
  }

  const dropdownChange = ({value}) => {
    const selected = getFullInfo(value)
    setCurrentModel(selected)
  }

  const ShareRow = props => {
    if (props.isOpen) {
      return (
        <div className="modalTop">
          <div className="leftSide fullSize">
            <Dropdown
              className="fullSize"
              placeholder="Select a Model"
              options={options}
              onChange={dropdownChange}
              value={currentModel.value}
            />
          </div>
          <div className="modalClose">

            <ProgressButton
                className='modalProgressButton'
                onClick={async () => {
                  // load model

                  // close
                  props.hideModal()
                }}
              >
                Load
              </ProgressButton>            
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

  return (
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
      <div>
        {currentModel.info}
      </div>
    </Modal>
  )
}
