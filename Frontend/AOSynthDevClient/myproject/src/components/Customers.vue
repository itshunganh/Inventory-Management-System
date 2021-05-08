<!-- Transactions Page -->
<template>
  <div class="Customers py-3">
    <!-- So long as customers is more or equal to zero AND that the user is logged into the application, show the page -->
    <div v-if="customers.length >= 0 && userToken" class="container">
      <nav class="navbar navbar-expand-lg">
        <ul class="nav nav-tabs ml-auto">
          <li class="nav-item">
            <router-link to="/home" class="nav-link text-dark"> <img src="../assets/home.svg" alt=""> Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inventory" class="nav-link text-dark"> <img src="../assets/inventory.svg" alt=""> Inventory </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactions" class="nav-link text-dark"> <img src="../assets/transaction.svg" alt=""> Transactions</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/customers" class="nav-link text-dark active"> <img src="../assets/customer.svg" alt=""> Customers</router-link>
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
        <h1 class="display-3">CUSTOMERS</h1>
      </div>
      <b-row>
        <b-col md="4">
            <!-- Search bar to look through the customers table -->
            <b-form-input v-model="filter" type="search" placeholder="Search here"></b-form-input>
            <br>
        </b-col>
      </b-row>
      <b-row>
          <b-col>
              <!-- this is a dynamic table from bootstrap, which will allow users to display customers information based on a certain number of columns listed in the customers array -->
              <b-table hover :items="customers" :filter="filter" :fields="fields" :per-page="perPage" :current-page="currentPage">
                <!-- create an actions column to allow people to view, edit, and delete the row -->
                  <template v-slot:cell(actions)="data">
                    <!-- View the customer record -->
                      <router-link 
                        class="d-inline p-2 btn btn-outline-success btn-sm btn-block" 
                        v-bind:to="{ name: 'ViewCustomer', params: {selectedCustomer: data.item, id: data.item.Cust_ID } }">
                        <img src="../assets/read.svg"/>
                    </router-link>
                    &nbsp;
                    <!-- update the customer record -->
                    <router-link 
                        class="d-inline p-2 btn btn-outline-warning btn-sm btn-block" 
                        v-bind:to="{ name: 'UpdateCustomer', params: {selectedCustomer: data.item, id: data.item.Cust_ID } }">
                        <img src="../assets/update.svg"/>
                    </router-link>
                    &nbsp;
                    <!-- delete the customer record -->
                    <a 
                    class="d-inline p-2 btn btn-outline-danger btn-sm btn-block" 
                    @click="deleteCustomer(data.item.Cust_ID)">
                        <img src="../assets/delete.svg"/>
                    </a>
                  </template>
              </b-table>
              <!-- pagination allows to see multiple records through pages without worrying about it filling up the entire page -->
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">

              </b-pagination>
          </b-col>
      </b-row>
      <br />
      <div class="row">
        <div class="col">
          <!-- button to add a new customer and take users to the add customer form -->
          <router-link
            class="btn btn-primary btn-sm btn-block"
            v-bind:to="{ name: 'AddCustomer' }">
            <b>ADD</b>
          </router-link>
        </div>
        
      </div>
    </div>

    <!-- If there is no usertoken, take the user back to the login screen -->
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
// Utilize the file that will contact the axios function to communicate with the backend
import SlotService from "@/services/SlotService";
export default {
  name: "Customers",
  data() {
    return {
      // customers array holds all customer records in the database
      customers: [],
      // filter is used to allow people to search for anything on the table and filter the table based on it
      filter: "",
      // Allow only these columns, which are based off of the names in the database
      fields: ['Cust_Name', 'Phone_No', 'Email', 'Zip_Code', 'actions'],
      // allow only 5 records per page
      perPage: 5,
      // start with page 1
      currentPage: 1
    };
  },
  mounted() {
    // execute the getCustomers() function to fetch the list of customers
    this.getCustomers();
    // Tells that once page is loaded, this command will be executed
          // const newUser = this.$store.getters.getUser
          // this.user = newUser
          // console.log(this.user)

    
  },
  computed: {
    // return whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    },
    // provide the total number of records that will then be used to create the amount of pages in pagination
    rows() {
      return this.customers.length
    }
  },

  //Methods for CRUD operationsd
  methods: {
    // retrieve all customers from the database by communicating with the backend of the application
    async getCustomers() {
      // wait for the axios method to retrieve all customers from the database (which will communicate with the backend application to do so)
      var response = await SlotService.fetchCustomers()
      // catch if there is an error in the retrieval of customer data from the database
      .catch((error) => this.$alert(error.response.data));
      // place the customers retrieved from the database onto the customers array
      this.customers = response.data;
    },
    // async deleteCustomer(id) {
    //   const $this = this;
    //   $thisd
    //     .$swal({
    //       title: "Are you sure?",
    //       text: "You won't be abled to revert this!",
    //       type: "warning",
    //       showCancelButton: true,
    //       confirmButtonText: "Yes, delete it!",
    //       cancelButtonText: "No, I changed my mind.",
    //     })
    //     .then(function (e) {
    //       if (e.value === true) {
    //         SlotService.deleteCustomer(id);
    //         $this.$router.push({ path: "Customers" });
    //       } else {
    //         e.dismiss;
    //       }
    //       e.preventDefault();
    //     });
    // },
    // This function will help to delete the customer from the table and from the database
       async deleteCustomer(id) {
        //  Confirmation is done to prevent accidental deletions
        this.$confirm("Are you sure you want to delete this record?").then(response => {
          // send a response to the backend to delete the customer
               SlotService.deleteCustomer(id).then(response => {
                //  print out the response from the database (for testing)
                console.log(response.data);
                // alert that the record has been deleted
                this.$alert("Record has been deleted")
                // call the customers from the database once again
                this.getCustomers();     
            }).catch(err=>{
              // print out an error that could occur when attempting to delete a record
              this.$alert("Error!", "This Customer cannot be deleted as it is involved in one or more transactions. Please delete the transactions before deleting the Customer.", "error")
            })
        }).catch(err => {
          // print out the error if the function cannot occur
              this.$alert("Error!", "This Customer cannot be deleted as it is involved in one or more transactions. Please delete the transactions before deleting the Customer.", "error")
        })
               
    },
    // allows the user to log out of the application and send them back to the login screen
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
