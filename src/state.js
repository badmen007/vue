import { observe } from "./observe";
import Dep from "./observe/dep";
import Watcher, { nextTick } from './observe/watcher'

export function initState(vm) {
    const opts = vm.$options;
    if(opts.data) {
        initData(vm);
    }

    if(opts.computed) {
        initComputed(vm);
    }

    if(opts.watch) {
        initWatch(vm);
    }
}

function initWatch(vm) {
    let watch = vm.$options.watch;
    for(let key in watch) {
        const handler = watch[key];
        if(Array.isArray(handler)) {
            createWatcher(vm, key, handler[i])
        }else{
            createWatcher(vm, key, handler);
        }
    }
}

function createWatcher(vm,key,handler) {
    if(typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(key, handler);
}


function proxy(vm, target, key) {
   Object.defineProperty(vm, key, {
       get() {
        return vm[target][key]
       },
       set(newValue) {
        vm[target][key] = newValue;
       }
   })
}

function initData(vm) {
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;

    vm._data = data; 

    observe(data);

    for(let key in data) { // 为了外层取值的方便 所以多加了一层劫持
        proxy(vm,'_data',key)
    }
}


function initComputed(vm){
    const computed = vm.$options.computed;
    const watchers = vm._computedWatchers = {};
    for(let key in computed) {
        let userDef = computed[key];
        //需要监控计算属性中get的变化
        let fn = typeof userDef === 'function' ? userDef : userDef.get;
        //如果直接执行new Wather 默认就会执行fn 将属性和watcher对应起来
        watchers[key] = new Watcher(vm, fn, {lazy: true})

        defineComputed(vm, key, userDef);
    }
}

function defineComputed(vm, key, userDef){
    
    const setter = userDef.set || (() => {});

    Object.defineProperty(vm, key, {
        get: createComputedGetter(key),
        set: setter,
    })
}

// 计算属性自己不回去收集依赖 只会让自己的属性去收集依赖
function createComputedGetter(key) {
    return function(){
        let watcher = this._computedWatchers[key];
        if(watcher.dirty) {
            watcher.evaluate()
        }
        if(Dep.target) {
            watcher.depend();
        }
        return watcher.value;        
    }
}

export function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function (exprOrFn, cb) {

        new Watcher(this, exprOrFn, {user: true}, cb);
    }

}