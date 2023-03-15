import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'
import "primevue/resources/themes/saga-blue/theme.css"
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css"
import vComponents from "@/components/misc"
import ToastService from "primevue/toastservice"

const app = createApp(App)

// add components from "misc"
vComponents.forEach(component => {
	app.component(component.name, component)
})

app.use(store).use(router).use(PrimeVue).use(ToastService)
app.mount('#app')
