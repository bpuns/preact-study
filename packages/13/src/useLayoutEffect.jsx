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

  const change = useCallback(() => setShow(!show), [show])
  const add = useCallback(() => setCount(count + 1), [count])

  return (
    <Fragment>
      <button onClick={change}>change</button>
      <button onClick={add}>add</button>
      {show && <A count={count} />}
    </Fragment>
  )
}

function A(props) {

  debugger

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    return () => {
      console.log('useLayoutEffect unmounted')
    }
  }, [])

  useLayoutEffect(() => {
    console.log(
      'useLayoutEffect before',
      props.count
    )
    return () => {
      console.log(
        'useLayoutEffect after',
        props.count
      )
    }
  }, [props])

  return <p>{props.count}</p>
}

render(<Root />, root)

/**

useLayoutEffect 

  第一步，判断 inputs 
  是否发生变化，如果发生变化在的 hooksState 上会存储三个值

  _effect      存储第一个回调，这个回调不会立马触发
  _inputs      存储第二个依赖
  _cleanup     存储_callback的返回值（一开始没有）

  第二步，把hooksState存储在 _renderCallbacks 上，因为
  _renderCallbacks存储的是方法，但是hooksState是对象
  所以commitQueue中会报错，因此需要在commitQueue执行前，执行一句话
  options.commit

  第三步，执行 options.commit
  需要对_renderCallbacks进行过滤，调用filter，把hooksState取出来
  剩下的重新写入到 _renderCallbacks 中

  取出来的不要hookState传入invokeEffect函数中，这个函数只干一件事情
  就是执行_effect，并把返回结果赋值给_cleanup

  那么这个_cleanup什么时候执行呢？它在invokeEffect之前执行

  那么可以再定义一个函数，名为invokeCleanup，这个函数的作用就是执行
  _cleanup

  

 */