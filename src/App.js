import React, { useEffect } from 'react'
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
// Custom components
import TensorSelector from './components/tensorSelector'
import CodeProfile from './components/codeProfile'
import MemoryStatus from './components/memoryStatus'
// Input Tensor info etc.
import inputTensors, { startCode, startModelCode } from './data/inputTensors'

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

  const runCode = async () => {
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
        const tensorImg = tf.browser.fromPixels(img, channels)
        setSandboxSettings({ activeTensor: tensorImg })
        resolve(tensorImg.shape)
      }
      img.onerror = reject
    })
  }

  const setupSandbox = async data => {
    // cleanup
    tf.disposeVariables()
    sandboxSettings.activeTensor && sandboxSettings.activeTensor.dispose()
    sandboxSettings.displayTensor && sandboxSettings.displayTensor.dispose()
    // kickoff tensorization of input
    const inputShape = await tensorize(data)
    // store it al!
    setSandboxSettings({
      displayTensor: null,
      codeProfile: null,
      userCode: `// TensorPlayground.com
// INPUT TENSOR SHAPE: ${data.desc} [${inputShape}]

(aTensor, tf) => {
  // return tensor to show
  return aTensor
}`,
      inputTensorInfo: data
    })
  }

  useEffect(() => {
    // initialize to first input
    setupSandbox(inputTensors[0])
  }, [])

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
        <nav>
          <div className="leftSide">
            <button className="navButton" id="run" onClick={runCode}>
              <FontAwesomeIcon icon={faPlay} /> Run
            </button>
            <button
              className="navButton"
              id="reset"
              onClick={() => window.alert('reset')}
            >
              <FontAwesomeIcon icon={faAlignLeft} /> Reset
            </button>
            <button
              className="navButton"
              id="share"
              onClick={() => window.alert('share')}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Share
            </button>
            <button
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
              onChange={code => setSandboxSettings({ userCode: code })}
              fontSize={14}
              width="100%"
              height="100%"
              showPrintMargin={true}
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
        <div className="resultContainer">Result goes here</div>
      </main>
      <footer>
        <MemoryStatus />
      </footer>
    </div>
  )
}

export default App
