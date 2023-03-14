import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
  constructor(data){
    //新增属性__ob__ 为了数组能够使用 observeArray 去观测新增的数据
    Object.defineProperty(data,'__ob__',{
      value:this,
      enumerable:false
    })

    // 如果是数组就不再一个个劫持  太浪费性能了 (数组劫持的核心，就是重写数组的方法，对新增的属性进行判断和观测)
    if(Array.isArray(data)){
      // 对数组7个变异方法进行重写
      data.__proto__ = newArrayProto

      // 如果数组中放的是对象，检测其变化
      this.observeArray(data);
    }else{
       // Object.defineProperty 只能劫持已经存在的属性（vue里面会为此单独写一些api $set $delete）
      this.walk(data);
    }
  }

  // 循环对象依次进行劫持
  walk(data){
    // “重新定义” 属性 因此vue2性能会有点差
    Object.keys(data).forEach(key=>{defineReactive(data,key,data[key])})
  }

  // 观测数组 对数组中的对象进行劫持
  observeArray(data){
    data.forEach(item=>{observe(item)})
  }
}

function defineReactive(target,key,value){
  // 如果值是对象再次进行劫持
  observe(value);

  let dep = new Dep();
  console.log(key,dep.id);

  Object.defineProperty(target,key,{
    get(){
      console.log('获取',key);
      console.log('dep--------',dep);
      console.log('Dep.target',Dep.target);
      // Dep.target存在代表执行了视图渲染方法_update
      if(Dep.target){
        dep.depend()
      }

      return value;
    },
    
    set(newVal){
      console.log('设置');
      if(newVal === value)return;

      observe(newVal) // 用户给新值重新赋值对象，需要再次代理

      value = newVal

      // 通知重新渲染页面
      dep.notify()
    }
  })
}

export function observe(data){
  // 只对对象进行劫持
  if(typeof data != 'object' || data == null)return;

  // 若果一个对象被劫持过了，那就不需要再被劫持了（要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断是否被劫持过）
  return new Observer(data)
}