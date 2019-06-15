import { useReducer } from 'react'

const reducer = (prevState, updater) =>
  typeof updater === 'function'
    ? { ...prevState, ...updater(prevState) }
    : { ...prevState, ...updater }

const useMergeState = (initialState = {}) => useReducer(reducer, initialState)

export default useMergeState
