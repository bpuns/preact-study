初始渲染 -> render函数

1. 先把传进入的虚拟dom包装一层Fragment
2. 传入diff方法，传递7个参数
parentDom         当前虚拟dom节点的父节点的真实dom
vnode             当前虚拟dom节点
oldVnode          旧的虚拟dom节点，没有就传递一个空对象
globalContext     全局的上下文
excessDomChildren 过量的子节点，初次渲染用不上
commitQueue       现在用不上
_dom              当前diff节点的真实dom，如果存在旧的虚拟dom存在，保存在 _dom 上


调用 diffChildren 的时候，要传递 8 个参数
当前虚拟dom所有的子节点要挂载在哪个真的dom下
dom                   

当前节点的子节点，如果不是数组，包裹成一个数组
Array.isArray(children) ? children : [children]  

// 当前的新虚拟dom节点
newVNode

// 旧虚拟dom节点
oldVNode

// globalContext
globalContext

// excessDomChildren
excessDomChildren
// commitQueue

commitQueue
// 当前节点的旧的真实dom元素
oldDom
