<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">ADD</h1>
    
    <!-- start of the form -->
    <div v-if="userToken">
      <form class="py-3 needs-validation" novalidate>
        <b>
          <!-- Supplier input-->
          <!-- Enter the name of the Supplier -->
          <div class="form-group" id="supplier_group">
            <label for="cas_no">Supplier Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Supplier"
              v-model="form.supplier"
              required/>
              <span v-if="!$v.form.supplier.required && $v.form.supplier.$dirty" class="text-danger">Supplier Name is required!</span> <br>
              <b-form-invalid-feedback :state="supplier_validation">
                Please enter a supplier
              </b-form-invalid-feedback>
              
          </div>
          <!-- Input for Supplier phone number -->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="tel"
              pattern="^\d{4}-\d{3}-\d{4}$"
              maxlength="15"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Supplier's Phone Number"
              v-model="form.phone_no"
              required/>
          </div>
          <!-- Input for Supplier email -->
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

          </div>
          <!-- Input for Supplier city name -->
          <div class="form-group" id="city_name_group">
            <label for="city_name">City Name</label>
              <input
              type="text"
              class="form-control"
              name="city_name"
              placeholder="Enter the Supplier's City"
              v-model="form.city_name"
              required/>
          </div>
          <!-- Enter the name of the Supplier's state -->
          <div class="form-group" id="state_name_group">
            <label for="state_name">State Name</label>
            <input
              type="text"
              class="form-control"
              name="state_name"
              placeholder="Enter the Supplier's State"
              v-model="form.state_name"
              required/>

          </div>
          <!-- Enter in the Zip Code of the Supplier -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="text"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Supplier's Zip Code"
              v-model="form.zip_code"
              required/>
    <!-- Validation for zip code input (to ensure minimum and maximum of the zipcode are 5 and that it only contains numbers) -->
        <span v-if="!$v.form.zip_code.maxLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span> 
        <span v-if="!$v.form.zip_code.minLength && $v.form.zip_code.$dirty" class="text-danger">Zip Code must contain at 5 numeric characters</span>
        <span v-if="!$v.form.zip_code.numeric && $v.form.zip_code.$dirty" class="text-danger">Zip Code can only contain numeric numbers</span>
              
          </div>
          <br>
          <div class="row">
            <div class="col">
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()"> -->
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSlot"> -->

              <!-- Tell the form to complete the addSupplier() method instead of executing its basic functions -->
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSupplier()">SUBMIT</button>
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
    
        <!-- Check if user has a token. If not, tells user to sign in. -->
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
import SlotService from "@/services/SlotService";
export default {
  name: "AddSupplier",
  data() {
    return {
      //a form object containing inputs for all required fields in the inputs
      form: {
        supplier: null,
        phone_no: null,
        email: null,
        city_name: null,
        state_name: null,
        zip_code: null
      },
    }
  },
  //used for vulidate validations on specific form inputs.
  validations:{
    form:{
      zip_code: {numeric, minLength: minLength(5), maxLength: maxLength(5)},
      supplier: {required},
      email: {email}
    }
  },
  
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    async addSupplier() {
      //If statement validates if all the tables are filled in correctly before submitting.
       this.$v.$touch();
            if(!this.$v.$invalid){
      //function that uses the slotservice to add a supplier
      await SlotService.addSupplier({  
        newSupplier: this.form
      }).then((result)=>{
      this.$alert("Success! Your Supplier information has been added!").then( response =>{this.$router.push({ name: "Suppliers" })
      })})
      .catch((error) => {
        this.$alert(error.response.data)
      });

      // this.$swal("Great!", `Your Supplier has been added!`, "success");
    
      
      // this.$router.go({ path: "/suppliers" });
    }
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
  },

  computed: {
    userToken() {
        //gets input from store.js
      return this.$store.getters.getUser
    }
  }
};
</script>

<style>
</style>