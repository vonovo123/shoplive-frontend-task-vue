export default {
  install(app){
    app.config.globalProperties.$setStorage = (key, value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    app.config.globalProperties.$getStorage = (key) =>{
      return JSON.parse(window.localStorage.getItem(key));
    }
  }

}