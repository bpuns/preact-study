import { Component, createElement, render } from './react'

const React = { createElement }

class Counter extends Component {

  render(props) {

    return <div>{props.data}</div>

  }

}

const newDom = <div>
  <Counter data="a" key="a" />
  <Counter data="b" key="b" />
  <Counter data="c" key="c" />
  <Counter data="d" key="d" />
  <Counter data="e" key="e" />
</div>

render(
  newDom
  ,
  document.getElementById('root')
)

console.log(newDom);

document.querySelector('button').onclick = function () {
  render(
    <div>
      <Counter data="c" key="c" />
      <Counter data="b" key="b" />
      <Counter data="a" key="a" />
    </div>
    ,
    document.getElementById('root')
  )
}
