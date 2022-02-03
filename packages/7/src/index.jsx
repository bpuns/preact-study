import { Component, Fragment, createElement, render } from './react'

const React = { createElement }

function FragmentTest({a}) {

  if(a){
    return (
      <Fragment>
        <div key={3} id='3'>3</div>
        <div key={2} id='2'>2</div>
        <div key={1} id='1'>1</div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div key={1} id='1'>1</div>
      <div key={2} id='2'>2</div>
      <div key={3} id='3'>3</div>
    </Fragment>
  )
}

render(
  <div>
    <div key={0} id='0'>0</div>
    <FragmentTest />
    <div key={4} id='4'>4</div>
  </div>,
  root
)

document.querySelector('button').onclick = function () {
  render(
    <div>
      <FragmentTest a={true} />
      <div key={0} id='0'>0</div>
      <div key={4} id='4'>4</div>
    </div>,
    root
  )
}
