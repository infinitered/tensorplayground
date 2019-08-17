const returnCode = params =>
  params.includes('aTensor')
    ? 'return aTensor'
    : 'return tf.fill([400, 400, 3], 1)'

export default (description, inputShape, activeModelInfo, code) => {
  let startCode
  let parameters = ['tf']
  // Handle code setup
  if (code) {
    startCode = code
  } else {
    // Setup code
    startCode = `// TensorPlayground.com${'\n'}`
    startCode += `// ${description}${'\n'}`

    // if we have an input tensor, add comment
    if (inputShape) {
      startCode += `// INPUT TENSOR SHAPE: [${inputShape}]${'\n'}`
      parameters.push('aTensor')
    }

    // If they have a model add that
    if (activeModelInfo.label) {
      startCode += `// MODEL: ${activeModelInfo.label} ${
        activeModelInfo.info
      }${'\n'}`
      parameters.push('model')
    }

    startCode += `${'\n'}(${parameters.join(', ')}) => {
  // return tensor to show
  ${returnCode(parameters)}
}`
  }
  return startCode
}
