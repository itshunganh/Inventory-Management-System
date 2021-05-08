<template>
<!-- View specific inventory item page -->
  <div class="addslot container">
    <h1 class="display-3 mt-5">VIEW</h1>
    
    <!-- start of the form -->
    <!-- if the user is logged in, show the form to them -->
    <div v-if="userToken">
    <!-- <div> -->
      <form class="py-3">
        <b>
          <!--CAS_No Info -->
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
          <!-- Batch ID info -->
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
              <!-- Supplier Batch ID -->
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
              readonly
              disabled>
              </b-form-select>
              <!-- <select v-model="form.supplier" class="form-control">
                <option v-for="supplier in suppliers" v-bind:value="supplier.Supp_ID" :key="supplier.Supp_ID" :default="supplier.Supplier">
                  {{supplier.Supplier}}
                </option>
              </select> -->
          </div>
          <div class="form-group">
            <!-- Compound Name info -->
            <label for="compound_name">Compound Name</label>
            <input
              type="text"
              class="form-control"
              name="compound_name"
              placeholder="Enter INFO #3"
              v-model="form.compound_name"
              readonly/>
          </div>
          <div class="form-group">
            <!-- Purity info -->
            <label for="purity">Purity</label>
            <input
              type="text"
              class="form-control"
              name="purity"
              placeholder="Enter Purity State"
              v-model="form.purity"
              readonly/>
          </div>
          <div class="form-group">
            <!-- Pass fail info -->
            <label for="p_f_r">Pass/Fail/Reject</label>
            <!-- <b-form-select
              id="p_f_r"
              class="form-control"
              text="Select whether the compound passed (P), failed (F), or was rejected (R)"
              v-model="form.p_f_r"
              :options="p_f_r"
              readonly/> -->
              <input 
              type="text"
              v-model="form.p_f_r"
              class="form-control"
              readonly>
          </div>

          <!-- Inventory Quantity info -->
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              placeholder="Enter the Quantity"
              v-model="form.quantity"
              readonly/>
          </div>

          <div class="form-group">
            <!-- Pass fail info -->
            <label for="p_f_r">Quantity Type</label>
            <b-form-select
              id="quantity_produced_type"
              class="form-control"
              text="Select whether the compound passed (P), failed (F), or was rejected (R)"
              v-model="form.quantity_produced_type"
              :options="quantity_produced_type"
              readonly
              disabled/>
              <!-- <input 
              type="text"
              v-model="form.quantity_produced_type"
              class="form-control"
              readonly> -->
          </div>


          <!-- Date inventory was obtained info -->
          <div class="form-group">
            <label for="obtainment_date">Obtainment Date</label>
            <input
              type="date"
              class="form-control"
              name="obtainment_date"
              v-model="form.obtainment_date"
              readonly/>
          </div>
          <!-- Documented date  -->
          <div class="form-group">
            <label for="documented_date">Documented Date</label>
            <input
              type="date"
              class="form-control"
              name="documented_date"
              v-model="form.documented_date"
              readonly/>
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
              placeholder="Enter additonal notes about this compound"
              v-model="form.notes"
              readonly>
              </textarea>
          </div>
          <!-- show who created the inventory record -->
          <div class="form-group">
            <!-- Pass fail info -->
            <label for="created_by">Created By:</label>
            <!-- <b-form-select
              id="p_f_r"
              class="form-control"
              text="Select whether the compound passed (P), failed (F), or was rejected (R)"
              v-model="form.p_f_r"
              :options="p_f_r"
              readonly/> -->
              <input 
              type="text"
              v-model="form.created_by"
              class="form-control"
              readonly>
          </div>
        
          <div class="row">
              <!-- <div class="col"> -->
                  <!-- <button class="btn btn-primary btn-sm btn-block" @click="addSlot">
                  SUBMIT
                  </button> -->
                  <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot">
                  SUBMIT
                  </router-link> -->
              <!-- </div> -->
              <div class="col">
                  <!-- <a class="btn btn-secondary btn-sm btn-block" href="/inventory" role="button">
                  RETURN
                  </a> -->

                <!-- Go back to the inventory page-->
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
  name: "ViewInventory",
  data() {
    return {
      
      
      // fname: "",
      // lname: "",
      // phone: "",
      // date: "",
      // time: "",
      // prepopulate the form with the selected inventory
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
        created_by: null
      },
      // {
      //   batch_id: '',
      //   supp_batch_id: '',
      //   compound_name: '',
      //   purity: '',
      //   p_f_r: null,
      //   quantity: '',
      //   obtainment_date: '',
      //   documented_date: '',
      //   notes: ''
      // }
      selectedInventory: [],
      suppliers: [],
      supplierSelection: [{text: "Select a Supplier", value: null, disabled: true}],
      p_f_r: [{text: "Select whether the compound passed (P), failed (F), or was rejected (R)", value: null, disabled: true}, 'P', 'F', 'R'],
      quantity_produced_type: [{text: "Select the quantity type", value: null, disabled: true}, {value: 'mg', text: 'Milligrams (mg)'}, {value: 'g', text: 'Grams (g)'}, {value: 'kg', text: 'Killograms (kg)'}, {value: 'mL', text: 'Milliliters (mL)'}, {value: 'L', text: 'Liters (L)'}],
      employee: null
    };
  },
  //Methods for CRUD operations
  methods: {
    // get the first and last name of the person who made the form and display it to the bottom
    async getEmployee(id) {
      const response = await SlotService.fetchEmployee(id)
      let name = response.data
      this.form.created_by = name[0].First_Name + " " + name[0].Last_Name
      // console.log("Employee name:" + this.employee)
    },
    // async getInventoryItem(id) {
    //   // Method to get specific details about an items in inventory
    //   const response = await SlotService.fetchInventoryItem(id);
    //   this.form = response.data;
    //   console.log(this.form[0].Batch_ID);
    // },


    // async addSlot() {
    //   await SlotService.addSlot({
    //     
    //     fname: this.fname,
    //     lname: this.lname,
    //     phone: this.phone,
    //     date: this.date,
    //     time: this.time,
    //   });
    //   this.$swal("Great!", `Your slot has been added!`, "success");
    //   this.$router.push({ name: "Slots" });
    //   this.$router.go({ path: "/" });
    // },

    // retrieve suppliers from axios and place the response in the suppliers array, which will be iterated and placed
    // in a variable known as supplierSelectionOption, which will take only the value of supplier ID and text of supplier
    // so that a user can read the selections as the supplier name, but the database will get the value of the ID,
    // which will be easier to p;lace in the database, and then place it in the supplierSelection array.
    async getSuppliers() {
      // get suppliers function
      const response = await SlotService.fetchSuppliers();
      this.suppliers = response.data
      this.suppliers.forEach((supplier, index, suppliersArray) => {
        let supplierSelectionOptions = {
          value: supplier.Supp_ID,
          text: supplier.Supplier
        }
        this.supplierSelection.push(supplierSelectionOptions)
      })
    }
  },

  computed: {
    // determine whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },

  created(){
    // retrieve the id based on what was saved from the batches table, as that identifies
    // who recorded the inventory.
    this.getEmployee(this.$route.params.selectedInventory.Acc_ID)
    // axios.get('https://aosynth-inv-api.herokuapp.com/suppliers').then(response => {
    //   // console.log(JSON.stringify(response.data));
    //   console.log(this.$route.params.selectedInventory);
    //   console.log(this.$route.params.selectedInventory.Supplier);
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
    this.getSuppliers()
  }
};
</script>
<style>
</style>

