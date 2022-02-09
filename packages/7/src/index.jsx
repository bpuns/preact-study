import { Component, Fragment, createElement, render } from './react'

const React = { createElement }

const list = [
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 }
]

const virtualDom = (
  <div>
    <h1>list</h1>
    {
      list.map(item => (
        <div key={item.id}>{item.value}</div>
      ))
    }
  </div>
)

render(virtualDom, root)

console.log(virtualDom);