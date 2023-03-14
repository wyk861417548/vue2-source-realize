// 使用观察者模式
// 1.我们可以给模板中的属性 增加一个收集器 dep
// 2.页面渲染的时候，我们将渲染逻辑封装在watcher中  vm._update(vm._render())
// 3.让dep记住这个watcher即可，稍后属性变化了可以找到对应的dep中存放的watcher进行重新渲染

import Dep from "./dep";

//1) 当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
//2) 当调用_render() 会进行取值操作 走到get上

let id = 0;
class Watcher{
  constructor(vm,fn,options){
    this.id = id++; //唯一标识
    this.vm = vm;  //当前视图实例
    this.renderWatcher  =options;  //true 标识是一个渲染watcher
    this.getter = fn; //视图初始化以及更新函数
    this.deps = [];  // 视图所对应属性对应的dep集合
    this.depId = new Set(); // 视图对应的dep的id集合
    this.get();
  }

  // 一个组件对应多个属性 每个组件上的重复属性只记录一次
  addDep(dep){
    if(!this.depId.has(dep.id)){
      this.deps.push(dep)
      this.depId.add(dep.id)

      dep.addSub(this) //属性的 dep 再记录当前 视图 wathcer 
    }
  }

  // 视图初始化
  get(){
    Dep.target = this; //视图渲染前，所有属性的Dep.target = 当前的视图watcher 
    this.getter();  //视图渲染
    Dep.target = null; 
  }

  // 视图更新
  update(){
    this.get()
  }
}

// （每个属性都有一个dep  watcher相当一个视图）
// 一个组件中 有多个属性（n个属性形成一个视图） n个dep对应一个watcher
// 一个属性对应着多个组件 1个dep对应着多个watcher 
// dep 和 watcher 多对多的关系

export default Watcher;