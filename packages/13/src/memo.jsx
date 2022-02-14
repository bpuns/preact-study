import {
  Component,
  Fragment,
  createElement,
  createContext,
  render,
  useMemo,
  useCallback,
  useReducer,
  useState,
  useContext,
  memo,
  PureComponent
} from './react'

const React = { createElement }

const ctx = createContext()

class Root extends PureComponent {

  state = { a: 1 }

  addA = () => {
    this.setState({ a: this.state.a + 1 })
  }

  render() {

    console.log('Root render')

    return (
      <Fragment>
        <button onClick={this.addA}>add a</button>
        <ctx.Provider value={this.state}>
          <A />
        </ctx.Provider>
      </Fragment>
    )
  }

}

const A = memo(() => {
  console.log('A render')
  return <B />
})

const B = memo(() => {

  const data = useContext(ctx)

  console.log('B render')

  return <p>{data.a}</p>
})

render(<Root />, root)