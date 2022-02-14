import {
  Component,
  Fragment,
  createElement,
  render,
  useMemo,
  useCallback,
  useReducer,
  useState
} from './react'

const React = { createElement }

function Root() {

  const [count, setCount] = useState(1)

  const add = useCallback(() => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }, [count])

  console.log('render')

  return (
    <Fragment>
      <button onClick={add}>add</button>
      <p>{count}</p>
    </Fragment>
  )
}

render(<Root />, root)