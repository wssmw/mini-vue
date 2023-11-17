import { isFunction } from "../utils"
import { effect, track, trigger } from "./effect"

export function computed(getterOrOption) {
    let getter,setter;
    if(isFunction(getterOrOption)){
        getter = getterOrOption;
        setter = () =>{
            console.log('computed is readonly');
        }
    }else {
        getter = getterOrOption.get
        setter = getterOrOption.set
    }
    return new ComputedImpl(getter,setter)
}

class ComputedImpl{
    constructor(getter,setter) {
        this._value = undefined
        // 依赖是否更新
        this._dirty = true
        this._setter = setter
        this.effect = effect(getter,{
            lazy:true,
            scheduler:()=>{
                if(!this._dirty){
                    this._dirty = true
                    trigger(this,'value')
                }
               
            }
        })
    }
    get value(){
        if(this._dirty){
            this._value = this.effect()
            this._dirty = false
            track(this,'value')
        }
        return this._value
    }
    set value(newValue){
        this._setter(newValue)
    }
}