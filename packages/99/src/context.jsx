// import React, { createContext, Component,useState, useContext } from 'react'
// import { render } from 'react-dom'
import { render, createContext, createElement } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { memo } from 'preact/compat'

const React = {
  createElement
}

const ctx = createContext()

function A() {

  const [count, setCount] = useState(1)

  console.log('render A')

  return (
    <div>
      A
      <ctx.Provider value={{ count }}>
        <B />
      </ctx.Provider>
      <button onClick={() => {
        setCount(2)
      }}>UPDATE</button>
    </div>
  )

}

function B() {

  return (
    <div>
      B
      <C />
    </div>
  )

}

function C() {

  return (
    <div>
      C
      <D />
    </div>
  )

}

const D = memo(function () {

  // const x = useContext(ctx)

  console.log('render D')

  return (
    <div>
      d
      {/* {x.count} */}
      <ctx.Consumer>
        {(ctx) => {
          return ctx.count
        }}
      </ctx.Consumer>
    </div>
  )

})

render(<A />, root)