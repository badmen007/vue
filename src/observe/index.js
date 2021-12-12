



class Observer{
    constructor(data) {
        this.walk(data);
    }

    walk(data){
        Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
    }
}

function defineReactive(data,key,value) {

    observe(value);  // 递归保证嵌套层级比较深的话  保证里面的属性能有响应式

    Object.defineProperty(data,key, {
        get(){
            return value;
        },
        set(newValue) {
            if(value == newValue) return;
            value = newValue;
        }
    })
}

export function observe(data) {

    if(typeof data !== 'object' || data == null) {
        return;
    }

    return new Observer(data)

}