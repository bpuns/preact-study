import { EMPTY_OBJ } from '../constants';
import { Component, getDomSibling } from '../component';
import { Fragment } from '../create-element';
import { diffChildren } from './children';
import { diffProps, setProperty } from './props';
import { removeNode } from '../util';

export function diff(
	parentDom,
	newVNode,
	oldVNode,
	oldDom
) {

	let tmp,
		newType = newVNode.type;

	if (newVNode.constructor !== undefined) return null;

	if (typeof newType == 'function') {

		let c, isNew
		// 取出当前新虚拟dom的props
		let newProps = newVNode.props

		// 如果旧节点的 _component 存在（ _component 存储类组件的实例），说明实例化过，复用旧节点的实例
		if (oldVNode._component) {
			c = newVNode._component = oldVNode._component
		}
		// 没有实例化
		else {
			// 判断当前是否是类组件
			if ('prototype' in newType && newType.prototype.render) {
				// 实例化
				newVNode._component = c = new newType(newProps)
			}
			// 如果是函数组件，preact 中也会 new 实例化 Component 基类
			// 这样就能和类组件处理方式一致，有效节省代码
			else {
				newVNode._component = c = new Component(newProps)
				c.render = newType
			}

			// 下面这两句话没有什么必要，因为上面实例化，已经把 props, context 保存到实例对象上去了
			c.props = newProps

			// 如果实例对象上的 state 为 null，undefined，NaN, 0, -0, false, '' , 就会重写 state 为空对象
			if (!c.state) c.state = {}

			// 记录当前节点是脏组件（需要更新）
			isNew = c._dirty = true

			// 保存更新到页面上之后需要执行的一些回调
			c._renderCallbacks = []

		}

		// 下一次需要更新的state
		if (c._nextState == null) {
			c._nextState = c.state;
		}

		c.props = newProps
		c.state = c._nextState
		c._vnode = newVNode
		c._parentDom = parentDom
		c._dirty = false

		// 获取新的子节点虚拟dom
		tmp = c.render(c.props, c.state, c.context)

		// 判断 render 返回值是否是 Fragment
		let isTopLevelFragment = tmp != null && tmp.type === Fragment && tmp.key == null
		// 如果返回值是 Fragment 的话，直接取 Fragment 的 children，否则直接取返回值
		let renderResult = isTopLevelFragment ? tmp.props.children : tmp

		// 当前节点基本处理完毕
		diffChildren(
			// 当前虚拟节点的父节点的真实dom元素
			parentDom,
			// 当前节点的子节点，如果不是数组，包裹成一个数组
			Array.isArray(renderResult) ? renderResult : [renderResult],
			// 当前的新虚拟dom节点
			newVNode,
			// 旧虚拟dom节点
			oldVNode,
			// 旧的dom节点
			oldDom
		)

		// 把虚拟dom上的dom指向放到 component 实例上
		c.base = newVNode._dom

	} else if (
		newVNode._original === oldVNode._original
	) {
		newVNode._children = oldVNode._children;
		newVNode._dom = oldVNode._dom;
	} else {
		newVNode._dom = diffElementNodes(
			oldVNode._dom,
			newVNode,
			oldVNode
		);
	}

}

function diffElementNodes(
	dom,
	newVNode,
	oldVNode
) {
	let oldProps = oldVNode.props;
	let newProps = newVNode.props;
	let nodeType = newVNode.type;
	let i = 0;

	if (dom == null) {
		if (nodeType === null) {
			return document.createTextNode(newProps);
		}

		dom = document.createElement(nodeType);

	}

	if (nodeType === null) {
		if (oldProps !== newProps && dom.data !== newProps) {
			dom.data = newProps;
		}
	} else {

		oldProps = oldVNode.props || EMPTY_OBJ;

		diffProps(dom, newProps, oldProps);

		i = newVNode.props.children;

		diffChildren(
			dom,
			Array.isArray(i) ? i : [i],
			newVNode,
			oldVNode,
			oldVNode._children && getDomSibling(oldVNode, 0)
		)

	}

	return dom;
}

export function unmount(vnode, parentVNode, skipRemove) {
	let r;

	if ((r = vnode._component) != null) {
		if (r.componentWillUnmount) {
			r.componentWillUnmount();
		}

		r.base = r._parentDom = null;
	}

	if ((r = vnode._children)) {
		for (let i = 0; i < r.length; i++) {
			if (r[i]) {
				unmount(r[i], parentVNode, typeof vnode.type != 'function');
			}
		}
	}

	if (!skipRemove && vnode._dom != null) removeNode(vnode._dom);

	vnode._dom = vnode._nextDom = undefined;
}