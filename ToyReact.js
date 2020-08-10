
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) {
            const eventName =
                RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
            this.root.addEventListener(eventName, value);
        }

        if (name === 'className') 
            name = 'class';

        this.root.setAttribute(name, value);
    }
    // vchild 为虚拟 dom
    appendChild(vchild) {
        let range = document.createRange();
        if (this.root.children.length) {
            range.setStartAfter(this.root.lastChild);
            range.setEndAfter(this.root.lastChild);
        } else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        vchild.mountTo(range);
    }
    // parent 为真实 dom
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    // parent 为真实 dom
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }
    mountTo(range) {
        if (this.componentWillMount) 
            this.componentWillMount();
        this.range = range;
        this.update();
        if (this.componentDidMount) 
            this.componentDidMount();
        this.didMount = true;
    }
    update() {

        if (this.didMount && this.componentWillUpdate) 
            this.componentWillUpdate();

        let placeholder = document.createComment('placeholder');
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder);
        
        this.range.deleteContents();
        let vdom = this.render();
        vdom.mountTo(this.range);

        if (this.didMount && this.componentDidUpdate)
            this.componentDidUpdate();
        // placeholder.parentNode.removeChild(placeholder);
    }
    // vchild 为虚拟 dom
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) {
        const merge = (oldState, newState) => {
            for (let p in newState) {
                if (typeof newState[p] === 'object' && newState[p] !== null) {
                    if (typeof oldState[p] !== 'object')
                        oldState[p] = newState[p] instanceof Array ? [] : {};
                    merge(oldState[p], newState[p]);
                } else
                    oldState[p] = newState[p];
            }
        };

        if (!this.state && state)
            this.state = {};

        merge(this.state, state);

        this.update();
    }
}

export default {
    createElement(type, attributes, ...children) {
        let element;

        if (typeof type === 'string')
                // type 类型是 string，代表这里是原生的 tag
                element = new ElementWrapper(type);
        else
                // type 类型是 class 或 function
                element = new type(attributes);

        for (let name in attributes) {
            // 这里调用的都是包装后的 setAttribute 方法
            element.setAttribute(name, attributes[name]);
        }

        // children 可能包含： ElementWrapper实例、string类型、包含前两者的数组
        let insertChildren = (children) => {
            for (let child of children) {
            
                if (typeof child === 'object' && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if (!(child instanceof Component || child instanceof ElementWrapper))
                        child = child ? child.toString() : '';
                    if (typeof child === 'string')
                        child = new TextWrapper(child);
                    element.appendChild(child);
                }
            }
        }

        insertChildren(children);
        return element;
    },
    render(vdom, element) {
        
        let range = document.createRange();

        if (element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }

        vdom.mountTo(range);
    }
}