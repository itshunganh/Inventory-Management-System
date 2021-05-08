<template>
  <div class="slots py-3">
    <!-- include after 0 && userToken -->
    <div v-if="userToken" class="container">
      <nav class="navbar navbar-expand-lg">
        <!-- nav bar -->
        <ul class="nav nav-tabs ml-auto">
          <!-- create a navigation bar that has tabs for routes throughout the application -->
          <li class="nav-item">
            <!-- route to the home page -->
            <router-link to="/home" class="nav-link text-dark"> <img src="../assets/home.svg" alt=""> Home</router-link>
          </li>
          <li class="nav-item">
            <!-- route to the inventory page -->
            <router-link to="/inventory" class="nav-link text-dark"> <img src="../assets/inventory.svg" alt=""> Inventory </router-link>
          </li>
          <li class="nav-item">
            <!-- route to the transactions page -->
            <router-link to="/transactions" class="nav-link text-dark"> <img src="../assets/transaction.svg" alt=""> Transactions</router-link>
          </li>
          <li class="nav-item">
            <!-- route to the customers page -->
            <router-link to="/customers" class="nav-link text-dark"> <img src="../assets/customer.svg" alt=""> Customers</router-link>
          </li>
          <li class="nav-item">
            <!-- route to the suppliers page -->
            <router-link to="/suppliers" class="nav-link text-dark"> <img src="../assets/supplier.svg" alt=""> Suppliers</router-link>
          </li>
           <li class="nav-item">
             <!-- route to the reports page -->
            <router-link to="/reports" class="nav-link text-dark active"> <img src="../assets/description.svg" alt=""> Reports</router-link>
          </li>
          <li class="nav-item">
            <!-- let the user log out and head back to the login form -->
           <button v-if="userToken" class="btn btn-danger" @click="logout()"><img src="../assets/logout.svg" alt=""> Log Out</button>
          </li>
        </ul>
      </nav>
      <div class="mb-4">
        <h1 class="display-3">REPORTS</h1>
      </div>

      <div class="card">
        <div class="card-header">
          PLEASE ENTER YOUR EMAIL TO RECEIVE REPORTS
        </div>
        <div class="card-body">
          <!-- enter the email you want to send a report to -->
          <div class="form-group">
            <label for="cas_no"><h5>EMAIL</h5></label>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text"><img src="../assets/email.svg"/></span>
              </div>
            <input type="text" class="form-control" name="cas_no" placeholder="Enter your email" v-model="email">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <!-- execute a function to generate a report for transactions and send in the email -->
              <a class="btn btn-sm btn-primary btn-block" @click="getTransactions(email)">Transactions</a>
            </div>
            <div class="col">
              <!-- execute a function to generate a report for products and send in the email -->
              <a class="btn btn-sm btn-primary btn-block" @click="getProducts(email)">Products</a>
            </div>
            <div class="col">
              <!-- execute a function to generate a report for customers and send in the email -->
              <a class="btn btn-sm btn-primary btn-block" @click="getCustomers(email)">Customers</a>
            </div>
            
          </div>
          <!-- <div class="row">
              <div class="col">
              <!-- execute a function to generate a report for customers and send in the email -->
              <!-- <a class="btn btn-sm btn-primary btn-block" @click="getCustomersCSV">Customers</a> -->
            <!-- </div> --> 
           <!-- </div> -->
        </div>
      </div>
    </div>

    <!-- if the user is not logged in, prompt the user back to the login screen -->
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

// import axios from 'axios'

// import {Parser} from 'json2csv';
// import fs from 'file-system';

import SlotService from "@/services/SlotService";
export default {
    name: 'Reports',
     mounted() {
    
    // Tells that once page is loaded, this command will be executed
          const newUser = this.$store.getters.getUser
          this.user = newUser
          console.log(this.user)

  },
    data(){
        return{
      //  user is not filled out
            user: {
              
              token: null
            },
            status: null ,
            // input email to send the report
            email: null
        }
    },

 //Getters for token
  computed:{
    // determien whether the user is logged in or not
    userToken(){
      return this.$store.getters.getUser
    }
  },
  methods: {

    
    // Send an axios request to get the customer reports and then send a success alert if it is executed correctly,
    // otherwise send back an error
    async getCustomers(email) {
      await SlotService.getCustomerReports(email).then(result => {
        this.$alert("Success!", "Your email has been sent!")
      }).catch(error => {
        this.$alert(error.response.data)
      })
    },
    // Send an axios request to get the transactions reports and then send a success alert if it is executed correctly,
    // otherwise send back an error
    async getTransactions(email) {
      await SlotService.getTransactionReports(email).then(result => {
        this.$alert("Success!", "Your email has been sent!")
      }).catch(error => {
        this.$alert(error.response.data)
      })
    },
    // Send an axios request to get the products reports and then send a success alert if it is executed correctly,
    // otherwise send back an error
    async getProducts(email) {
      await SlotService.getProductReports(email).then(result => {
        this.$alert("Success!", "Your email has been sent!")
      }).catch(error => {
        this.$alert(error.response.data)
      })
    },
   
    // async getCustomersCSV(){
    //   await SlotService.getCustomersCSV().then(result => {
    //     const fields = [
    //     {label: 'Customer Name', value: 'Cust_Name'},
    //     {label: 'Email', value: 'Email'},
    //     {label: 'Phone Number', value: 'Phone_No'},
    //     {label: 'State Name', value: 'State_Name'},
    //     {label: 'City Name', value: 'City_name'},
    //     {label: 'Zip Code', value: 'Zip_Code'}];
    //     const json2csvParser = new Parser({fields});
    //     const csv = json2csvParser.parse(result.data);
    //     console.log(csv);



        
        

      //   JSON2CSV({data:result, fields:["Cust_Name", "Email", "Phone_No", "State_Name", "City_Name", "Zip_Code"]},
      //   fs.writeFile('test.csv', csv, function(err){
      //     if (err) throw err;
      //       console.log('file saved')
      //   })
      // })
      // })

      
    // },
    
      //"Could not send the email. Please try again."
      // reroute the user to the login screen and log them out of the system
    logout() {
      const token = null
      this.$store.commit('logout', {token})
      this.$router.push('/')
    },

  },

 
}
</script>