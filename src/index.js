import "./index.css";
import {createApp} from 'vue';
import App from './App';
import storage from './plugins/storage'
import loadImage from './plugins/loadImage'
import reportWebVitals from './reportWebVitals';
createApp(App).use(storage).use(loadImage).mount('#root')

reportWebVitals();
