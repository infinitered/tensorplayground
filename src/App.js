import React, { useEffect, useCallback } from 'react'
import './App.css'
import * as tf from '@tensorflow/tfjs'
import YouTube from 'react-youtube'
// Awesome button
import ProgressButton from 'react-progress-button'
import '../node_modules/react-progress-button/react-progress-button.css'

// Code editor & styles
import AceEditor from 'react-ace'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/dracula'

// merge state custom hook
import useMergeState from './lib/useMergeState'
// Custom components
import TensorSelector from './components/tensorSelector'
import CodeProfile from './components/codeProfile'
import MemoryStatus from './components/memoryStatus'
import ImageTensorInspector from './components/imageTensorInspector'
import ShareModal from './components/shareModal'
import ModelModal from './components/modelModal'
import InputModal from './components/inputModal'
import RunNav from './components/runNav'
// Input Tensor info etc.
import inputTensors from './data/inputTensors'

const playExplainer = event => {
  const iframe = event.target.getIframe()
  // fullscreen it
  const requestFullScreen =
    iframe.requestFullScreen ||
    iframe.mozRequestFullScreen ||
    iframe.webkitRequestFullScreen
  if (requestFullScreen) {
    requestFullScreen.bind(iframe)()
  }
}

const stopExplainer = () => {
  if (document.fullscreen)
    document.exitFullscreen
      ? document.exitFullscreen()
      : document.msExitFullscreen
      ? document.msExitFullscreen()
      : document.mozCancelFullScreen
      ? document.mozCancelFullScreen()
      : document.webkitExitFullscreen && document.webkitExitFullscreen()
}

function App() {
  const [sandboxSettings, setSandboxSettings] = useMergeState({
    userCode: '',
    currentError: null,
    activeTensor: null,
    displayTensor: null,
    codeProfile: null,
    inputTensorInfo: null,
    activeModel: null,
    activeModelInfo: {},
    shareVisible: false,
    modelVisible: false,
    inputVisible: false
  })

  const sharePlayground = () => {
    const { userCode, inputTensorInfo, activeModelInfo } = sandboxSettings
    let urlParams = new URLSearchParams()
    urlParams.append('code', userCode)
    urlParams.append('inputTensor', inputTensorInfo.id)
    urlParams.append('modelInfo', JSON.stringify(activeModelInfo))
    if (window.history.replaceState) {
      window.history.replaceState(
        'code',
        'Tensor Playground',
        `${window.location.origin}?${urlParams}`
      )
    }
  }

  const runCode = async () => {
    try {
      sharePlayground() // update URL
      const codeProfile = await tf.profile(() => {
        const resultTensor = tf.tidy(() => {
          const userFunc = eval(sandboxSettings.userCode)
          return userFunc(
            sandboxSettings.activeTensor,
            tf,
            sandboxSettings.activeModel
          )
        })
        // Error if sandbox was empty
        if (!resultTensor) {
          tf.disposeVariables()
          throw new Error('Nothing was returned from the sandbox!')
        }
        // dispose current display if not used
        if (
          resultTensor !== sandboxSettings.displayTensor &&
          sandboxSettings.displayTensor !== sandboxSettings.activeTensor
        )
          sandboxSettings.displayTensor &&
            sandboxSettings.displayTensor.dispose()
        setSandboxSettings({ displayTensor: resultTensor, currentError: null })
      })
      setSandboxSettings({ codeProfile })
    } catch (e) {
      setSandboxSettings({ currentError: e.message, displayTensor: null })
    }
  }

  const tensorize = data => {
    const { full: demoImage, channels } = data
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = demoImage
      img.onload = () => {
        // cleanup
        tf.disposeVariables()
        let previousActive = sandboxSettings.activeTensor
        sandboxSettings.displayTensor && sandboxSettings.displayTensor.dispose()
        const tensorImg = tf.browser.fromPixels(img, channels)
        setSandboxSettings({ activeTensor: tensorImg, displayTensor: null })
        if (previousActive) previousActive.dispose()
        resolve(tensorImg.shape)
      }
      img.onerror = () => {
        setSandboxSettings({ currentError: `Unable to load: ${demoImage}` })
        reject()
      }
    })
  }

  const setupSandbox = async (data, settings = {}) => {
    // kickoff tensorization of input
    const inputShape = await tensorize(data)
    const { code, modelInfo, killModel } = settings
    let startCode
    let model = sandboxSettings.activeModel
    let activeModelInfo = modelInfo
      ? modelInfo
      : sandboxSettings.activeModelInfo

    if (killModel) {
      // cleanup
      if (model) tf.dispose(model)
      model = null
      activeModelInfo = {}
    }

    // If we were passed info but no model, load the model
    if (modelInfo) {
      const loadFunction =
        modelInfo.type === 'graph' ? tf.loadGraphModel : tf.loadLayersModel
      // out with the old (if it exists)
      if (model) tf.dispose(model)
      // in with the new
      model = await loadFunction(modelInfo.url, {
        fromTFHub: modelInfo.fromTFHub
      })
    }

    // Handle code setup
    if (code) {
      startCode = code
    } else {
      // Setup code
      startCode = `// TensorPlayground.com
// ${data.desc}
// INPUT TENSOR SHAPE: [${inputShape}]
`

      // If they have a model add that
      if (model) {
        startCode += `// MODEL: ${activeModelInfo.label} ${activeModelInfo.info}

(aTensor, tf, model) => {
  // return tensor to show
  return aTensor
}`
      } else {
        // No model start code
        startCode += `
(aTensor, tf) => {
  // return tensor to show
  return aTensor
}`
      }
      // Clear URL
      if (window.history.replaceState) {
        window.history.replaceState(
          'code',
          'Tensor Playground',
          `${window.location.origin}`
        )
      }
    }

    // store it al!
    setSandboxSettings({
      codeProfile: null,
      userCode: startCode,
      inputTensorInfo: data,
      activeModelInfo: activeModelInfo,
      activeModel: model,
      // close modals
      shareVisible: false,
      modelVisible: false,
      inputVisible: false
    })
  }

  // onload
  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('code') && urlParams.has('inputTensor')) {
      // setup sandbox based on querystring
      const inputID = urlParams.get('inputTensor')
      const modelInfo = JSON.parse(urlParams.get('modelInfo'))
      let localTensor = inputTensors.find(x => x.id === inputID)
      const inputTensorInfo = localTensor || {
        id: inputID,
        full: inputID,
        desc: inputID
      }
      setupSandbox(inputTensorInfo, { code: urlParams.get('code'), modelInfo })
    } else {
      // initialize to first input
      setupSandbox(inputTensors[0])
    }
  }, [])

  // enable shift + enter shortcut (Memoized)
  // moving to useEffect loses access to state from runCode
  document.onkeydown = useCallback(evt => {
    evt = evt || window.event
    if (evt.shiftKey && evt.keyCode === 13) {
      runCode()
      evt.preventDefault()
    }
  })

  const hideAllModals = () => {
    setSandboxSettings({
      shareVisible: false,
      modelVisible: false,
      inputVisible: false
    })
  }

  return (
    <div className="App">
      <header>
        <div className="topBar">
          <div className="leftSide">
            <img
              src="./logo.png"
              className="logo"
              alt="tensorplayground logo"
            />
            <div className="instructions">
              <span>Select your input tensor or</span>
              <ProgressButton
                className="inputTensorBtn"
                onClick={async () => setSandboxSettings({ inputVisible: true })}
              >
                Add URL
              </ProgressButton>
            </div>
            <div className="inputsPicker">
              <TensorSelector
                activeInputTensor={sandboxSettings.inputTensorInfo}
                onSelect={setupSandbox}
                inputTensors={inputTensors}
              />
            </div>
          </div>
          <div className="rightSide">
            <div className="explainerVideo">
              <YouTube
                videoId="hdAX6ORhihA"
                onPlay={playExplainer}
                onEnd={stopExplainer}
                onPause={stopExplainer}
                opts={{
                  height: 115,
                  width: 200,
                  playerVars:
                    // https://developers.google.com/youtube/player_parameters
                    { modestbranding: 1, rel: 0, fs: 0 }
                }}
              />
              <span>What is TensorPlayground?</span>
            </div>
          </div>
        </div>
        <RunNav
          run={runCode}
          reset={() => {
            setupSandbox(sandboxSettings.inputTensorInfo, { killModel: true })
          }}
          share={() => {
            sharePlayground()
            setSandboxSettings({ shareVisible: true })
          }}
          load={() => setSandboxSettings({ modelVisible: true })}
        />
      </header>
      <main>
        <div className="codeContainer">
          <div className="userCode">
            <AceEditor
              placeholder="Code goes here"
              mode="javascript"
              theme="dracula"
              name="codeBlock"
              // Memoize the callback for efficiency
              onChange={useCallback(code =>
                setSandboxSettings({ userCode: code })
              )}
              fontSize={14}
              width="100%"
              height="100%"
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={sandboxSettings.userCode}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false
              }}
            />
          </div>
          <div className="errorBox">
            <p className="errorMessage">{sandboxSettings.currentError}</p>
          </div>
          <CodeProfile profile={sandboxSettings.codeProfile} />
        </div>
        <div className="resultContainer">
          <ImageTensorInspector tensor={sandboxSettings.displayTensor} />
        </div>
      </main>
      <footer>
        <MemoryStatus />
      </footer>
      <ShareModal
        isOpen={sandboxSettings.shareVisible}
        hideModal={hideAllModals}
      />
      <ModelModal
        key="ModelModal"
        isOpen={sandboxSettings.modelVisible}
        hideModal={hideAllModals}
        onModelLoad={info => {
          setupSandbox(sandboxSettings.inputTensorInfo, {
            modelInfo: info
          })
        }}
      />
      <InputModal
        isOpen={sandboxSettings.inputVisible}
        hideModal={hideAllModals}
        setInput={url => setupSandbox({ id: url, full: url, desc: url })}
      />
    </div>
  )
}

export default App
