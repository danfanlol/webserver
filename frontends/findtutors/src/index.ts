import { createApp } from 'vue'
import Root from './Root.vue'


const mount = (container: string | Element) => createApp(Root).mount(container);
export default mount;
