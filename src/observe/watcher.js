import Dep, { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {
    constructor(vm, fn, options) {
        this.id = id++;
        this.renderWatcher = options;
        this.getter = fn;
        this.vm = vm;
        this.deps = [];
        this.depsId = new Set();
        this.lazy = options.lazy;
        this.dirty = this.lazy;

        this.value = this.lazy ? undefined :  this.get();
    }

    evaluate(){
        this.value = this.get();
        this.dirty = false;
    }

    get() {
        pushTarget(this);
        let value = this.getter.call(this.vm); // 为了保证this的指向
        popTarget();
        return value;
    }

    addDep(dep){
        let id = dep.id;
        if(!this.depsId.has(id)){
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }

    }
    // 让属性去收集watcher
    depend() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend();
        }
    }

    update(){
        if(this.lazy) {
            this.dirty = true;
        }else{
            queueWatcher(this);
            //this.get(); // 重新渲染
        }
    }

    run() {
        this.get();
    }

}

function flushScheduleQueue() {
    let flushQueue = queue.slice(0); // 对数组的拷贝
    queue.length = 0;
    pending = true;
    has = {};
    flushQueue.forEach(q => q.run());
}


let queue = [];
let has = {};
let pending = false;
function queueWatcher(watcher) {
    let id = watcher.id;
    if(!has[id]){
        queue.push(watcher);
        has[id] = true;
        //不管我们update执行多少次，但是最终都只执行一次
        if(!pending) {
            nextTick(flushScheduleQueue,0);
        }
    }
}

function flushCallbacks() {
    let cbs = callbacks.slice(0);
    waiting = false;
    callbacks = [];
    cbs.forEach(cb => cb());
}

let timerFunc;
// 这里就是做了兼容性的处理
if(Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks);
    }
}else if(MutationObserver) {
    let observer = new MutationObserver(flushCallbacks); // 传入的回调是异步执行的
    let textNode = document.createTextNode(1);
    observer.observe(textNode,{
        characterData: true,
    })
    timerFunc = () => {
        textNode.textContent = 2;
    }
}else if(setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks);
    }
}else{
    timerFunc = () => {
        setTimeout(flushCallbacks);
    }
}

let callbacks = [];
let waiting = false;
export function nextTick(cb) {
    callbacks.push(cb);
    if(!waiting) {
        timerFunc()
        waiting = true;
    }

}

export default Watcher;