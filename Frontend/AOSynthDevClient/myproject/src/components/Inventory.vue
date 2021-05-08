<!-- Inventory Page -->
<template>
  <div class="slots py-3">
    <!-- include after 0 && userToken -->
    <div v-if="inventory.length >= 0 && userToken" class="container">
      <nav class="navbar navbar-expand-lg">
        <ul class="nav nav-tabs ml-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link text-dark"> <img src="../assets/home.svg" alt=""> Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inventory" class="nav-link text-dark active"> <img src="../assets/inventory.svg" alt=""> Inventory </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactions" class="nav-link text-dark"> <img src="../assets/transaction.svg" alt=""> Transactions</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customers" class="nav-link text-dark"> <img src="../assets/customer.svg" alt=""> Customers</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/suppliers" class="nav-link text-dark"> <img src="../assets/supplier.svg" alt=""> Suppliers</router-link>
          </li>
           <li class="nav-item">
            <router-link to="/reports" class="nav-link text-dark"> <img src="../assets/description.svg" alt=""> Reports</router-link>
          </li>
          <li class="nav-item">
           <button v-if="userToken" class="btn btn-danger" @click="logout()"><img src="../assets/logout.svg" alt=""> Log Out</button>
          </li>
        </ul>
      </nav>
      <div class="mb-4">
        <h1 class="display-3">INVENTORY</h1>
      </div>

      <b-row>
        <b-col md="4">
          <b-form-input v-model="filter" type="search" placeholder="Search here"></b-form-input>
          <br>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table hover :items="inventory" :filter="filter" :fields="fields" :per-page="perPage" :current-page="currentPage">
            <template v-slot:cell(Quantity)="data">
              {{data.item.Quantity_Produced}} {{data.item.Quantity_Produced_Type}}
            </template>
            <template v-slot:cell(actions)="data">
              <router-link 
                  class="d-inline p-2 btn btn-outline-success btn-sm btn-block" 
                  v-bind:to="{ name: 'ViewInventory', params: {selectedInventory: data.item, id: data.item.Batch_ID } }">
                  <img src="../assets/read.svg"/>
              </router-link>
              &nbsp;
              <router-link 
                  class="d-inline p-2 btn btn-outline-warning btn-sm btn-block" 
                  v-bind:to="{ name: 'UpdateInventory', params: {selectedInventory: data.item, id: data.item.Batch_ID } }">
                  <img src="../assets/update.svg"/>
              </router-link>
              &nbsp;
              <a 
              class="d-inline p-2 btn btn-outline-danger btn-sm btn-block" 
              @click="deleteInventory(data.item.Supp_Batch_ID)">
                  <img src="../assets/delete.svg"/>
              </a>
            </template>
          </b-table>
          <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">

          </b-pagination>
        </b-col>
      </b-row>
      <br>
      <!-- Button to add an item to the inventory -->
      <div class="row">
        <div class="col">
          <router-link
            class="btn btn-primary btn-sm btn-block"
            v-bind:to="{ name: 'AddInventory' }">
            <b>ADD</b>
          </router-link>
        </div>

        <!-- Button to go back to the homepage -->
        
      </div>
    </div>
    <!-- If the user is not logged in, take them back to the login page -->
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
import SlotService from "@/services/SlotService";
export default {
  name: "Inventory",
  data() {
    return {
      // inventory array holds all inventory records in the database
      inventory: [],
      // filter is used to allow people to search for anything on the table and filter the table based on it
      filter: "",
      // Allow only these columns, which are based off of the names in the database
      fields: ['Batch_ID', 'Compound', 'Purity', 'P_F_R', 'Quantity', 'actions'],
      // allow only 5 records per page
      perPage: 5,
      // start with page 1
      currentPage: 1
    };
  },
  mounted() {
    // execute the getSlots() function to fetch the list of inventory
    this.getSlots();
    // Tells that once page is loaded, this command will be executed
    // Tells that once page is loaded, this command will be executed
    // const newUser = this.$store.getters.getUser
    // this.user = newUser
    // console.log(this.user)
      // Test to print out the account id
      console.log("here is the acc_id: " + this.$store.getters.getUserID)
      // return this.$store.getters.getUser
 
  },
  
  computed: {
    // return whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    },
    // provide the total number of records that will then be used to create the amount of pages in pagination
    rows() {
      return this.inventory.length
    }
  },

  methods: {
    // retrieve all inventory from the database by communicating with the backend of the application
    async getSlots() {
      // Method to get all items in inventory
      // Retrieve all inventory and put it in a variable known as response
      var response = await SlotService.fetchInventory();
      // place the inventory records into the inventory array
      this.inventory = response.data;
    },

    // Method to delete the selected inventory
    async deleteInventory(slot) {
      //  Confirmation is done to prevent accidental deletions
        await this.$confirm("Warning", `Are you sure you want to delete this record? \n\n Doing so will remove the transactions associated with the inventory item.`, "warning").then(response => {
          // send a response to the backend to delete the selected Inventory through the ID passed
               SlotService.deleteInventory(slot).then(response => {
                 //  print out the response from the database (for testing)
                console.log(response.data);
                // alert that the record has been deleted
                this.$alert("Record has been deleted")
                // call the inventory from the database once again
                this.getSlots();              
                // console.log(this.inventory);
            }).catch(err=>{
              // print out an error that could occur when attempting to delete a record
            console.log(err)
            })
        }).catch(err => {
          // print out the error if the function cannot occur
            console.log(err)
        })
        // this.getSlots();
    },
    // allows the user to log out of the application and send them back to the login screen
    logout(){
      const token = null
      this.$store.commit('logout', {token})
      this.$router.push('/')
    },
   
  },
};
</script>
<style>
</style>
