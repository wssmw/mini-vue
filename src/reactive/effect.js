let activeEffect;
// 这里的栈是处理effect嵌套的，
const effectStack = []
export function effect (fn,option = {}) {
    const effectFn = () =>{
        try {
            activeEffect = effectFn;
            effectStack.push(activeEffect)
            return fn();

        } finally{
            effectStack.pop()
            activeEffect = effectStack[effectStack.length-1]
        }
    }
    // effect默认是执行一次的，但是computed是默认不执行的
    if(!option.lazy) {
       effectFn()
    }
    effectFn.scheduler = option.scheduler
   return effectFn
}
const targetMap = new WeakMap()//用来存储副作用函数
// 依赖收集
export function track (target,key) {
    if(!activeEffect){
        return
    }
    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(target,(depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps){
        depsMap.set(key,(deps = new Set()))
    }
    deps.add(activeEffect)
}

// 触发更新
export function trigger(target,key) {
    const depsMap = targetMap.get(target)
    if(!depsMap)return

    const deps = depsMap.get(key)
    if(!deps) return
    deps.forEach(effectFn => {
        // computed默认是不执行的
        if(effectFn.scheduler){
            effectFn.scheduler(effectFn)
        }else {
            effectFn()
        }
    });

}