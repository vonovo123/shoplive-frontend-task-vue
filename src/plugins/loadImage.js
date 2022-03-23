export default {
  install(app){
    app.config.globalProperties.$loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;
        img.addEventListener('load', (_) => {
          // 완료
          console.log(_);
          resolve();
        })
      })
    }
  }

}