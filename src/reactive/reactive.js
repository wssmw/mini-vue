import { hasChanged, isObject } from "../utils";
import { effect, track, trigger } from "./effect";

// 这里是创建一个存储proxy的map
// 当用户重复代理同一个对象时,直接返回
// const obj = {}
// const a = reactive(obj),b = reactive(obj)
const proxyMap = new WeakMap()

export function reactive(target){
    // 判断是不是对象
    if(!isObject(target)){
        return target
    }
    // 特殊情况处理
    // 1.如果已经被代理过，判断是否已经被代理过
    if(isReactive(target)){
        return target
    }
    // 2.如果重复代理，和本文Line(4-7)一样
    if(proxyMap.has(target)){
        return proxyMap.get(target)
    }
    // 3.对同一个对象重复赋相同的值,如下所示，第一次应该触发effect，而第二次不用触发
    // obj.count = 10
    // obj.count = 10
    // 4.深层对象处理
    // 处理方式，在get方法return改成递归
    // 5.处理数组
    // 6.嵌套effect
    // effect(()=>{
    //     effect(()=>{
    //         console.log(1);
    //     })
    //     console.log(2);
    // })

    const proxy = new Proxy(target,{
        get(target,key,receiver){
            // 太妙了，这里的作用是帮助判断是不是已经被代理过，
            // isReactive，这个函数会访问对应的‘__isReactive’属性，当key等于这时，直接返回true
            // 相当于并没有挂载到对象上，并且也能访问，并且返回true
            if(key=='__isReactive')return true

            // ?这里为什么要用reflect
            const res = Reflect.get(target,key,receiver)
            track(target,key)//依赖收集
            return isObject(res)?reactive(res):res
        },
        set(target,key,value,receiver){
            // 获取旧值，判断新值是否和旧值相同，如果相同的话，就不触发effect
            const oldValue = target[key]
            // 这里的length为了处理数组
            let oldLength = target.length
            // ?这里为什么要用reflect
            const res = Reflect.set(target,key,value,receiver)
            // 判断数据是否修改，避免不必要的修改（特殊情况3）
            console.log('oldValue:',oldValue,'newValue:',value);
            if(hasChanged(oldValue,value)){
                trigger(target,key)//触发更新
                // 对数组的特殊处理
                if(Array.isArray(target)&&hasChanged(oldLength,target.length)){
                    trigger(target,'length')
                }
            }
            return res
        }
    })
    proxyMap.set(target,proxy)
    return proxy
}

// 判断是否被代理过
export function isReactive(target){
    return !!(target&&target.__isReactive);
}