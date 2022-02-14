import {
  Component,
  Fragment,
  createContext,
  createElement,
  render,
  useMemo
} from './react'

const React = { createElement }

let count1 = 0
let count2 = 0

function Root() {

  const data1 = useMemo(() => ({ count: count1 }), [count1])
  const data2 = useMemo(() => ({ count: count2 }), [])

  return (
    <Fragment>
      <p>{data1.count}</p>
      <p>{data2.count}</p>
    </Fragment>
  )
}

render(<Root />, root)

const button = document.createElement('button')
button.innerText = 'add'
button.onclick = function () {
  count1++
  render(<Root />, root)
}
document.body.insertBefore(button, document.body.firstChild)