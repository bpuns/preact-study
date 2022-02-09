import { Component, Fragment, createContext, createElement, render } from './react'

const React = { createElement }

const ctx1 = createContext()
const ctx2 = createContext()

class A1 extends Component {

  state = {
    a: 1
  }

  render() {

    console.log('A1 render', this._globalContext)

    return (
      <ctx1.Provider value={this.state}>
        <button onClick={() => this.setState({ a: this.state.a + 1 })}>update</button>
        <h2>A1</h2>
        <B1 />
        <B2 />
      </ctx1.Provider>
    )
  }
}

class B1 extends Component {

  shouldComponentUpdate() {
    return false
  }

  render() {

    console.log('B1 render', this._globalContext)

    return <ctx2.Provider value={{ b: 2 }}>
      <h2>B1</h2>
      <C1 />
    </ctx2.Provider>
  }

}

class B2 extends Component {

  static contextType = ctx1

  shouldComponentUpdate() {
    return false
  }

  render() {

    console.log('B2 render', this._globalContext)

    return <h2>B2</h2>
  }

}

class C1 extends Component {

  static contextType = ctx1

  shouldComponentUpdate() {
    return false
  }

  render() {

    console.log('C1 render', this._globalContext)

    return <Fragment>
      <h2>C1</h2>
      <ctx1.Consumer>
        {ctx => ctx.a}
      </ctx1.Consumer>
    </Fragment>
  }

}

const a = <A1 />

render(a, root)