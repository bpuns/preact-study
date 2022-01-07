export function diffProps(dom, newProps, oldProps) {

	let i;

	for (i in oldProps) {
		if (i !== 'children' && i !== 'key' && !(i in newProps)) {
			setProperty(dom, i, null, oldProps[i]);
		}
	}

	for (i in newProps) {
		setProperty(dom, i, newProps[i], oldProps[i]);
	}
}

function setStyle(style, key, value) {
	if (key[0] === '-') {
		style.setProperty(key, value);
	} else if (value == null) {
		style[key] = '';
	} else if (typeof value != 'number') {
		style[key] = value;
	} else {
		style[key] = value + 'px';
	}
}


export function setProperty(dom, name, value, oldValue,) {
	let useCapture;

	o: if (name === 'style') {
		if (typeof value == 'string') {
			dom.style.cssText = value;
		} else {
			if (typeof oldValue == 'string') {
				dom.style.cssText = oldValue = '';
			}

			if (oldValue) {
				for (name in oldValue) {
					if (!(value && name in value)) {
						setStyle(dom.style, name, '');
					}
				}
			}

			if (value) {
				for (name in value) {
					if (!oldValue || value[name] !== oldValue[name]) {
						setStyle(dom.style, name, value[name]);
					}
				}
			}
		}
	}
	else if (name[0] === 'o' && name[1] === 'n') {
		useCapture = name !== (name = name.replace(/Capture$/, ''));

		if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);
		else name = name.slice(2);

		if (!dom._listeners) dom._listeners = {};
		dom._listeners[name + useCapture] = value;

		if (value) {
			if (!oldValue) {
				const handler = useCapture ? eventProxyCapture : eventProxy;
				dom.addEventListener(name, handler, useCapture);
			}
		} else {
			const handler = useCapture ? eventProxyCapture : eventProxy;
			dom.removeEventListener(name, handler, useCapture);
		}
	} else {

		if (name !== 'children') {
			if (
				typeof value === 'string' ||
				typeof value === 'number'
			) {
				dom[name] = value == null ? '' : value;
			} else {
				dom.removeAttribute(name);
			}

		}

	}
}

function eventProxy(e) {
	this._listeners[e.type + false](e);
}

function eventProxyCapture(e) {
	this._listeners[e.type + true](e);
}
