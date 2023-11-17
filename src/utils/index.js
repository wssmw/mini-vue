
// 判断是否是对象
export function isObject(target) {
    return typeof target === 'object'&&target!== null
}

// 判断两个值是否相等
export function hasChanged(oldValue,newValue) {
    return oldValue!==newValue&&!(Number.isNaN(oldValue)&&Number.isNaN(newValue))
}
// 判断是否是函数
export function isFunction(target) {
    return typeof target === 'function'
}
// 判断是否是字符串
export function isString(target) {
    return typeof target ==='string'
}
// 判断是否是number
export function isNumber(target){
    return typeof target ==='number'
}
// 判断是否是布尔值
export function isBoolean(target){
    return typeof target === 'boolean'
}
// 判断是否是数组
export function isArray(target){
    return Array.isArray(target)
}