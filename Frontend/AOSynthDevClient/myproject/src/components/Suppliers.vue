<!-- Suppliers Page -->
<template>
  <div class="Customers py-3">
    <!-- check and make sure if suppliers array is greater than or equal to 0 and if the user is logged in -->
    <div v-if="suppliers.length >= 0 && userToken" class="container">
      <nav class="navbar navbar-expand-lg">
        <ul class="nav nav-tabs ml-auto">
          <!-- have a navigation route to go to the selected page, as well as indicate which page the user is in -->
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
            <router-link to="/customers" class="nav-link text-dark"> <img src="../assets/customer.svg" alt=""> Customers</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/suppliers" class="nav-link text-dark active"> <img src="../assets/supplier.svg" alt=""> Suppliers</router-link>
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
        <h1 class="display-3">SUPPLIERS</h1>
      </div>

      <!-- Searchable table -->
      <b-row>
        <!-- Search bar used to filter the table correctly based on the data that exists on all columns -->
          <b-col md="4">
              <b-form-input v-model="filter" type="search" placeholder="Search here"></b-form-input>
              <br>
          </b-col>
      </b-row>
      <b-row>
          <b-col>
            <!-- create a table to hold all the data -->
              <b-table hover :items="suppliers" :filter="filter" :fields="fields" :per-page="perPage" :current-page="currentPage">
                  <!-- create the actions to show the view, edit, and delete functions -->
                  <template v-slot:cell(actions)="data">
                      <router-link 
                          class="d-inline p-2 btn btn-outline-success btn-sm btn-block" 
                          v-bind:to="{ name: 'ViewSupplier', params: {selectedSupplier: data.item, id: data.item.Supp_ID } }">
                          <img src="../assets/read.svg"/>
                      </router-link>
                      &nbsp;
                      <router-link 
                          class="d-inline p-2 btn btn-outline-warning btn-sm btn-block" 
                          v-bind:to="{ name: 'UpdateSupplier', params: {selectedSupplier: data.item, id: data.item.Supp_ID } }">
                          <img src="../assets/update.svg"/>
                      </router-link>
                      &nbsp;
                      <a
                      class="d-inline p-2 btn btn-outline-danger btn-sm btn-block" 
                      @click="deleteSupplier(data.item.Supp_ID)">
                          <img src="../assets/delete.svg"/>
                      </a>
                      <!-- <b-button variant="danger" @click="deleteSupplier(data.item.Supp_ID)">Delete</b-button> -->
                  </template>
              </b-table>
              <!-- create pagination to distribute the data evenly across all pages -->
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
              </b-pagination>
          </b-col>
      </b-row>
    
      <!-- create a button to allow users to add a supplier and go to the add supplier form -->
      <br />
      <div class="row">
        <div class="col">
          <router-link
            class="btn btn-primary btn-sm btn-block"
            v-bind:to="{ name: 'AddSupplier' }">
            <b>ADD</b>
          </router-link>
        </div>
      
      </div>
    </div>

    <!-- If the user is not logged in, reroute them to the login page -->
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
  name: "Suppliers",
  data() {
    return {
      // suppliers array holds the list of suppliers from the database
      suppliers: [],
      // search bar is used to filter the data in the table
      filter: "",
      // array is not used other than for testing
      newSuppliers: [],
      // use the fields with names from the database to populate the table
      fields: ['Supplier', 'Phone_No', 'Email', 'Zip_Code', 'actions'],
      // allow 5 records per page
      perPage: 5,
      // start at page 1
      currentPage: 1
    };
  },
  mounted() {
    // execute the getSuppliers() function
    this.getSuppliers();
    // this.sortSuppliers(suppliers);
 
    // Tells that once page is loaded, this command will be executed
        //   const newUser = this.$store.getters.getUser
        //   this.user = newUser
        //   console.log(this.user)
  
  },

  computed: {
    // determine whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    },
    // return the number of rows for suppliers in order to create the right number of pages
    rows() {
      return this.suppliers.length
    }
  },

  //Methods for CRUD operationsd
  methods: {
    // retrieve the suppliers in the database and send it to the suppliers array
    async getSuppliers() {
      const response = await SlotService.fetchSuppliers();
      this.suppliers = response.data;
    },
    // log the user out of the application when clicked on 
    logout(){
      const token = null
      this.$store.commit('logout', {token})
      this.$router.push('/')
    },

    
    // sortSuppliers(suppliers) {
    //     let newSuppliers = [];
    //     // this.suppliers.forEach(supplier in suppliers) {
    //     //     newSuppliers.push(supplier.Cust_Name, supplier.Phone_No, supplier.Email, supplier.Zip_Code)
    //     // }
    //     for (let i = 0; i < this.suppliers.length; i++) {
    //         newSuppliers.push(supplier.Cust_Name, supplier.Phone_No, supplier.Email, supplier.Zip_Code)
    //     }
    // },

    // delete the supplier from the database
    async deleteSupplier(id) {
    //     console.log(id)
    //   const $this = this;
    //   $this
    //     .$swal({
    //       title: "Are you sure?",
    //       text: "You won't be able to revert this!",
    //       type: "warning",
    //       showCancelButton: true,
    //       confirmButtonText: "Yes, delete it!",
    //       cancelButtonText: "No, I changed my mind.",
    //     })
    //     .then(function (e) {
    //       if (e.value === true) {
    //         SlotService.deleteSupplier(id);
    //         // $this.$router.path({path: "Suppliers"})
    //         // this.$swal("Great!", `Your Supplier has been deleted!`, "success");
    //         // $this.$router.push({ name: "Suppliers" });
    //       } else {
    //         e.dismiss;
    //       }
    //     //   e.preventDefault();
    //     });
    // have a confirmation to make sure the record wants to be deleted, and if so, delete the supplier
    // by passing the appropriate supplier_id and then alert that the record has been deleted and recall the
    // getSuppliers() method
        this.$confirm("Are you sure you want to delete this record?").then(response => {
                SlotService.deleteSupplier(id).then(response => {
                console.log(response.data);
                this.$alert("Record has been deleted")
                this.getSuppliers();
            }).catch(err=>{
              // if there is an error in deleting the record, print out the error
              // this.$alert(err.response.data)
              this.$alert("Error!", "This Supplier cannot be deleted as it is involved in one or more transactions. Please delete the transactions before deleting the Supplier.", "error")

            })
        }).catch(err => {
          // if there is an error in the confirmation, print out the error
            this.$alert(err.response.data)
        })
    },
  },
};
</script>
<style>
</style>