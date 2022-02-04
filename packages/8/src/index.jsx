import { Component, Fragment, createElement, render } from './react'

const React = { createElement }

class Root extends Component {

  state = {
    a: 1
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps, prevState)
    return {
      ...prevState,
      ...nextProps
    }
  }

  componentDidMount() {
    console.log('componentDidMount', document.querySelector('.p'))
  }

  render(props, state) {

    console.log('render', state)

    return (
      <Fragment>
        <span>{state.a}</span>,<span>{props.b}</span>
        <p className='p'>{state.a + state.b}</p>
      </Fragment>
    )
  }
}

render(
  <Root b={2} />,
  root
)

document.querySelector('button').onclick = function () {
  render(
    <Root b={20} />,
    root
  )
}