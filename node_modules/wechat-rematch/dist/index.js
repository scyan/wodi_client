
let innerStore={}

function createStore(config){
  
  let models = config.models
  let store={
    models: models,
    views:[],
    getState: ()=>{
      let states = {}   
      Object.keys(models).map((key) => {
        states[key] = models[key].state
      })
      return states
    },
    dispatch:{}
  }
  function trigger(){
    let rootState = store.getState()
    store.views.map((viewWrap)=>{
      let {view,mapStateToData} = viewWrap;
      
      let data = mapStateToData(rootState)
      view.trigger(data)
    })
  }
  let rootState = store.getState();
  
  Object.keys(models).map((key)=>{
    let model = models[key];
    let state = model.state;
    let reducers = model.reducers;
    let effects = model.effects(store.dispatch);
    store.dispatch[key] = {}
    for(let func in reducers){
      let fn = reducers[func];
      
      store.dispatch[key][func] = (payload)=>{
        model.state = fn(state,payload)
        trigger();
      }
    }
    for(let func in effects){
      let fn = effects[func];
      
      store.dispatch[key][func] =  (payload) => {
         fn(payload,rootState)
        // trigger();
      }
    }
    
  })
  innerStore = store
  return store
}
function Provider(store){
  
  return (appObj)=>{
    appObj.store = store
    
    return appObj
  }
}


function connect(mapStateToData,mapDispatchToPage){

  return function(pageConfig){
    let _onLoad = pageConfig.onLoad
    function onLoad(options) {
      //只能通过onLoad来获取真正的this
      pageConfig.trigger = (data)=>{
        this.setData(data)
      }
      _onLoad && _onLoad.call(this,options)
      
    }
    Object.assign(pageConfig,{onLoad})
    let store = innerStore;
    
    let data = mapStateToData(store.getState())
    store.views.push({ view: pageConfig, mapStateToData})
    Object.assign(pageConfig.data,data)
    pageConfig.dispatch = store.dispatch

    return pageConfig
  }
}
module.exports={
  Provider: Provider,
  connect: connect,
  createStore: createStore
}