import { createApp } from 'vue'
import App from './App.vue'


const mount = (container: string | Element) => createApp(App).mount(container);
export default mount;
