
const strats = {};
const LIFECYCLE = [
    'beforeCreate',
    'created'
]

LIFECYCLE.forEach(hook => {
    //  {} {created:function(){}}   => {created:[fn]}
    // {created:[fn]}  {created:function(){}} => {created:[fn,fn]}
    starts[hook] = function(p, c) {
        if(c){
            if(p){
                return p.concat(c);
            }else{
                return [c];
            }
        }else{
            return p;  // 如果儿子没有则用父亲即可
        }
    }
})

export function mergeOptions(parent, child) {
    const options = {};
    for(let key in parent) {
        mergeField(key);
    }

    for(let key in child) {
        if(!child.hasOwnProperty(key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        //策略模式
        if(starts[key]) {
            options[key] = starts[key](parent[key], child[key])
        } else {
            //如果不在策略中则以儿子为主
            options[key] = child[key] || parent[key]
        }

    }

    return options;
}