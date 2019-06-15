import * as React from 'react'

export default props => {
  const InputTensors = props =>
    props.inputTensors.map(tData => {
      let styleClasses =
        props.activeInputTensor && props.activeInputTensor.id === tData.id
          ? 'tensorBox selectedBox'
          : 'tensorBox'
      return (
        <div
          key={tData.id}
          id={tData.id}
          className={styleClasses}
          onClick={() => props.onSelect(tData)}
        >
          <img src={tData.thumb} alt={tData.desc} />
          <span>{tData.desc}</span>
        </div>
      )
    })

  return (
    <div className="inputTensors">
      <InputTensors {...props} />
    </div>
  )
}
