// import React, { createContext, Component, useState, Fragment, useContext } from 'react'
// import { render } from 'react-dom'
// import { render, createContext, Component, createElement, Fragment } from 'preact'
// import { useContext, useState } from 'preact/hooks'
// import { memo } from 'preact/compat'
const React = {
  createElement
}

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
      </Fragment>
    )
  }
}

class A extends Component {

  componentWillUnmount() {
    console.log('A unmount');
  }

  render() {
    return (
      <div>
        A
        <B />
      </div>
    )
  }

}

class B extends Component {

  componentWillUnmount() {
    console.log('B unmount');
  }

  render() {
    return (
      <div>
        B
        <C />
      </div>
    )
  }

}

class C extends Component {

  componentWillUnmount() {
    console.log('C unmount');
  }

  render() {
    return <div>C</div>
  }

}

render(<Root />, root)