<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">UPDATE</h1>
    
    <!-- start of the form -->
    <!-- show the form if the user is logged in to the session -->
    <div v-if="userToken">
    <!-- <div> -->
      <form class="py-3">
        <b>
          <!--Update CAS_No Info -->
          <div class="form-group" id="cas_no_group">
            <label for="cas_no">CAS #</label>
            <input
              type="text"
              class="form-control"
              name="cas_no"
              placeholder="Enter the CAS No"
              v-model="form.cas_no"
              readonly/>
          </div>

          <div class="form-group">
            <label for="batch_id">Batch ID</label>
            <input
              type="text"
              class="form-control"
              name="batch_id"
              placeholder="Enter the Batch ID"
              v-model="form.batch_id"
              readonly/>
          </div>
          <div class="form-group">
            <label for="supp_batch_id">Supplier Batch ID</label>
            <input 
              type="text"
              class="form-control"
              name="supp_batch_id"
              placeholder="Enter Supplier Batch ID"
              v-model="form.supp_batch_id"
              readonly/>
          </div>
          <div class="form-group" id="supplier_group">
            <label for="supplier">Supplier</label>
            <!-- <p>Last Selected Supplier: {{this.$route.params.selectedInventory.Supplier}}</p> -->
              <b-form-select
              id="supplier"
              class="form-control"
              text="Select a Supplier"
              v-model="form.supp_id"
              :options="supplierSelection"
              required>
              </b-form-select>
              <!-- <select v-model="form.supplier" class="form-control">
                <option v-for="supplier in suppliers" v-bind:value="supplier.Supp_ID" :key="supplier.Supp_ID" :default="supplier.Supplier">
                  {{supplier.Supplier}}
                </option>
              </select> -->
          </div>
          <div class="form-group">
            <label for="compound_name">Compound Name</label>
            <input
              type="text"
              class="form-control"
              name="compound_name"
              placeholder="Enter INFO #3"
              v-model="form.compound_name"
              required/>
          </div>
          <div class="form-group">
            <label for="purity">Purity</label>
            <input
              type="text"
              class="form-control"
              name="purity"
              placeholder="Enter Purity State"
              v-model="form.purity"
              required/>
          </div>
          <div class="form-group">
            <label for="p_f_r">Pass/Fail/Reject</label>
            <b-form-select
            id="p_f_r"
            class="form-control"
            text="Select whether the compound passed (P), failed (F), or was rejected (R)"
            v-model="form.p_f_r"
            :options="P_F_R_selection"
            required>
            </b-form-select>
          </div>
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              placeholder="Enter the Quantity"
              v-model="form.quantity"
              required
              step=".00"
              min="0"/>
              <b-form-invalid-feedback :state="quantity_validation">
                Please enter a quantity
              </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="quantity_produced_type">Quantity Type</label>
            <b-form-select
              type="number"
              class="form-control"
              name="quantity_produced_type"
              placeholder="Select the Quantity Type"
              :options="quantity_produced_type"
              v-model="form.quantity_produced_type"
              required>
              </b-form-select>
          </div>
          <div class="form-group">
            <label for="obtainment_date">Obtainment Date</label>
            <input
              type="date"
              class="form-control"
              name="obtainment_date"
              v-model="form.obtainment_date"
              required/>
              <!-- Need to remove time section -->
          </div>
          <div class="form-group">
            <label for="documented_date">Documented Date</label>
            <input
              type="date"
              class="form-control"
              name="documented_date"
              v-model="form.documented_date"
              required/>
          <!-- Need to remove time section -->

          </div>
          <div class="form-group">
            <label for="notes">Notes</label>
            <!-- <input
              type="textarea"
              class="form-control"
              name="notes"
              placeholder="Enter additional notes"
              v-model="notes"
              rows="10"
              required/> -->
              <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="10"
              class="form-control"
              v-model="form.notes"
              placeholder="Enter additonal notes about this compound"></textarea>
          </div>
        
          <div class="row">
            <div class="col">
              <!-- <button class="btn btn-primary btn-sm btn-block" @click="addSlot">
                SUBMIT
              </button> -->
              <!-- instead of having the form do a default submission, have it instead execute the updateInventory() method -->
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="updateInventory()">SUBMIT</button>
          
            </div>
            <div class="col">
              <!-- <a class="btn btn-secondary btn-sm btn-block" href="/inventory" role="button">
              RETURN
              </a> -->
              <router-link to="/inventory" class="btn btn-secondary btn-sm btn-block">
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
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "UpdateInventory",
  data() {
    return {
      // fname: "",
      // lname: "",
      // phone: "",
      // date: "",
      // time: "",
      // prepopulate the inventory form with the selected inventory record
      form: {
        cas_no: this.$route.params.selectedInventory.CAS_No,
        batch_id: this.$route.params.selectedInventory.Batch_ID,
        supp_batch_id: this.$route.params.selectedInventory.Supp_Batch_ID,
        supp_id: this.$route.params.selectedInventory.Supp_ID,
        // supp_city: null,
        // supp_state: null,
        // supp_zip_code: null,
        compound_name: this.$route.params.selectedInventory.Compound,
        purity: this.$route.params.selectedInventory.Purity,
        p_f_r: this.$route.params.selectedInventory.P_F_R,
        quantity: this.$route.params.selectedInventory.Quantity_Produced,
        quantity_produced_type: this.$route.params.selectedInventory.Quantity_Produced_Type,
        obtainment_date: this.$route.params.selectedInventory.Obtainment_Date,
        documented_date: this.$route.params.selectedInventory.Documented_Date,
        notes: this.$route.params.selectedInventory.Notes,
        acc_id: null
      },
      // form: {},
      // form: [],
      selectedInventory: [],
      // hold all suppliers from the database
      suppliers: [],
      // show the id and text
      supplierSelection: [{text: "Select a Supplier", value: null, disabled: true}],
      // have a default selection for P/F/R and measurement types
      P_F_R_selection: [{text: "Select whether the compound passed (P), failed (F), or was rejected (R)", value: null, disabled: true}, 'P', 'F', 'R'],
      quantity_produced_type: [{text: "Select the quantity type", value: null, disabled: true}, {value: 'mg', text: 'Milligrams (mg)'}, {value: 'g', text: 'Grams (g)'}, {value: 'kg', text: 'Killograms (kg)'}, {value: 'mL', text: 'Milliliters (mL)'}, {value: 'L', text: 'Liters (L)'}]
    };
  },
  methods: {
    // async getInventoryItem(id) {
    //   // Method to get specific details about an items in inventory
    //   const response = await SlotService.fetchInventoryItem(id);
    //   this.form = response.data;
    // },
    // This method, when executed, will send an axios request to update the inventory, and then if successful,
    // print the alert saying that the inventory information was updated and send them back to the inventory page,
    // and if there is an error, print out that the inventory could not be updated at the moment
    async updateInventory() {
      this.form.acc_id = this.$store.getters.getUserID
      await SlotService.updateInventory({newInventory: this.form}).then((result)=>{
      this.$alert("Great!", `Your Inventory information has been updated!`, "success").then( response =>{this.$router.push({ name: "Inventory" })
      })})
      .catch((error) => {
        this.$alert("Could not update inventory. Please try again.")
      });
      // this.$swal("Great!", `Your inventory item has been added!`, "success");
      // this.$alert("Success! Your Inventory item has been updated!").then(response => {
      //   this.$router.push({ name: "Inventory" });
      // })
      // this.$alert("Success! Your Inventory item has been updated!").then(() => {
      //   this.$router.push({name: "Inventory"})
      // })

      // this.$alert("Great!", `Your Inventory information has been added!`, "success").then( response =>{
      // this.$router.push({ name: "Inventory" });

      // })
      
      
      // this.$router.go({ path: "/Inventory" });
    },
  },
  created() {
    // retrieve suppliers from axios and place the response in the suppliers array, which will be iterated and placed
    // in a variable known as supplierSelectionOption, which will take only the value of supplier ID and text of supplier
    // so that a user can read the selections as the supplier name, but the database will get the value of the ID,
    // which will be easier to p;lace in the database, and then place it in the supplierSelection array.
    axios.get('https://aosynth-inv-api.herokuapp.com/suppliers').then(response => {
      // console.log(JSON.stringify(response.data));
      console.log(this.$route.params.selectedInventory);
      console.log(this.$route.params.selectedInventory.Supplier);
      this.suppliers = response.data;
      this.suppliers.forEach((supplier, index, suppliersArray) => {
        let supplierSelectionOptions = {
          value: supplier.Supp_ID,
          text: supplier.Supplier
        }
        this.supplierSelection.push(supplierSelectionOptions)
      })
      // this is to test and make sure supplierSelection is populated
      console.log(JSON.stringify(this.supplierSelection))
    })
  },

  computed:{
    // check to make sure if user is logged in
    userToken() {
      return this.$store.getters.getUser
    },
  // validate to make sure the quantity is greater than or equal to 0
    quantity_validation(){
      return this.form.quantity_shipped >= 0
    }
  }
};
</script>
<style>
</style>

