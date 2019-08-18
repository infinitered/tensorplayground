import React from 'react'
import ImageTensorInspector from './imageTensorInspector'
import * as tf from '@tensorflow/tfjs'

export default props => {
  const { tensor } = props
  if (!tensor) {
    return null
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
        <p>We're not sure how to display the returned value.</p>
      </div>
    )
  }
}
