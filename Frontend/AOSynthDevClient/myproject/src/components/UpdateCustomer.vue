<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">UPDATE</h1>
    
    <!-- start of the form -->
    <!-- so long as the user is logged in, they can see this form and can update the fields that are shown below -->
    <div v-if="userToken">
      <form class="py-3">
        <b>
          <!-- Enter CAS_No -->
          <div class="form-group" id="cust_name_group">
            <label for="cas_no">Customer Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Customer"
              v-model="form.cust_name"
              required/>
              <span v-if="!$v.form.cust_name.required && $v.form.cust_name.$dirty" class="text-danger">Name is required!</span> <br>
          </div>
          <!-- Enter the batch ID -->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Customer's Phone Number"
              maxlength="15"
              v-model="form.phone_no"
              required/>
    
          </div>
          <!-- Enter the supplier ID -->
          <div class="form-group" id="email_group">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              name="email"
              placeholder="Enter the Customer's Email"
              v-model="form.email"
              required/>
                <span v-if="!$v.form.email.email && $v.form.email.$dirty" class="text-danger">Please enter a valid email.</span> <br>
          </div>
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
              required/>
            
          </div>
          <!-- Enter the name of the compound -->
          <div class="form-group" id="state_name_group">
            <label for="state_name">State Name</label>
            <input
              type="text"
              class="form-control"
              name="state_name"
              placeholder="Enter Customer's State"
              v-model="form.state_name"
              required/>
          </div>
          <!-- Provide information on the purity of the chemical compound -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="number"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Customer's Zip Code"
              v-model="form.zip_code"
              required/>
              <!-- provide validations to ensure zip codes are at least and at max 5 characters long, and can only include numbers -->
              <span v-if="!$v.form.zip_code.maxLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span> 
              <span v-if="!$v.form.zip_code.minLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span>
              <span v-if="!$v.form.zip_code.numeric && $v.form.zip_code.$dirty" class="text-danger">Zip Code can only contain numeric numbers</span>
          </div>
        
          <div class="row">
            <div class="col">
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()"> -->
              <!-- <router-link to="/customers" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="updateCustomer">
                SUBMIT
              </router-link> -->
              <!-- when clicking submit, instead of letting the form do its default function, have it execute the updateCustomer() function -->
              <router-link to="/home"><button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="updateCustomer()">SUBMIT</button></router-link>
              
            </div>
            <div class="col">
              <!-- Otherwise, allow the user to return back to the customers page -->
              <router-link to="/customers" class="btn btn-secondary btn-sm btn-block">
                RETURN
              </router-link>
            </div>
              <!-- <button type="submit" class="btn btn-primary btn-sm btn-block" >Update</button>
              <button type="submit" class="btn btn-secondary btn-sm btn-block" @click="$router.push('/customers')">Back</button> -->
          </div>
          
        </b>
      </form>
    </div>

    <!-- if the user is not logged in, reroute them back to the login page -->
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
// bring in the validator library to complete validation
import {minLength, maxLength, required, email, numeric, alpha} from 'vuelidate/lib/validators'
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "UpdateCustomer",
  data() {
    return {
      // this form will be prepopulated with the selected customer record
      form: {
        cust_name: this.$route.params.selectedCustomer.Cust_Name,
        phone_no: this.$route.params.selectedCustomer.Phone_No,
        email: this.$route.params.selectedCustomer.Email,
        city_name: this.$route.params.selectedCustomer.City_Name,
        state_name: this.$route.params.selectedCustomer.State_Name,
        zip_code: this.$route.params.selectedCustomer.Zip_Code,
        cust_id: this.$route.params.selectedCustomer.Cust_ID
      },
    };
  },
  // validation will be used to ensure the inputs are done as intended
  validations:{
    form:{
      cust_name:{required},
      email:{email},
      zip_code:{numeric, minLength: minLength(5), maxLength: maxLength(5)},
    }
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    async updateCustomer() {
      // Check to make sure everything is properly validated and there is no validation errors; if so, send an axios
      // request to update the customer information and send a success alert if that works if it does and take the user
      // back to the customers page
      this.$v.$touch();
            if(!this.$v.$invalid){
      await SlotService.updateCustomer({newCustomer: this.form});
    //   this.$swal("Great!", `Your customer information has been updated!`, "success");
    this.$alert("Success! Your Customer information has been updated!").then(response => {
        this.$router.push({name: "Customers"})
    })
            }
    //   this.$router.push({ name: "Customers" });
    //   this.$router.go({ path: "/customers" });
    
    },
  },

  computed: {
    // determine if the user is logged in or not
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