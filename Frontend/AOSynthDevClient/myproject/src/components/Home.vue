<template>
  <div class="container text-center">
    <!-- If the user is logged in, show the home page -->
    <div class="card mb-3" v-if="userToken">
      <div class="card-body">
        <h3 class="card-title display-3 mb-5">
          <!-- print out the employee logged in to acknowledge them -->
          Hello {{employeeName}}! <br>
          Welcome To <b>AOS</b><br />Inventory Managament System
        </h3>
        
        <div class="row">
          <!-- Inventory button -->
          <div class="col">
            <!-- inventory Button allows them to go to the inventory page -->
            <router-link
              class="btn btn-dark btn-block"
              v-bind:to="{ name: 'Inventory' }">
              <img src="../assets/inventory.svg"/> INVENTORY
            </router-link>
          </div>
          <!-- Transactions Button allows them to go to the transactions page -->
          <div class="col">
            <router-link
              class="btn btn-dark btn-block"
              v-bind:to="{ name: 'Transactions' }">
              <img src="../assets/transaction.svg"/> TRANSACTIONS
            </router-link>
          </div>
          <!-- Customers Button allows them to go to the transactions page -->
          <div class="col">
            <router-link
              class="btn btn-dark btn-block"
              v-bind:to="{ name: 'Customers' }">
              <img src="../assets/customer.svg"/> CUSTOMERS
            </router-link>
          </div>
        </div>
        <br>
        <div class="row">
          <!-- Suppliers Button allows users to go to the suppliers page -->
          <div class="col">
            <router-link
              class="btn btn-light btn-block"
              v-bind:to="{ name: 'Suppliers' }">
              <img src="../assets/supplier.svg"/> SUPPLIERS
            </router-link>
          </div>
          <!-- Reports Button allows users to go to the reports page -->
          <div class="col">
            <router-link
              class="btn btn-light btn-block"
              v-bind:to="{ name: 'Reports' }">
              <img src="../assets/description.svg"/> REPORTS
            </router-link>
          </div>
          <!-- Register Button allows users to go to the register page -->
          <div class="col">
            <router-link
              class="btn btn-light btn-block"
              v-bind:to="{ name: 'Register' }">
              <img src="../assets/register.svg"/> REGISTER
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- If the user is not logged in, prompt them to go back to the login page -->
    <div class="card mb-3" v-if="!userToken">
      <div class="card-body">
        <h3 class="card-title display-3 mb-5 text-center">
          Session Ended. <br>
          Please Sign In Again
        </h3>
        <div class="row">
          <div class="col">
            <router-link class="btn btn-dark btn-block" v-bind:to="{name: 'Login'}">
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// utilize the axios connections and provide the appropriate routes to the backend
import SlotService from "@/services/SlotService";
export default {
    name: "Home",
  data() {
    return {
      email: "",
      employeeName: null
    };
  },
  mounted() {
    // Tells that once page is loaded, this command will be executed
          // const newUser = this.$store.getters.getUser
          // this.user = newUser
          // console.log(this.user)
    
    // This is to test if the userToken functions as intended
    if (this.userToken==true) {
      const newUser = this.$store.getters.getUser
      this.user = newUser
      console.log(this.user);
    }
  },

  computed: {
    // Determine whether a user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },

  methods: {
    // allow the user to log out of the application if they click the log out button
     logout(){
      const token = null
      this.$store.commit('logout', {token})
      this.$router.push('/')
    },

    // Get the first and last name for an employee based on their Account ID, in order to display it
    // to the page
    async getEmployee(id) {
      const response = await SlotService.fetchEmployee(id)
      let name = response.data
      this.employeeName = name[0].First_Name + " " + name[0].Last_Name
    }
  },

  created() {
    // Execute the getEmployee function when the page loads in order to get the name of the employee
    // for the application
    this.getEmployee(this.$store.getters.getUserID)
  }
}
</script>

<style scoped>

</style>