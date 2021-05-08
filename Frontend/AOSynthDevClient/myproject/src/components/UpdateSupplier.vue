<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">UPDATE</h1>
    
    <!-- start of the form -->
    <div v-if="userToken"> <!-- v-if checks if the user has userToken, and hides the form if not-->
      <form class="py-3">
        <b>
          <!-- Input for supplier name-->
          <div class="form-group" id="supplier_group">
            <label for="cas_no">Supplier Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Supplier"
              v-model="form.supplier"
              required/>
              <!-- Validation for supplier name  -->
              <span v-if="!$v.form.supplier.required && $v.form.supplier.$dirty" class="text-danger">Supplier Name is required!</span> <br>
          </div>
          <!-- Input for phone number-->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Supplier's Phone Number"
              maxlength="15"
              v-model="form.phone_no"
              required/>
          </div>
          <!-- Enter the email-->
          <div class="form-group" id="email_group">
            <label for="email">Email</label>
            <input
              type="email"
              class="form-control"
              name="email"
              placeholder="Enter the Supplier's Email"
              v-model="form.email"
              required/>
              <span v-if="!$v.form.email.email && $v.form.email.$dirty" class="text-danger">Please enter a valid email.</span> <br>
            <!-- Input for city name -->
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
              placeholder="Enter the Supplier's City"
              v-model="form.city_name"
              required/>
          </div>
          <!-- Input for state name-->
          <div class="form-group" id="state_name_group">
            <label for="state_name">State Name</label>
            <input
              type="text"
              class="form-control"
              name="state_name"
              placeholder="Enter the Supplier's State"
              v-model="form.state_name"
              required/>
              <!-- validation for state name  -->

          </div>
          <!-- Provide information on the purity of the chemical compound -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="text"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Supplier's Zip Code"
              v-model="form.zip_code"
              required/>
              <!-- Validation for zip code  -->
              <span v-if="!$v.form.zip_code.maxLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span> 
        <span v-if="!$v.form.zip_code.minLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span>
        <span v-if="!$v.form.zip_code.numeric && $v.form.zip_code.$dirty" class="text-danger">Zip Code can only contain numeric numbers</span>
          </div>
          
          <div class="row">
            <div class="col">
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()"> -->
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSlot"> -->
              <!-- Button that triggers the update supplier function to update suppliers -->
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="updateSupplier()">SUBMIT</button>
                <!-- SUBMIT -->
              <!-- </router-link> -->
            </div>
            <div class="col">
              <router-link to="/suppliers" class="btn btn-secondary btn-sm btn-block">
                RETURN
              </router-link>
            </div>
          </div>
          
        </b>
      </form>
    </div>
  <!-- Validates if user is logged in or has refresh the page, which would cause user to not have a token. If so, tells user to relogin. -->
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
import {required, minLength, maxLength, numeric, email, alpha} from 'vuelidate/lib/validators'
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "UpdateSupplier",
  data() {
    return {
      // form that contains inputs for suppliers
      // form is prepopulated with the selected supplier record
      form: {
        supplier: this.$route.params.selectedSupplier.Supplier,
        phone_no: this.$route.params.selectedSupplier.Phone_No,
        email: this.$route.params.selectedSupplier.Email,
        city_name: this.$route.params.selectedSupplier.City_Name,
        state_name: this.$route.params.selectedSupplier.State_Name,
        zip_code: this.$route.params.selectedSupplier.Zip_Code,
        supp_id: this.$route.params.selectedSupplier.Supp_ID
      },
    };
    
  },
  //vulidate validations for specific items on form
  validations:{
    form:{
      zip_code: {numeric, minLength: minLength(5), maxLength: maxLength(5)},
      supplier: {required},
      email: {email}
    },
    
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    //function to update suppliers
    async updateSupplier() {
      //if v.invalid is used to check wether the user has entered the right input.
       this.$v.$touch();
            if(!this.$v.$invalid){
      console.log(JSON.stringify(this.form));
      //sends form information to backend to be stored in database
      await SlotService.updateSupplier({  
        updatedSupplier: this.form
      
      });
            

      //notification to notify that supplier info has updated and takes user back to supplier page
    this.$alert("Success! Your Supplier information has been updated!").then(response => {
      this.$router.push({ name: "Suppliers" });
    
    })
            }
      
    //   this.$router.go({ path: "/suppliers" });
    },
  },

  computed: {
    // check to see if the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },
  created() {
  },
};
</script>

<style>
</style>