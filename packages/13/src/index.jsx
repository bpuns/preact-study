import {
  Component,
  Fragment,
  createElement,
  createContext,
  render,
  useMemo,
  useCallback,
  useReducer,
  useState,
  useContext,
  memo,
  PureComponent,
  useEffect,
  useLayoutEffect
} from './react'

const React = { createElement }

function Root() {

  const [show, setShow] = useState(true)
  const [count, setCount] = useState(1)
  const [mode, setMode] = useState(true)

  const unmount = useCallback(() => setShow(!show), [show])
  const add = useCallback(() => setCount(count + 1), [count])
  const changeMode = useCallback(() => setMode(!mode), [mode])

  return (
    <Fragment>
      <button onClick={unmount}>unmount</button>
      <button onClick={add}>add</button>
      <button onClick={changeMode}>
        当前模式：{mode ? '阻塞useLayoutEffect' : '阻塞useEffect'}
      </button>
      {show && <A count={count} mode={mode} />}
    </Fragment>
  )
}

function sleep(timeout = 0) {
  const start = Date.now()
  while (Date.now() - start < timeout) { }
}

function A(props) {

  useEffect(() => {
    console.log('useEffect')
    return () => {
      console.log('useEffect unmounted', document.querySelector('p'))
    }
  }, [])

  useEffect(() => {
    console.log(
      'useEffect before',
      props.count
    )
    if (!props.mode) {
      props.count > 1 && sleep(1)
    }
    return () => {
      console.log(
        'useEffect after',
        props.count
      )
    }
  }, [props])

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => {
      console.log('useLayoutEffect unmounted', document.querySelector('p'))
    }
  }, [])

  useLayoutEffect(() => {
    console.log(
      'useLayoutEffect before',
      props.count
    )
    if (props.mode) {
      props.count > 1 && sleep(1)
    }
    return () => {
      console.log(
        'useLayoutEffect after',
        props.count
      )
    }
  }, [props])

  return <p>
    {props.count}
    <B />
  </p>
}

function B() {

  useEffect(() => {
    console.log('B useEffect')
    return () => {
      console.log('B useEffect unmounted')
    }
  }, [])

  return <span>B</span>
}

render(<Root />, root)