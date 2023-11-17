import { computed } from "./reactive/computed";
import { effect } from "./reactive/effect";
import { reactive } from "./reactive/reactive";
import { ref } from "./reactive/ref";
import { Fragment, h, render, Text } from "./runtime";

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
// const num  = window.num =  ref(1)
// const computedNum = (window.computedNum = computed({
//     get(){
//         console.log('这里执行');
//         return num.value*2
//     },
//     set(newValue){
//         num.value = newValue
//     }
// }))
const vnode = h(
    'div',
    {
        class:'a b',
        style:{
            border:'1px solid',
            fontSize:'14px'
        },
        onClick:()=>console.log('click'),
        id:'foo',
        checked:false
    },
    [
        h('ul',null,[
            h('li',{style:{color:'red'}},1),
            h('li',null,2),
            h('li',{style:{color:'blue'}},3),
            h(Fragment,null,[h('li',null,'4'),h('li')]),
            h('li',null,[h(Text,null,'hello world')]),
        ])
    ]
)
render(vnode,document.body)