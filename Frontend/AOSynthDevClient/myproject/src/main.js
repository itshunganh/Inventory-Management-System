import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import VueSweetalert2 from 'vue-sweetalert2'
// Format Dates
import {store} from './store/store'
import moment from 'moment'
import { VuejsDatatableFactory } from 'vuejs-datatable'
import VueSimpleAlert from "vue-simple-alert"
import Vuelidate from 'vuelidate'
// import json2csv from 'json2csv'


// Vue.use(json2csv)
Vue.use(Vuelidate)
Vue.use(VueSimpleAlert)
Vue.use( VuejsDatatableFactory );
Vue.use(BootstrapVue);
// Vue.use(VueSweetalert2);
Vue.config.productionTip = false

// Filter dates to be formatted into yyyy-MM-dd
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('yyyy-MM-dd')
  }
})

new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created() {
    // if (performance.navigation.type == 1) {
    //   if (confirm('Reload site? Changes will not be saved and you will be redirected')) {
    //     this.$router.push({name: 'Login'})
    //   } else {
    //     this.$router.push({name: 'Login'})
    //   }
    // }
    // var self = this;
    // window.onbeforeunload = function(e) {
    //   if (self.$route.path !== '/login') {
    //     e = e || window.event
    //     // old browsers
    //     if (e) {e.returnValue = 'Reload the page? Session will be lost and relogin will be required.';}
    //     return 'Reload the page? Session will be lost and relogin will be required.';
    //   } else {
    //     return null;
    //   }
    // }
    // if (performance.navigation.type == 1) {
    //   if (this.$route.path !== '/login') {
    //     this.$router.push({name: 'Login'})
    //   } else {
    //     console.log('reload page without redirect')
    //   }
    // }
  }
})
