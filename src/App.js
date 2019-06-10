import React from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header>
        <div className="topBar">
          <div className="leftSide">
            <img src="" className="logo" />
            <div className="instructions">select input</div>
            <div className="inputsPicker">inputs picker</div>
          </div>
          <div className="rightSide">
            <div className="explainerVideo">Explainer video</div>
          </div>
        </div>
        <nav>
          <div className="leftSide">Runner Buttons</div>
          <div className="rightSide">Learn more link</div>
        </nav>
      </header>
      <main>
        <div className="codeContainer">Code goes in here</div>
        <div className="resultContainer">Result goes here</div>
      </main>
      <footer>Browser Tensor Memory</footer>
    </div>
  )
}

export default App
