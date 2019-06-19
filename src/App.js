import React, { useEffect, useCallback } from 'react'
import './App.css'
import * as tf from '@tensorflow/tfjs'
import YouTube from 'react-youtube'
// Awesome button
import ProgressButton from 'react-progress-button'
import '../node_modules/react-progress-button/react-progress-button.css'
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faAlignLeft,
  faExternalLinkAlt,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
// Code editor & styles
import AceEditor from 'react-ace'
import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/dracula'
// merge state custom hook
import useMergeState from './lib/useMergeState'
import copyToClipboard from './lib/copyToClipboard'
// Custom components
import TensorSelector from './components/tensorSelector'
import CodeProfile from './components/codeProfile'
import MemoryStatus from './components/memoryStatus'
import ImageTensorInspector from './components/imageTensorInspector'
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
    inputTensorInfo: null
  })

  const sharePlayground = () => {
    const { userCode, inputTensorInfo } = sandboxSettings
    let urlParams = new URLSearchParams()
    urlParams.append('code', userCode)
    urlParams.append('inputTensor', inputTensorInfo.id)
    if (window.history.replaceState) {
      window.history.replaceState(
        'code',
        'Tensor Playground',
        `${window.location.origin}?${urlParams}`
      )
    }
  }

  const runCode = async () => {
    sharePlayground() // update URL
    const codeProfile = await tf.profile(() => {
      const resultTensor = tf.tidy(() => {
        const userFunc = eval(sandboxSettings.userCode)
        return userFunc(sandboxSettings.activeTensor, tf)
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
        sandboxSettings.displayTensor && sandboxSettings.displayTensor.dispose()
      setSandboxSettings({ displayTensor: resultTensor, currentError: null })
    })
    setSandboxSettings({ codeProfile })
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
      img.onerror = reject
    })
  }

  const setupSandbox = async (data, code) => {
    // kickoff tensorization of input
    const inputShape = await tensorize(data)
    let startCode
    if (code) {
      startCode = code
    } else {
      // Setup code
      startCode = `// TensorPlayground.com
// INPUT TENSOR SHAPE: ${data.desc} [${inputShape}]

(aTensor, tf) => {
  // return tensor to show
  return aTensor
}`
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
      inputTensorInfo: data
    })
  }

  // onload
  useEffect(async () => {
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('code') && urlParams.has('inputTensor')) {
      // setup sandbox based on querystring
      const inputID = urlParams.get('inputTensor')
      const inputTensorInfo = inputTensors.find(x => x.id === inputID)
      await setupSandbox(inputTensorInfo, urlParams.get('code'))
    } else {
      // initialize to first input
      await setupSandbox(inputTensors[0])
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
              <ProgressButton className="inputTensorBtn">
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
        <nav id="runNav">
          <div className="leftSide">
            <button
              title="Run Code (shift + enter)"
              className="navButton"
              id="run"
              onClick={runCode}
            >
              <FontAwesomeIcon icon={faPlay} /> Run
            </button>
            <button
              title="Reset Code"
              className="navButton"
              id="reset"
              onClick={() => setupSandbox(sandboxSettings.inputTensorInfo)}
            >
              <FontAwesomeIcon icon={faAlignLeft} /> Reset
            </button>
            <button
              title="Share this playground"
              className="navButton"
              id="share"
              onClick={() => {
                sharePlayground()
                copyToClipboard(window.location.href)
                window.alert('Copied to Clipboard')
              }}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Share
            </button>
            <button
              title="Load an external model"
              className="navButton"
              id="load"
              onClick={() => window.alert('load')}
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
          <CodeProfile profile={sandboxSettings.codeProfile} />
        </div>
        <div className="resultContainer">
          <ImageTensorInspector tensor={sandboxSettings.displayTensor} />
        </div>
      </main>
      <footer>
        <MemoryStatus />
      </footer>
    </div>
  )
}

export default App
