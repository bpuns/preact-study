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
    console.log('componentDidMount', document.querySelector('.p'))
  }

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate', ...arguments);
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log('getSnapshotBeforeUpdate', ...arguments);
    return 11
  }

  componentDidUpdate() {
    console.log('componentDidUpdate', ...arguments);
  }

  render(props, state) {

    console.log('render');

    return (
      <Fragment>
        <p className='p'>{state.a + props.b}</p>
        <button
          onClick={() => {
            this.setState({ a: this.state.a + 1 })
          }}
        >
          object update
        </button>
        <button
          onClick={() => {
            this.forceUpdate()
          }}
        >
          forceUpdate
        </button>
      </Fragment>
    )
  }
}

render(<Root b={2} />, root)