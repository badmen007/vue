import {initMixin} from './init'
import { initLifeCycle } from './lifeCycle';
import { initGlobalAPI } from "./gloablAPI";
import { initStateMixin } from './state';
// import { compilerToFunction } from './compiler';
// import { createElm, patch } from './vdom/patch';

function Vue(options) {
    this._init(options)
}


initMixin(Vue)
initLifeCycle(Vue);
initGlobalAPI(Vue)
initStateMixin(Vue);  //实现了nextTick $watch


//--------------------为了观察前后的虚拟节点  测试的  验证diff算法的

// let render1 = compilerToFunction(`<ul style="color:red">
//     <li key='a'>a</li>
//     <li key='b'>b</li>
//     <li key='c'>c</li>
//     <li key='d'>d</li>
// </ul>`)
// let vm1 = new Vue({data: {name: 'xz'}})
// let prevVnode = render1.call(vm1)

// let el = createElm(prevVnode);
// document.body.appendChild(el);



// let render2 = compilerToFunction(`<ul style="color:blue">
//     <li key='b'>b</li>
//     <li key='m'>m</li>
//     <li key='a'>a</li>
//     <li key='p'>p</li>
//     <li key='c'>c</li>
//     <li key='q'>q</li>
// </ul>`)
// let vm2 = new Vue({data: {name: '二哈'}})
// let nextVnode = render2.call(vm2)


// //直接将新的节点替换掉老的节点  不是直接替换 是比较两个人的区别之后再替换
// //diff算法是一个平级比较的过程 父亲和父亲比 儿子和儿子比较
// setTimeout(() => {
//     patch(prevVnode, nextVnode);

//     // let newEl = createElm(nextVnode);
//     // el.parentNode.replaceChild(newEl,el);
// },1000)

export default Vue;