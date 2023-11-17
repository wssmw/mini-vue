import { isBoolean } from "../utils"
import { ShapeFlags } from "./vnode"


export function render(vnode,container){
    mount(vnode,container)
}

// 挂载dom
function mount(vnode,container){
    const { shapeFlag } = vnode
    if(shapeFlag&ShapeFlags.ELEMENT){
        mountElement(vnode,container)
    }else if(shapeFlag&ShapeFlags.TEXT){
        mountText(vnode,container)
    }else if(shapeFlag&&ShapeFlags.FRAGMENT){
        mountFragment(vnode,container)
    }else {
        mountComponent(vnode,container)
    }
}

function mountElement(vnode,container){
    const { type,props,children } = vnode
    const el = document.createElement(type)
    mountProps(props,el)
    mountChildren(vnode,el)
    container.appendChild(el)
}
function mountText(vnode,container){
    const textNode = document.createTextNode(vnode.children)
    container.appendChild(textNode)
}
function mountFragment(vnode,container){
    mountChildren(vnode,container)
}
function mountComponent(vnode,container){

}

function mountChildren(vnode,container) {
    const  { shapeFlag,children } = vnode
    if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
        mountText(vnode,container)
    }else if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
        children.forEach((child)=>{
            mount(child,container)
        })
    }
}
const domPropsRE = /[A-Z]^(value|selected|muted|disabled)$/
function mountProps(props,el) {
    for(const key in props){
        let value = props[key]
        switch (key) {
            case 'class':
                el.className = value
                break;
            case 'style':
                for(const styleName in value){
                    el.style[styleName] = value[styleName]
                }
                break;
            default:
                if(/^on[^a-z]/.test(key)){
                    const eventName = key.slice(2).toLowerCase()
                    el.addEventListener(eventName,value)
                }else if(domPropsRE.test(key)){
                    if(value===''&&isBoolean(el[key])){
                        value = true
                    }
                    el[key] = value
                }else {
                    if(value==null||value===false){
                        el.removeAttribute(key)
                    }else {
                        el.setAttribute(key,value)
                    }
                }
                break;
        }
    }
}