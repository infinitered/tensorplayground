import React from 'react'
import ImageTensorInspector from './imageTensorInspector'
import * as tf from '@tensorflow/tfjs'

export default props => {
  const { tensor } = props
  if (!tensor) {
    return null
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
      <p>We need a single Rank 3 Tensor, or a batch Rank 4 tensor result!</p>
    )
  }
}
