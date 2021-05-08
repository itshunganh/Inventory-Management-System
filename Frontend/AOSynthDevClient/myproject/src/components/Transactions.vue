<!-- Transactions Page -->
<template>
  <div class="Transactions py-3">
    <!-- include after 0 && userToken -->
    <!-- Make sure that the length of the transactions array greater than or equal to 0 and that the user is logged in -->
    <div v-if="transactions.length >= 0 && userToken" class="container">
      <nav class="navbar navbar-expand-lg">
        <ul class="nav nav-tabs ml-auto">
            <!-- have a navigation bar that would take users to the appropriate page, as well as have an active tab
            to let the user know which page they are in -->
          <li class="nav-item">
            <router-link to="/home" class="nav-link text-dark"> <img src="../assets/home.svg" alt=""> Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inventory" class="nav-link text-dark"> <img src="../assets/inventory.svg" alt=""> Inventory </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactions" class="nav-link text-dark active"> <img src="../assets/transaction.svg" alt=""> Transactions</router-link>
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
        <h1 class="display-3">TRANSACTIONS</h1>
      </div>
    

      <b-row>
        <!-- use the search bar to filter the table out -->
        <b-col md="4">
          <b-form-input v-model="filter" type="search" placeholder="Search here"></b-form-input>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col>
          <!-- have a bootstrap table to filter out the data easily -->
          <b-table hover :items="transactions" :filter="filter" :fields="fields" :per-page="perPage" :current-page="currentPage">
            <!-- with the quantity_shipped column, show the quantity shipped and add in the measurement type next to it -->
            <template v-slot:cell(Quantity_Shipped)="data">
              {{data.item.Quantity_Shipped}} {{data.item.Quantity_Produced_Type}}
            </template>
            <!-- for total amount, print out the dollar sign and the total amount -->
            <template v-slot:cell(Total_Amount)="data">
              ${{data.item.Total_Amount}}
            </template>
            <!-- for item reserve, pull out the quantity shipped and the measurement type as well, since the application
            will add or subtract to the current amount in inventory and replace the old quantity with the new one -->
            <template v-slot:cell(Item_Reserve)="data">
              <!-- <span v-if="data.item.Trans_Type ==='Sell'">
                {{data.item.Quantity_Produced - data.item.Quantity_Shipped}}
              </span>
              <span v-if="data.item.Trans_Type ==='Buy'">
                {{data.item.Quantity_Produced + data.item.Quantity_Shipped}}
              </span> -->
              <span>{{data.item.Quantity_Produced}} {{data.item.Quantity_Produced_Type}}</span>
            </template>
            <!-- for the actions have the view, edit, and delete buttons for each record row -->
            <template v-slot:cell(actions)="data">
              <router-link 
                  class="d-inline p-2 btn btn-outline-success btn-sm btn-block" 
                  v-bind:to="{ name: 'ViewTransaction', params: {selectedTransaction: data.item, id: data.item.Trans_ID } }">
                  <img src="../assets/read.svg"/>
              </router-link>
              &nbsp;
              <router-link 
                  class="d-inline p-2 btn btn-outline-warning btn-sm btn-block" 
                  v-bind:to="{ name: 'UpdateTransaction', params: {selectedTransaction: data.item, id: data.item.Trans_ID } }">
                  <img src="../assets/update.svg"/>
              </router-link>
              &nbsp;
              <a 
              class="d-inline p-2 btn btn-outline-danger btn-sm btn-block" 
              @click="deleteTransaction(data.item.Trans_ID)">
                  <img src="../assets/delete.svg"/>
              </a>
            </template>
          </b-table>
          <!-- use pagination to separate the records into pages for easier reading -->
          <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">

          </b-pagination>
        </b-col>
      </b-row>
      <br />
      <!-- have a button to add a transaction into the database -->
      <div class="row">
        <div class="col">
          <router-link
            class="btn btn-primary btn-sm btn-block"
            v-bind:to="{ name: 'AddTransaction' }">
            <b>ADD</b>
          </router-link>
        </div>
       
      </div>
    </div>

    <!-- If the user is not logged in, reroute the user back to the sign in page -->
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
  name: "Transactions",
  data() {
    return {
      // get the transactions from the database
      transactions: [],
      // allow the user to filter the table based on what they entered and what is in the table as a whole
      filter: "",
      // enter the columns based on the names in the database and display it to the table
      fields: ['Order_No', 'Supplier', 'Compound', 'Quantity_Shipped', 'Item_Reserve', 'Total_Amount', 'Tracking_Link', 'actions'],
      // how many records will be on a page (5)
      perPage: 5,
      // start with page 1
      currentPage: 1
    };
  },
  mounted() {
    this.getTransactions();
    // Tells that once page is loaded, this command will be executed
          const newUser = this.$store.getters.getUser
          this.user = newUser
          console.log(this.user)

  },
  computed: {
    // determine whether the user was logged in or not
    userToken() {
      return this.$store.getters.getUser
    },
    // get the total number of records in the transactions array to correctly create the pagination
    rows() {
      return this.transactions.length
    }
  },

  //Methods for CRUD operations
  methods: {
    // use the axios request to get all transactions in the database and place it in the transactions array
    async getTransactions() {
      var response = await SlotService.getTransactions();
      this.transactions = response.data;
    },

    // delete a transaction by first having a confirmation to ensure there are minimal accidental deletions, then
    // take the transaction id of the transaction and delete it from teh database, sending an alert that it was successful
    // or printing out the error in the console
    async deleteTransaction(id) {
      
        await this.$confirm("Are you sure you want to delete this record?").then(response => {
               SlotService.deleteTransaction(id).then(response => {
                console.log(response.data);
                this.getTransactions();
                this.$alert("Record has been deleted")              
            }).catch(err=>{
              this.$alert(err.response.data)
            })
        }).catch(err => {
              this.$alert(err.response.data)
        })
    },
    // when the user clicks the log out button, they will be redirected to the login screen and the session is cut out
    // for them
    logout(){
      const token = null
      this.$store.commit('logout', {token})
      this.$router.push('/')
    }

  },
};
</script>
<style>
</style>
