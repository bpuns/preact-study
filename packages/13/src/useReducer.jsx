import {
  Component,
  Fragment,
  createElement,
  render,
  useMemo,
  useCallback,
  useReducer
} from './react'

const React = { createElement }

function Root() {

  const [store, dispatch] = useReducer(
    (state, type) => {
      switch (type) {
        case 'add': return { count: state.count + 1 }
        default: return state
      }
    },
    0,
    state => ({ count: state })
  )

  const add = useCallback(() => {
    dispatch('add')
    dispatch('add')
    dispatch('add')
  }, [store])

  console.log('render')

  return (
    <Fragment>
      <button onClick={add}>add</button>
      <p>{store.count}</p>
    </Fragment>
  )
}

render(<Root />, root)