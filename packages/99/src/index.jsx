// import React, { createContext, Component, useState, Fragment, useContext } from 'react'
// import { render } from 'react-dom'
import { render, createContext, Component, createElement, Fragment } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { memo } from 'preact/compat'
const React = {
  createElement
}

const ctx = createContext()
const ctx2 = createContext()

class Root extends Component {

  state = {
    a: 1
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps
    }
  }

  componentDidMount() {
    // console.log('componentDidMount', document.querySelector('.p'))
  }

  shouldComponentUpdate() {
    // console.log('shouldComponentUpdate', ...arguments)
    return true
  }

  getSnapshotBeforeUpdate() {
    // console.log('getSnapshotBeforeUpdate', ...arguments)
    return 11
  }

  componentDidUpdate() {
    // console.log('componentDidUpdate', ...arguments)
  }

  render(props, state) {

<<<<<<< HEAD
    console.log('root render')

    return (
      <Fragment>
        {/* <ctx.Provider value={this.state}> */}
          <ctx2.Provider value={{ b: this.state.a + 1 }}>
            <p>Root</p>
            <button
              onClick={() => {
                this.setState({ a: this.state.a + 1 })
              }}
            >
              add
            </button>
            <A />
            {/* <D /> */}
          </ctx2.Provider>
        {/* </ctx.Provider> */}
=======
    // console.log('render')

    return (
      <Fragment>
        <p>Root</p>
        <button
          onClick={() => {
            this.setState({ a: this.state.a + 1 })
          }}
        >
          unmount A
        </button>
        {this.state.a % 2 !== 0 && <A />}
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
      </Fragment>
    )
  }
}

<<<<<<< HEAD
function D() {
  console.log('D', this)
  return <div>D</div>
}

=======
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
class A extends Component {

  componentWillUnmount() {
    console.log('A unmount');
  }

<<<<<<< HEAD
  // shouldComponentUpdate() {
  //   return false
  // }

=======
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
  render() {
    return (
      <div>
        A
        <B />
      </div>
    )
  }

<<<<<<< HEAD
    console.log('A render');
=======
}
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057

class B extends Component {

  componentWillUnmount() {
    console.log('B unmount');
  }

  render() {
    return (
      <div>
<<<<<<< HEAD
        A
        <B />
=======
        B
        <C />
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
      </div>
    )
  }

}

<<<<<<< HEAD
class B extends Component {

  componentWillUnmount() {
    console.log('B unmount');
  }

  render() {

    console.log('B render');

    return (
      <div>
        B
        <C />
      </div>
    )
  }

}

class C extends Component {

  static contextType = ctx2

  constructor(props, context) {
    super(props, context)
  }

=======
class C extends Component {

>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
  componentWillUnmount() {
    console.log('C unmount');
  }

<<<<<<< HEAD
  // shouldComponentUpdate() {
  //   return false
  // }

  render() {

    console.log('C render');
    // console.log('context', this.context)

    return <div>
      C
      {/* <ctx.Consumer>
        {
          ctx => {
            return <p>{ctx.a}</p>
          }
        }
      </ctx.Consumer> */}
    </div>
=======
  render() {
    return <div>C</div>
>>>>>>> ca89dcde7dd6033addffbafdbfb2db22bf465057
  }

}

render(<Root />, root)