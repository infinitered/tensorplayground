import React from 'react'
import ImageTensorInspector from './imageTensorInspector'
import * as stringify from 'json-stringify-safe'
import * as tf from '@tensorflow/tfjs'
import SimpleChart from './simpleChart'

const charterize = plotData => {
  let plotReady
  // If Nx2 it's plotable
  if (plotData.shape[1] === 2) {
    plotReady = []
    const synced = plotData.dataSync()
    for (let i = 0; i < plotData.size; i += 2) {
      plotReady.push({
        x: synced[i],
        y: synced[i + 1]
      })
    }
  } else if (plotData.shape[0] === 2) {
    plotReady = []
    const synced = plotData.dataSync()
    const jumpSize = plotData.shape[1]
    for (let i = 0; i < jumpSize; i++) {
      plotReady.push({
        x: synced[i],
        y: synced[i + jumpSize]
      })
    }
  }
  if (plotReady) {
    return <SimpleChart chartData={plotReady} />
  }
}

const toType = (obj) => ({}).toString.call(obj).match(/\s(\w+)/)[1]

export default props => {
  const { tensor } = props
  if (!tensor) {
    return null
  } else if (tensor.rankType === '0') {
    return (
      <div className="tensorResultSection">
        <h3>Rank 0 Scalar</h3>
        <pre>{tensor.toString()}</pre>
      </div>
    )    
  } else if (tensor.rankType === '1') {
    return (
      <div className="tensorResultSection">
        <h3>Rank 1 Tensor</h3>
        <pre>{tensor.toString()}</pre>
      </div>
    )
  } else if (tensor.rankType === '2') {
    return (
      <div className="tensorResultSection">
        <h3>Rank 2 Tensor</h3>
        <pre>{tensor.toString()}</pre>
        {charterize(tensor)}
      </div>
    )
  } else if (tensor.rankType === '3') {
    return <ImageTensorInspector tensor={tensor} />
  } else if (tensor.rankType === '4') {
    return (
      <div>
        <h3 style={{ paddingLeft: 10 }}>
          {tensor.shape[0]} images in a 4D Tensor
        </h3>
        {tf.unstack(tensor).map(t => (
          <ImageTensorInspector tensor={t} selfDestruct />
        ))}
      </div>
    )
  } else {
    return (
      <div className="tensorResultSection">
        <h3>{toType(tensor)}</h3>
        <pre>{stringify(tensor, null, 2)}</pre>
      </div>
    )
  }
}
