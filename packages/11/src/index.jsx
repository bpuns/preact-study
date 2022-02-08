import { Component, Fragment, createElement, render } from './react'

const React = { createElement }

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
        <p className='p'>Root</p>
        <button
          onClick={() => {
            this.setState({ a: this.state.a + 1 })
          }}
        >
          unmount A
        </button>
        {state.a % 2 !== 0 && <A />}
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
      <p>
        A
        <B />
      </p>
    )
  }

}

class B extends Component {

  componentWillUnmount() {
    console.log('B unmount');
  }

  render() {
    return (
      <p>
        B
        <C />
      </p>
    )
  }

}

class C extends Component {

  componentWillUnmount() {
    console.log('C unmount');
  }

  render() {
    return <p>C</p>
  }

}

render(<Root />, root)