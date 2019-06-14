import React from 'react'
import { useState } from 'react'
import './App.css'
import YouTube from 'react-youtube'
// Awesome button
import ProgressButton from 'react-progress-button'
import '../node_modules/react-progress-button/react-progress-button.css'
// Custom components
import TensorSelector from './components/tensorSelector'
// Input tensors
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
  const [currentTensor, setCurrentTensor] = useState(inputTensors[0])
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
                activeInputTensor={currentTensor}
                onSelect={setCurrentTensor}
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
          <div className="leftSide">Runner Buttons</div>
          <div className="rightSide">
            <a href="#" id="learnLink">
              Learn Machine Learning
            </a>
          </div>
        </nav>
      </header>
      <main>
        <div className="codeContainer">Code goes in here</div>
        <div className="resultContainer">Result goes here</div>
      </main>
      <footer>Browser Tensor Memory Footer</footer>
    </div>
  )
}

export default App
