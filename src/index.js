import { computed } from "./reactive/computed";
import { effect } from "./reactive/effect";
import { reactive } from "./reactive/reactive";
import { ref } from "./reactive/ref";

console.log(1);

// const abc = (window.abc =  reactive({
//     count:0,
//     obj:{
//         name:'sss'
//     }
// }))

// effect(()=>{
//     console.log('这里执行',abc.count,abc.obj,abc.obj.name);
// })

// let arr = (window.arr = reactive([1,2,3]))
// effect(()=>{
//     console.log('index 4 is：' ,arr[4]);
// })
// effect(()=>{
//     console.log('length is：' ,arr.length);
// })

// let obj = (
//     window.obj = reactive({
//         count1:10,
//         count2:0
//     })
// )

// effect(()=>{
//     effect(()=>{
//         console.log(obj.count1,'obj.count1');
//     })
//     console.log(obj.count2,'obj.count2');
// })
// const foo = (window.foo = ref(1))
// effect(()=>{
//     console.log('foo.ref',foo.value);
// })
// const num  = ref(1)
// const computedNum = (window.computedNum = computed(()=>{
//     console.log('这里执行');
//     return num.value*2
// }))
const num  = window.num =  ref(1)
const computedNum = (window.computedNum = computed({
    get(){
        console.log('这里执行');
        return num.value*2
    },
    set(newValue){
        num.value = newValue
    }
}))