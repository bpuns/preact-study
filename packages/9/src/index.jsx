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

  render(props, state) {

    console.log('render');

    return (
      <Fragment>
        <p className='p'>{state.a + props.b}</p>
        <button
          onClick={() => {
            this.setState({ a: this.state.a + 1 }, console.log.bind('updated'))
            this.setState({ a: this.state.a + 1 }, console.log.bind('updated'))
            setTimeout(() => {
              this.setState({ a: this.state.a + 1 }, console.log.bind('updated'))
              this.setState({ a: this.state.a + 1 }, console.log.bind('updated'))
            })
          }}
        >
          object update
        </button>
        <button
          onClick={() => {
            this.setState((state) => ({ a: state.a + 1 }), console.log.bind('updated'))
            this.setState((state) => ({ a: state.a + 1 }), console.log.bind('updated'))
            setTimeout(() => {
              this.setState((state) => ({ a: state.a + 1 }), console.log.bind('updated'))
              this.setState((state) => ({ a: state.a + 1 }), console.log.bind('updated'))
            })
          }}
        >
          function update
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