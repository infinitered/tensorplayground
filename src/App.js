import React from 'react'
import './App.css'
import YouTube from 'react-youtube'

const playExplainer = (event) => {
  const iframe = event.target.getIframe()
  // fullscreen it
  const requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen
  if (requestFullScreen) {
    requestFullScreen.bind(iframe)();
  }  
}

const stopExplainer = () => {
  if (document.fullscreen)
    document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()
}

function App() {
  return (
    <div className="App">
      <header>
        <div className="topBar">
          <div className="leftSide">
            <img src="./logo.png" className="logo" alt="tensorplayground logo" />
            <div className="instructions">Select your input tensor or</div>
            <div className="inputsPicker">inputs picker</div>
          </div>
          <div className="rightSide">
            <div className="explainerVideo">
              <YouTube
                videoId="hdAX6ORhihA"
                onPlay={playExplainer}
                onEnd={stopExplainer}
                onPause={stopExplainer}
                opts={{ 
                  height: 100,
                  width: 200,
                  playerVars: 
                    // https://developers.google.com/youtube/player_parameters
                    { modestbranding: 1, rel: 0, fs: 0 } }}
              />
            </div>
          </div>
        </div>
        <nav>
          <div className="leftSide">Runner Buttons</div>
          <div className="rightSide">
            <a href="#" id="learnLink">Learn Machine Learning</a>
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
