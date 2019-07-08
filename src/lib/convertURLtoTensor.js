import * as tf from '@tensorflow/tfjs'

export default (imageURL, channels) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageURL
    img.onload = () => {
      resolve(tf.browser.fromPixels(img, channels))
    }
    img.onerror = e => {
      reject(e)
    }
  })
}
