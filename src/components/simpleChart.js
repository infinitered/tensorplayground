import React from 'react'
import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryLabel
} from 'victory'

export default props => (
  <VictoryChart theme={VictoryTheme.material} padding={40}>
    <VictoryScatter
      animate={true}
      style={{
        parent: {
          border: '1px solid #ccc'
        },
        data: {
          fill: '#8662b0'
        },
        labels: {
          fontSize: 15,
          fill: '#8662b0',
          padding: 15
        }
      }}
      labels={datanum => datanum.y}
      labelComponent={<VictoryLabel dx={10} />}
      size={7}
      data={props.chartData}
    />
  </VictoryChart>
)
