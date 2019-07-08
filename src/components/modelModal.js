import React, { useState, useCallback } from 'react'
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
    value: 'customurl',
    label: 'Custom URL',
    className: 'customURL',
    fromTFHub: false
  },
  {
    type: 'group',
    name: 'TF Hub Models',
    items: [
      {
        value: 'mobilenetv2',
        label: 'Mobilenet v2',
        info: 'Expects [batch, 224, 224, 3]',
        link: 'https://arxiv.org/abs/1801.04381',
        url:
          'https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2',
        fromTFHub: true,
        type: 'graph'
      },
      {
        value: 'inceptionv3',
        label: 'Inception v3',
        info: 'Expects [batch, 299, 200, 3]',
        link: 'http://arxiv.org/abs/1512.00567',
        url: 'https://tfhub.dev/google/imagenet/inception_v3/classification/1',
        fromTFHub: true,
        type: 'graph'
      },
      {
        value: 'resnetv2',
        label: 'Resnet v2',
        info: 'Expects [batch, 224, 224, 3]',
        link: 'https://arxiv.org/abs/1603.05027',
        url: 'https://tfhub.dev/google/imagenet/resnet_v2_50/classification/1',
        fromTFHub: true,
        type: 'graph'
      }
    ]
  },
  {
    type: 'group',
    name: 'Community Models',
    items: [
      {
        value: 'nsfwjs',
        label: 'NSFWJS',
        info: 'Expects [batch, 224, 224, 3]',
        link: 'https://github.com/GantMan/nsfw_model',
        url:
          'https://s3.amazonaws.com/ir_public/nsfwjscdn/TFJS_nsfw_mobilenet/tfjs_quant_nsfw_mobilenet/model.json',
        fromTFHub: false,
        type: 'layers'
      }
    ]
  }
]

const getFullInfo = mKey => {
  const choices = options
    .map(x =>
      x.value ? x : null || (x.items && x.items.map(y => (y.value ? y : null)))
    )
    .flat()
  return choices.find(x => x.value === mKey)
}

const URLInput = props => {
  if (props.show) {
    return (
      <div className="modalTop" key="urlInputDiv">
        <p className="modeLabel">URL:</p>
        <input
          type="text"
          name="modelURLInput"
          key="modelURLInput"
          id="modelInput"
          value={props.modelURL}
          onChange={props.urlCallback}
        />
      </div>
    )
  } else {
    return <div />
  }
}

export default props => {
  const [currentModel, setCurrentModel] = useState({})
  const [modelURL, setModelURL] = useState('')

  const dropdownChange = ({ value }) => {
    const selected = getFullInfo(value)
    setCurrentModel(selected)
  }

  const urlCallback = useCallback(({ target }) => {
    setModelURL(target.value)
    let selected = getFullInfo('customurl')
    selected.url = target.value
    selected.info = target.value
    setCurrentModel(selected)
  })

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
              className="modalProgressButton"
              onClick={async () => {
                await props.onModelLoad(currentModel)
              }}
              onSuccess={props.hideModal}
              onError={e => window.alert(e.message)}
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
      key="modelModalInner"
      isOpen={props.isOpen}
      onRequestClose={props.hideModal}
      shouldCloseOnOverlayClick={false}
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
      <URLInput
        key="urlInputComponent"
        show={currentModel.value === 'customurl'}
        modelURL={modelURL}
        urlCallback={urlCallback}
      />
      <div>
        <a href={currentModel.link} target="_blank">
          {currentModel.link}
        </a>
      </div>
    </Modal>
  )
}
