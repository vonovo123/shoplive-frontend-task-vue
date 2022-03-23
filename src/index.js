import "./index.css";
import {createApp} from 'vue';
import App from './App';
import storage from './plugins/storage'
import reportWebVitals from './reportWebVitals';
createApp(App).use(storage).mount('#root')

reportWebVitals();
