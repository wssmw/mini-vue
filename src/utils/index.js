
// 判断是否是对象
export function isObject(target) {
    return typeof target === 'object'&&target!== null
}

// 判断两个值是否相等
export function hasChanged(oldValue,newValue) {
    return oldValue!==newValue&&!(Number.isNaN(oldValue)&&Number.isNaN(newValue))
}

export function isFunction(target) {
    return typeof target === 'function'
}