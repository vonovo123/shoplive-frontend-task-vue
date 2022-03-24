export default {
  install(app){
    app.config.globalProperties.$loadImage = (src) => {
      return new Promise((resolve, reject) => {
          const img = document.createElement('img');
          img.src = src;
          img.addEventListener('load',(event) => {
            resolve();
          })
          img.addEventListener('error',(event) => {
            reject('error');
          })
      })
    }
  }

}