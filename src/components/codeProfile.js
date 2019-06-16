import * as React from 'react'
import formatKB from '../lib/formatKB'

export default ({ profile }) => {
  // grab values, but default to zero
  const { newBytes, newTensors, peakBytes } = profile
    ? profile
    : { newBytes: 0, newTensors: 0, peakBytes: 0 }
  const cleanPeak = peakBytes < 0 ? 0 : peakBytes
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Code Result Memory</h3>
      <div style={styles.memBox}>
        <div style={styles.dataPoint}>
          <p>
            <strong>New Bytes:</strong> {formatKB(newBytes)} KB
          </p>
        </div>
        <div style={styles.dataPoint}>
          <p>
            <strong>New Tensors:</strong> {newTensors}
          </p>
        </div>
        <div style={styles.dataPoint}>
          <p>
            <strong>Peak Bytes:</strong> {formatKB(cleanPeak)} KB
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#3a3d4f',
    color: '#fff'
  },
  title: {
    margin: 0,
    borderBottom: '1px solid #44475c',
    backgroundColor: '#3f4255',
    textAlign: 'center',
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
    width: '100%',
    textAlign: 'center'
  }
}
