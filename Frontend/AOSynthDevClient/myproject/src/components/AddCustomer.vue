<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">ADD</h1>
    
    <!-- start of the form -->
    <!-- If the user is known to be logged in, display the form to add a customer -->
    <div v-if="userToken">
      <form class="py-3">
        <b>
          <!-- Enter the name of the Customer -->
          <div class="form-group" id="cust_name_group">
            <label for="cust_name">Customer Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Customer"
              v-model="form.cust_name"
              required/>
              <span v-if="!$v.form.cust_name.required && $v.form.cust_name.$dirty" class="text-danger">Name is required!</span> <br>
            
          </div>
          <!-- Enter the customer's phone number; utilize a number pattern to ensure that the number is entered as expected -->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Customer's Phone Number"
              v-model="form.phone_no"
              maxlength="15"
              required
              pattern="[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}"/>
          </div>
          <!-- Enter the customer's email -->
          <div class="form-group" id="email_group">
            <label for="email">Email</label>
            <input
              type="email"
              class="form-control"
              name="email"
              placeholder="Enter the Customer's Email"
              v-model="form.email"
              required/>
              <span v-if="!$v.form.email.email && $v.form.email.$dirty" class="text-danger">Please enter a valid email.</span> <br>
          </div>
          <!-- Enter the customer's city location -->
          <div class="form-group" id="city_name_group">
            <label for="city_name">City Name</label>
              <input
              type="text"
              class="form-control"
              name="city_name"
              placeholder="Enter the Customer's City"
              v-model="form.city_name"
              required/>
          </div>
          <!-- Enter the customer's state location -->
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
          <!-- Enter the customer's zip code for their location -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="number"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Customer's Zip Code"
              v-model="form.zip_code"
              required/>
              <!-- Validation for zip code -->
              <span v-if="!$v.form.zip_code.maxLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span> 
              <span v-if="!$v.form.zip_code.minLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span>
              <span v-if="!$v.form.zip_code.numeric && $v.form.zip_code.$dirty" class="text-danger">Zip Code can only contain numeric numbers</span>
          </div>
          <br>
          <div class="row">
            <div class="col">
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()"> -->
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSlot"> -->

              <!-- Prevent the form from committing actions after a submit and instead follow the steps that we created through the addCustomer() method -->
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addCustomer()">SUBMIT</button>
                <!-- SUBMIT -->
              <!-- </router-link> -->
            </div>
            <div class="col">
              <!-- When a person wants to cancel data entry and wants to return to the customers page, create a link to route them back with a style of a button -->
              <router-link to="/customers" class="btn btn-secondary btn-sm btn-block">
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
import {minLength, maxLength, required, email, numeric, alpha} from 'vuelidate/lib/validators'
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "AddCustomer",
  data() {
    return {
      // Send out the form data to become a JSON object
      form: {
        cust_name: null,
        phone_no: null,
        email: null,
        city_name: null,
        state_name: null,
        zip_code: null
      },
    };
  },
  // This is used to validate the form entry itself
  validations:{
    form:{
      cust_name:{required},
      email:{email},
      zip_code:{numeric, minLength: minLength(5), maxLength: maxLength(5)}
    }
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    async addCustomer() {
      console.log(JSON.stringify(this.form));
      
        this.$v.$touch();
            if(!this.$v.$invalid){
      await SlotService.addCustomer({  
        newCustomer: this.form
      }).then((result)=>{
        //notify if successful and push to customers table
      this.$alert("Success! Your Customer information has been added!").then( response =>{this.$router.push({ name: "Customers" })
      })})
      .catch((error) => {
        //print out an error message through an alert if there is an issue from the back end.
        this.$alert(error.response.data)
      });
            }
    },
    
  },

  computed: {
    // Used to retrieve whether there is a user logged in to the application or not by retrieving the information from the store.js
    userToken() {
      return this.$store.getters.getUser
    }
  },

  created() {

  }
};
</script>

<style>
</style>