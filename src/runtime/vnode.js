import { isArray, isNumber, isString } from "../utils";

export const ShapeFlags = {
    ELEMENT: 1,
    TEXT: 1 << 1,
    FRAGMENT: 1 << 2,
    COMPONENT: 1 << 3,
    TEXT_CHILDREN: 1 << 4,
    ARRAY_CHILDREN: 1 << 5,
    CHILDREN: (1 << 4) | (1 << 5),
};
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')

/**
 * vnode有四种类型：dom元素，纯文本，Fragment，组件
 * @param {string | Text | Fragment | Object } type
 * @param {Object | null} props
 * @param {string | array | null} children
 * @returns VNode
 */
// 创建虚拟dom
export function h(type,props,children) {
    let shapeFlag = 0
    if(isString(type)){
        shapeFlag = ShapeFlags.ELEMENT
    }else if(type===Text){
        shapeFlag = ShapeFlags.TEXT
    }else if(type==Fragment){
        shapeFlag = ShapeFlags.FRAGMENT
    }else {
        shapeFlag = ShapeFlags.COMPONENT
    }

    if(isString(children)||isNumber(children)){
        shapeFlag|= ShapeFlags.TEXT_CHILDREN
        children = children.toString()
    }else if(isArray(children)){
        shapeFlag|=ShapeFlags.ARRAY_CHILDREN
    }

    return {
        type,
        props,
        children,
        // 用来判断当前节点类型
        shapeFlag,
        // 这里的el是对应真实dom节点，为了让该节点方便找到父节点
        el:null,
        anchor:null
    }

}