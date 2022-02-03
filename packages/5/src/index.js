import { createElement, render } from './react'

function test1() {
  const style = { border: '5px solid #D6D6D6', margin: '5px' }

  const element = createElement('div', { style },
    createElement('div', { id: 'id-1', style, key: 1 }, '1'),
    createElement('div', { id: 'id-2', style, key: 2 }, '2'),
    createElement('div', { id: 'id-3', style, key: 3 }, '3'),
    createElement('div', { id: 'id-4', style, key: 4 }, '4')
  )

  render(element, document.getElementById('root'))
}

function test2() {
  const style = { border: '8px solid red', margin: '3px' }

  const element = createElement('div', { style },
    createElement('div', { id: 'id-8', style, key: 8 }, '8'),
    createElement('div', { id: 'id-7', style, key: 7 }, '7'),
    createElement('div', { id: 'id-6', style, key: 6 }, '6'),
    createElement('div', { id: 'id-4', style, key: 4 }, '4-new'),
    createElement('div', { id: 'id-1', style, key: 1 }, '1-new'),
    createElement('div', { id: 'id-3', style, key: 3 }, '3-new'),
    createElement('div', { id: 'id-4', style, key: 5 }, '5'),
  )

  render(element, document.getElementById('root'))
}

let count = 0

test1()

document.querySelector('button').onclick = () => {

  ++count % 2 ? test2() : test1()

}

// 手动给 4， 1， 3添加上特定属性，如果切换中，这个属性没有消失，说明dom得到了复用
(function(){
  document.getElementById('id-4').setAttribute('test', '4')
  document.getElementById('id-1').setAttribute('test', '1')
  document.getElementById('id-3').setAttribute('test', '3')
})()