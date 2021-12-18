

let oldArrayProto = Array.prototype;

export let newArrayProto = Object.create(oldArrayProto);

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

methods.forEach(method => {
    newArrayProto[method] = function(...args) { // 重写了数组的方法
        
        let result = oldArrayProto[method].call(this,...args); // 内部调用了原来的方法

        // 此外还要对新增的内容进行观测
        let inserted;
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if(inserted) {
            this.__ob__.observeArray(inserted);
        }

        this.__ob__.dep.notify();

        return result;
    }
})