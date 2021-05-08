<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">VIEW</h1>
    
    <!-- start of the form -->
    <!-- if the user is logged in, show the form to them -->
    <div v-if="userToken">
      <form class="py-3">
        <b>
          <!-- Enter the name of the customer -->
          <div class="form-group" id="cust_name_group">
            <label for="cas_no">Customer Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Customer"
              v-model="form.cust_name"
              readonly/>
          </div>
          <!-- Enter the phone number of the customer -->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Customer's Phone Number"
              v-model="form.phone_no"
              readonly/>
          </div>
          <!-- Enter the email of the customer -->
          <div class="form-group" id="email_group">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              name="email"
              placeholder="Enter the Customer's Email"
              v-model="form.email"
              readonly/>
          </div>
          <!-- enter the customer's city -->
          <div class="form-group" id="city_name_group">
            <label for="city_name">City Name</label>
              <!-- <b-form-select
                id="supplier"
                class="form-control"
                text="Select a Supplier"
                v-model="form.cust_name"
                :options="supplierSelection"
                required>
              </b-form-select> -->
              <input
              type="text"
              class="form-control"
              name="city_name"
              placeholder="Enter the Customer's City"
              v-model="form.city_name"
              readonly/>
          </div>
          <!-- Enter the customer's state -->
          <div class="form-group" id="state_name_group">
            <label for="state_name">State Name</label>
            <input
              type="text"
              class="form-control"
              name="state_name"
              placeholder="Enter Customer's State"
              v-model="form.state_name"
              readonly/>
          </div>
          <!-- Provide information on the customer's zip code -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="number"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Customer's Zip Code"
              v-model="form.zip_code"
              readonly/>
          </div>
        
          <div class="row">
            <!-- <div class="col">
              <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()">
              <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSlot">
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addCustomer()">SUBMIT</button>
                SUBMIT
              </router-link>
            </div> -->
            <!-- user can only go back to the customers table -->
            <div class="col">
              <router-link to="/customers" class="btn btn-secondary btn-sm btn-block">
                RETURN
              </router-link>
            </div>
          </div>
          
        </b>
      </form>
    </div>

    <!-- if the user is not logged in, reroute them to the login page -->
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
// SlotServices is the axios methods
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "ViewCustomer",
  data() {
    return {
      // prepopulate the form with the selected customer
      form: {
        cust_name: this.$route.params.selectedCustomer.Cust_Name,
        phone_no: this.$route.params.selectedCustomer.Phone_No,
        email: this.$route.params.selectedCustomer.Email,
        city_name: this.$route.params.selectedCustomer.City_Name,
        state_name: this.$route.params.selectedCustomer.State_Name,
        zip_code: this.$route.params.selectedCustomer.Zip_Code
      },
    };
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    // async addCustomer() {
    //   console.log(JSON.stringify(this.form));
      
    //   await SlotService.addCustomer({  
    //     newCustomer: this.form
    //   });

    //   this.$swal("Great!", `Your customer has been added!`, "success");
    //   this.$router.push({ name: "Customers" });
    //   this.$router.go({ path: "/customers" });
    // },
  },

  computed: {
    // determine whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },
  // filters: {
  //   moment: function(date) {
  //     return moment(date).format('yyyy-MM-dd');
  //   }
  // },
  created() {
    // this.supplierSelection.push({text: "Select a Supplier", value: null, disabled: true})
    // axios.get('https://aosynth-inv-api.herokuapp.com/suppliers').then(response => {
    //   // console.log(JSON.stringify(response.data));
    //   this.suppliers = response.data;
    //   this.suppliers.forEach((supplier, index, suppliersArray) => {
    //     let supplierSelectionOptions = {
    //       value: supplier.Supp_ID,
    //       text: supplier.Supplier
    //     }
    //     this.supplierSelection.push(supplierSelectionOptions)
    //   })
    //   console.log(JSON.stringify(this.supplierSelection))
    // })
  }
};
</script>

<style>
</style>