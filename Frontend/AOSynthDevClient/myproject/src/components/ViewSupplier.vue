<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">VIEW</h1>
    
    <!-- start of the form -->
    <!-- if the user is logged in, show the form to them -->
    <div v-if="userToken">
      <form class="py-3">
        <b>
          <!-- View the supplier name -->
          <div class="form-group" id="supplier_group">
            <label for="cas_no">Supplier Name</label>
            <input
              type="text"
              class="form-control"
              name="cust_name"
              placeholder="Enter the name of the Supplier"
              v-model="form.supplier"
              readonly/>
          </div>
          <!-- view the phone number -->
          <div class="form-group" id="phone_no_group">
            <label for="phone_no">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phone_no"
              placeholder="Enter the Supplier's Phone Number"
              v-model="form.phone_no"
              readonly
              pattern="[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}"/>
          </div>
          <!-- view the supplier email -->
          <div class="form-group" id="email_group">
            <label for="email">Email</label>
            <input
              type="text"
              class="form-control"
              name="email"
              placeholder="Enter the Supplier's Email"
              v-model="form.email"
              readonly/>
          </div>
          <!-- view the supplier city -->
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
              readonly/>
          </div>
          <!-- view the supplier state -->
          <div class="form-group" id="state_name_group">
            <label for="state_name">State Name</label>
            <input
              type="text"
              class="form-control"
              name="state_name"
              placeholder="Enter the Supplier's State"
              v-model="form.state_name"
              readonly/>
          </div>
          <!-- view the supplier zip code -->
          <div class="form-group" id="zip_code_group">
            <label for="zip_code">Zip Code</label>
            <input
              type="number"
              class="form-control"
              name="zip_code"
              placeholder="Enter the Supplier's Zip Code"
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
            <div class="col">
              <!-- users can only return back to the supplier page -->
              <router-link to="/suppliers" class="btn btn-secondary btn-sm btn-block">
                RETURN
              </router-link>
            </div>
          </div>
          
        </b>
      </form>
    </div>
    <!-- if the user is not logged in, send them back to the login page -->
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
  name: "ViewSupplier",
  data() {
    return {
      // prepopulate the form with the selected Supplier
      form: {
        supplier: this.$route.params.selectedSupplier.Supplier,
        phone_no: this.$route.params.selectedSupplier.Phone_No,
        email: this.$route.params.selectedSupplier.Email,
        city_name: this.$route.params.selectedSupplier.City_Name,
        state_name: this.$route.params.selectedSupplier.State_Name,
        zip_code: this.$route.params.selectedSupplier.Zip_Code
      },
    };
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    // async updateSupplier() {
    //   console.log(JSON.stringify(this.form));
      
    //   await SlotService.updateSupplier({  
    //     newSupplier: this.form
    //   });

    //   this.$swal("Great!", `Your customer has been added!`, "success");
    //   this.$router.push({ name: "Suppliers" });
    //   this.$router.go({ path: "/suppliers" });
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