import {
  Component,
  Fragment,
  createElement,
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

class Root extends PureComponent {

  state = { a: 1, b: 2 }

  addA = () => {
    this.setState({ a: this.state.a + 1 })
  }

  addB = () => {
    this.setState({ b: this.state.b + 1 })
  }

  render() {
    return (
      <Fragment>
        <button onClick={this.addA}>add a</button>
        <button onClick={this.addB}>add b</button>
        <p>{this.state.a}</p>
        <p>{this.state.b}</p>
        <A a={this.state.a} />
      </Fragment>
    )
  }

}

class A extends PureComponent {

  render() {

    console.log('A render')

    return <p>{this.props.a}</p>
  }

}

render(<Root />, root)