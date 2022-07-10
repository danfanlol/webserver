import { createApp, ExtractPropTypes } from 'vue'
import Root from './Root.vue'

const mount = (container: string | Element, rootProps: ExtractPropTypes<typeof Root>) =>
		createApp(Root, rootProps).mount(container);
export default mount;
