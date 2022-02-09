// import React, { createContext, Component, useState, Fragment, useContext } from 'react'
// import { render } from 'react-dom'
import { render, createContext, Component, createElement, Fragment } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { memo } from 'preact/compat'

const React = { createElement }

const ctx = createContext()

class Root extends Component {

  state = {
    a: 1
  }

  render() {

    return (
      <ctx.Provider value={{ a: this.state.a }}>
        <button
          onClick={() => {
            this.setState({ a: this.state.a + 1 })
          }}
        >
          add
        </button>
        <A />
      </ctx.Provider>
    )
  }
}

class A extends Component {

  // static contextType = ctx

  shouldComponentUpdate(){
    return false
  }

  render() {

    console.log('render');

    return <Fragment>
      {/* {this.context.a} */}
      |---
      <ctx.Consumer>
        {ctx=>ctx.a}
      </ctx.Consumer>
    </Fragment>
  }

}

render(<Root />, root)