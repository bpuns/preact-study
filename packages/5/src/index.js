import { createElement, render } from './react'

// const style = { border: '5px solid #D6D6D6', margin: '5px' }

// const element = createElement('div', { style },
//   createElement('div', { style, key: 1 }, '1'),
//   createElement('div', { style, key: 2 }, '2'),
//   createElement('div', { style, key: 3 }, '3'),
//   createElement('div', { style, key: 4 }, '4')
// )

// render(element, document.getElementById('root'))

// document.querySelector('button').onclick = () => {

//   const element = createElement('div', { style },
//     createElement('div', { style, key: 4 }, '4-1'),
//     createElement('div', { style, key: 1 }, '1'),
//     createElement('div', { style, key: 3 }, '3'),
//     createElement('div', { style, key: 5 }, '5'),
//   )

//   render(element, document.getElementById('root'))
// }



const style = { border: '5px solid #D6D6D6', margin: '5px' }

const element = createElement('div', { id: 'a', style }, 1)

render(element, document.getElementById('root'))

document.querySelector('button').onclick = () => {

  const element = createElement('div', { id: 'a', style }, 2)

  render(element, document.getElementById('root'))
}
