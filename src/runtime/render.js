import { patchProps } from "./patchProps";
import { ShapeFlags } from "./vnode";

export function render(vnode,container){
    const prevVnode = container._vnode;
    // 当非第一次render的时候，vnode代表n2节点
    if(!vnode){
        // 如果没有n1节点
        // ?这里不用判断吧
        if(prevVnode){
            unmount(prevVnode)
        }
    }else {
        patch(prevVnode,vnode,container)
    }
    // mount(vnode,container)
    // 在第一次渲染的时候，不用patch，直接把老的节点存到_vnode中
    // 当第二次render的时候取_vnode,用来patch
    container._vnode = vnode
}


function patch(n1,n2,container,anchor){
    if(n1&&!isSameVnode(n1,n2)){
        // anchor = n1.el.nextSibling;
        anchor =(n1.anchor||n1.el).nextSibling;
        unmount(n1)
        n1 = null
    }
    const { shapeFlag } = n2
    if(shapeFlag&ShapeFlags.COMPONENT){
        processComponent(n1,n2,container,anchor)
    }else if(shapeFlag&ShapeFlags.FRAGMENT){
        processFragment(n1,n2,container,anchor)
    }else if(shapeFlag&ShapeFlags.TEXT){
        processText(n1,n2,container,anchor)
    }else {
        processElement(n1,n2,container,anchor)
    }

}
// 卸载函数 
function unmount(vnode){
    const  { shapeFlag,el } = vnode
    if(shapeFlag&ShapeFlags.COMPONENT){
        unmountComponent(vnode)
    }else if(shapeFlag&ShapeFlags.FRAGMENT){
        unmountFragment(vnode)
    }else {
        el.parentNode.removeChild(el)
    }
}
// 判断两个节点类型是否相等
function isSameVnode(n1,n2) {
    return n1.type===n2.type
}
function processComponent(n1,n2,container,anchor){

}
function processFragment(n1,n2,container,anchor){
    const fragmentStartAnchor = (n2.el = n1?n1.el:document.createTextNode(''))
    const fragmentEndAnchor = (n2.anchor = n1?n1.anchor:document.createTextNode(''))
    
    if(n1){
        patchChildren(n1,n2,container,fragmentEndAnchor)
    }else {
        container.insertBefore(fragmentStartAnchor,anchor)
        container.insertBefore(fragmentEndAnchor,anchor)
        mountChildren(n2.children,container,fragmentEndAnchor)
    }
}
function processText(n1,n2,container,anchor){
    if(n1){
        n2.el = n1.el
        n1.el.textContent = n2.children
    }else {
        mountTextNode(n2,container,anchor)
    }
}
function processElement(n1,n2,container,anchor){
    if(n1){
        patchElement(n1,n2)
    }else {
        mountElement(n2,container,anchor)
    }
}

function mountTextNode(vnode,container,anchor){
    const textNode = document.createTextNode(vnode.children)
    // container.appendChild(textNode)
    container.insertBefore(textNode,anchor)
    vnode.el = textNode
}

function mountElement(vnode,container,anchor){
    const { type,props,shapeFlag,children } = vnode
    const el = document.createElement(type)
    // mountProps(props,el)
    patchProps(null,props,el)
    if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
        mountTextNode(vnode,el)
    }else if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
        mountChildren(children,el)
    }
    
    // container.appendChild(el)
    container.insertBefore(el,anchor)
    vnode.el = el
}

// 挂载childern
function mountChildren(children,container,anchor) {
    children.forEach((child)=>{
        // mount(child,container)
        patch(null,child,container,anchor)
    })
}
// 卸载children
function unmountChildren(children){
    children.forEach((child)=>{
        unmount(child)
    })
}

function unmountComponent(){

}

function unmountFragment(vnode){
    // unmountChildren(vnode.children)
    let { el:current,anchor:end } = vnode
    const parentNode = current.parentNode
    while(current!=end){
        let next = current.nextSibling;
        parentNode.removeChild(current)
        current = next
    }
    parentNode.removeChild(end)
}
function patchElement (n1,n2){
    n2.el = n1.el
    patchProps(n1.props,n2.props,n2.el)
    patchChildren(n1,n2,n2.el)
}


function patchChildren(n1,n2,container,anchor){
    const { shapeFlag:prevShapeFlag,children:c1 } = n1
    const { shapeFlag,children:c2 } = n2

    if(shapeFlag&ShapeFlags.TEXT_CHILDREN){
        if(prevShapeFlag&ShapeFlags.ARRAY_CHILDREN){
            unmountChildren(c1)
        }
        if(c1!==c2) {
            container.textContent = c2
        }
    }else if(shapeFlag&ShapeFlags.ARRAY_CHILDREN){
        if(prevShapeFlag&ShapeFlags.TEXT_CHILDREN){
            container.textContent = ''
            mountChildren(c2,container,anchor)
        }else if(prevShapeFlag&ShapeFlags.ARRAY_CHILDREN){
            patchArrayChildren(c1,c2,container,anchor)
        }else {
            mountChildren(c2,container,anchor)
        }
    }else {
        if(prevShapeFlag&ShapeFlags.TEXT_CHILDREN){
            container.textContent = ''
        }else if(prevShapeFlag&ShapeFlags.ARRAY_CHILDREN){
            unmountChildren(c1)
        }
    }
}

function patchArrayChildren(c1,c2,container,anchor) {
    const oldLength = c1.length,newLength = c2.length
    const commonLength = Math.min(oldLength,newLength)
    for(let i=0;i<commonLength;i++){
        patch(c1[i],c2[i],container,anchor)
    }
    if(oldLength>newLength){
        unmountChildren(c1.slice(commonLength))
    }else if(oldLength<newLength){
        mountChildren(c2.slice(commonLength),container,anchor)
    }
}