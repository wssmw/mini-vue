import { isBoolean } from "../utils"

const domPropsRE = /[A-Z]^(value|selected|muted|disabled)$/

export function patchProps(oldProps,newProps,el){
    if(oldProps===newProps)return
    oldProps = oldProps||{}
    newProps = newProps||{}
    for(const key in newProps){
        const next = newProps[key]
        const prev = oldProps[key]
        if(prev!==next){
            patchDomProp(prev,next,key,el)
        }
    }
    for(const key in oldProps){
        if(newProps[key]==null){
            patchDomProp(oldProps[key],null,key,el)
        }
    }
}

export function patchDomProp(prev,next,key,el){
    switch (key) {
        case 'class':
            el.className = next||'';
            break;
        case 'style':
            if(next==null){
                el.removeAttribute('style')
            }else {
                for(const styleName in next){
                    el.style[styleName] = next[styleName]
                }
                if(prev){
                    for(const styleName in prev) {
                        if(next[styleName]==null){
                            el.style[styleName] = ''
                        }
                    }
                }
            }
           
            
            break;
        default:
            if(/^on[^a-z]/.test(key)){
                const eventName = key.slice(2).toLowerCase()
                if(prev){
                    el.removeEvenetListener(eventName,prev)
                }
                if(next){
                    el.addEventListener(eventName,next)
                }
            }else if(domPropsRE.test(key)){
                // 这里的处理详见https://github.com/HcySunYang/vue-design/blob/master/docs/zh/renderer.md
                // Attributes 和 DOM Properties
                if(next===''&&isBoolean(el[key])){
                    next = true
                }
                el[key] = next
            }else {
                if(next==null||next===false){
                    el.removeAttribute(key)
                }else {
                    el.setAttribute(key,next)
                }
            }
            break;
    }
}