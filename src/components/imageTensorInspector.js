import * as React from 'react'
import { useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'

const componentToHex = c => {
  let hex = Number(c).toString(16)
  if (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}

const toColorHex = (rgb, tensorType) => {
  let r, g, b
  // Handle 1 or 3 channel
  if (rgb.length === 1) {
    r = rgb[0]
    g = rgb[0]
    b = rgb[0]
  } else {
    ;[r, g, b] = rgb
  }

  // Handle float32
  if (tensorType === 'float32') {
    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

const ColorBlock = props => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div
      style={{
        marginRight: '10px',
        width: '15px',
        height: '15px',
        border: '1px solid white',
        backgroundColor: props.color
      }}
    />
    {props.color}
  </div>
)

const printTensor = (areaBox, tensor) => {
  if (tensor) {
    console.log('Tensor Print', tensor)
    const printText = `Details of Tensor
    Matrix Rank: ${tensor.rankType},
    Shape: ${tensor.shape} (Height, Width, Channels)
    This means ${tensor.shape[1]} blocks of ${
      tensor.shape[2]
    } color value(s) (of type ${tensor.dtype}), done ${tensor.shape[0]} times

    Result ${tensor.toString()}
    `
    areaBox.value = printText
  }
}

const TensorColors = ({ aTensor }) => {
  // shortcircuit
  if (!aTensor) return null

  let channelCount
  const corners = tf.tidy(() => {
    // dims
    const height = aTensor.shape[0]
    const width = aTensor.shape[1]
    channelCount = aTensor.shape[2]
    // 4 corners
    const tl = tf.slice(aTensor, [0, 0, 0], [1, 1, channelCount])
    const tr = tf.slice(aTensor, [0, width - 1, 0], [1, 1, channelCount])
    const bl = tf.slice(aTensor, [height - 1, 0, 0], [1, 1, channelCount])
    const br = tf.slice(
      aTensor,
      [height - 1, width - 1, 0],
      [1, 1, channelCount]
    )
    // return all corners
    return tf.stack([tl, tr, bl, br])
  })
  // bring tensor back to JS
  const values = corners.dataSync()
  const arr = Array.from(values)
  corners.dispose() // clean up
  // bring back to 2D array
  let newArr = []
  while (arr.length) newArr.push(arr.splice(0, channelCount))
  const tensorType = aTensor.dtype

  return (
    <ul style={styles.pixelList}>
      <li>
        Top Left Pixel <ColorBlock color={toColorHex(newArr[0], tensorType)} />
      </li>
      <li>
        Bottom Left Pixel{' '}
        <ColorBlock color={toColorHex(newArr[2], tensorType)} />
      </li>
      <li>
        Top Right Pixel <ColorBlock color={toColorHex(newArr[1], tensorType)} />
      </li>
      <li>
        Bottom Right Pixel{' '}
        <ColorBlock color={toColorHex(newArr[3], tensorType)} />
      </li>
    </ul>
  )
}

export default props => {
  if (!props.tensor) return null
  const tensorDisplay = useRef(null)
  const tensorText = useRef(null)

  useEffect(() => {
    const updateDisplay = async () => {
      if (props.tensor) {
        printTensor(tensorText.current, props.tensor)
        await tf.browser.toPixels(props.tensor, tensorDisplay.current)
      }
    }
    updateDisplay() // call that async goodness
  }, [props.tensor])

  return (
    <div>
      <canvas style={styles.canvas} ref={tensorDisplay} />
      <div style={styles.column}>
        <div style={styles.leftColumn}>
          <TensorColors aTensor={props.tensor} />
        </div>
        <div style={styles.rightColumn}>
          <textarea style={styles.displayText} ref={tensorText} readOnly>
            {props.text}
          </textarea>
        </div>
      </div>
    </div>
  )
}

const styles = {
  column: {
    display: 'inline-flex',
    justifyContent: 'space-between'
  },
  leftColumn: {
    // maxWidth: '50%'
    // backgroundColor: "yellow"
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column'
    // backgroundColor: "blue"
  },
  displayText: {
    minWidth: '380px',
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#23252a',
    color: '#9ea7ba',
    fontSize: '1em',
    fontFamily: 'monospace'
  },
  pixelList: {
    columns: 2,
    textAlign: 'left',
    listStyle: 'none',
    padding: '10px',
    margin: 0,
    color: 'white'
  },
  canvas: {
    maxWidth: '100%'
  }
}
