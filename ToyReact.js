
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    // vchild 为虚拟 dom
    appendChild(vchild) {
        vchild.mountTo(this.root);
    }
    // parent 为真实 dom
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    // parent 为真实 dom
    mountTo(parent) {
        parent.appendChild(this.root);
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
    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
    // vchild 为虚拟 dom
    appendChild(vchild) {
        this.children.push(vchild)
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
                element = new type();

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
                        child = child.toString();
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
        vdom.mountTo(element);
    }
}