import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css';
import './assets/stylesheet.css';

Math.__proto__.lerp = function(a, b, t) {
    return a + (b - a) * t;
};

createApp(App).mount('#app')
