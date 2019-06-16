import * as React from 'react'
import * as tf from '@tensorflow/tfjs'
import formatKB from '../lib/formatKB'

export default props => {
  const {
    numBytes,
    numTensors,
    numDataBuffers,
    unreliable,
    reasons
  } = tf.memory()
  let issues
  if (unreliable) {
    issues = (
      <div className="tooltip">
        <span className="tooltiptext">{reasons && reasons.toString()}</span>
        <span role="img" aria-label="issues">
          ❌
        </span>
      </div>
    )
  }
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Browser Tensor Memory</h3>
      <div style={styles.memBox}>
        {issues}
        <div style={styles.dataPoint}>
          <p>
            <strong>Tensor Bytes:</strong> {formatKB(numBytes)} KB
          </p>
        </div>
        <div style={styles.dataPoint}>
          <p>
            <strong>Tensors:</strong> {numTensors}
          </p>
        </div>
        <div style={styles.dataPoint}>
          <p>
            <strong>Data Buffers:</strong> {numDataBuffers}
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#181f27',
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    margin: 0,
    borderBottom: '1px solid #2f3d4e',
    backgroundColor: '#242e3b',
    fontSize: '1em'
  },
  memBox: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    fontSize: '0.9em'
  },
  dataPoint: {
    // Big so it forces spacing in nowrap
    width: '100%'
  }
}
