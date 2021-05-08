<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">ADD</h1>
    
    <!-- start of the form -->
    <!-- v-if does not work as intended -->
    <div v-if="userToken">
      <form class="py-3">
        <b>
          <!-- Enter CAS Number for hte product -->
          <div class="form-group" id="cas_no_group">
            <label for="cas_no">CAS #</label>
            <input
              type="text"
              class="form-control"
              name="cas_no"
              placeholder="Enter the CAS No"
              v-model="form.cas_no"
              required/>
          </div>
          <!-- Enter the Batch ID associated with the product -->
          <div class="form-group" id="batch_id_group">
            <label for="batch_id">Batch ID</label>
            <input
              type="text"
              class="form-control"
              name="batch_id"
              placeholder="Enter the Batch ID (ex: AOS-0-000)"
              v-model="form.batch_id"
              required/>
              <!-- Provide a validation message that will inform users to fill out this information -->
              <b-form-invalid-feedback :state="batch_id_validation">
                Please enter a batch number
              </b-form-invalid-feedback>
          </div>
          <!-- Enter the Batch ID associated to the Supplier -->
          <div class="form-group" id="supp_batch_id_group">
            <label for="supp_batch_id">Supplier Batch ID</label>
            <input
              type="text"
              class="form-control"
              name="supp_batch_id"
              placeholder="Enter the Supplier ID"
              v-model="form.supp_batch_id"
              required/>
              <!-- Provide a validation message that will inform users to fill out this information -->
              <b-form-invalid-feedback :state="supp_batch_id_validation">
                Please enter a Supplier Batch ID
              </b-form-invalid-feedback>
          </div>
          <!-- Select from a list of suppliers retrieved from the Suppliers table -->
          <div class="form-group" id="supplier_group">
            <label for="supplier">Supplier</label>
              <b-form-select
                id="supplier"
                class="form-control"
                text="Select a Supplier"
                v-model="form.supp_id"
                :options="supplierSelection"
                required>
              </b-form-select>
          </div>
          <!-- Enter the name of the chemical product -->
          <div class="form-group" id="compound_name_group">
            <label for="compound_name">Chemical Compound Name</label>
            <input
              type="text"
              class="form-control"
              name="compound_name"
              placeholder="Enter Chemical Compound Name"
              v-model="form.compound_name"
              required/>
          </div>
          <!-- Provide information on the purity of the chemical compound -->
          <div class="form-group" id="purity_group">
            <label for="purity">Purity</label>
            <input
              type="text"
              class="form-control"
              name="purity"
              placeholder="Enter Purity State"
              v-model="form.purity"
              required/>
          </div>
          <!-- Provide information as to whether the compound passed, failed, or was rejected -->
          <div class="form-group" id="p_f_r_group">
            <label for="p_f_r">Pass/Fail/Reject</label>
            <b-form-select
            id="p_f_r"
            class="form-control"
            text="Select whether the compound passed (P), failed (F), or was rejected (R)"
            v-model="form.p_f_r"
            :options="p_f_r"
            required>
            </b-form-select>
          </div>
          <!-- Provide the quantity of the product available in inventory -->
          <div class="form-group" id="quantity_group">
            <label for="quantity">Quantity</label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              placeholder="Enter the Quantity"
              v-model="form.quantity"
              step=".00"
              min="0"
              required/>
              <b-form-invalid-feedback :state="quantity_validation">
                Please enter a quantity
              </b-form-invalid-feedback>
          </div>

          <!-- Provide the measurement of the quantity entered in (either in mg, g, kg, mL, and L) -->
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
              <b-form-invalid-feedback :state="quantity_type_validation">
                Please select a quantity type
              </b-form-invalid-feedback>
              </b-form-select>
          </div>

          <!-- Document when the chemical was obtained -->
          <div class="form-group" id="obtainment_date_group">
            <label for="obtainment_date">Obtainment Date</label>
            <input
              type="date"
              class="form-control"
              name="obtainment_date"
              v-model="form.obtainment_date"
              required/>
          </div>
          <!-- Document the date in which this was recorded onto the application -->
          <div class="form-group" id="documented_date_group">
            <label for="documented_date">Documented Date</label>
            <input
              type="date"
              class="form-control"
              name="documented_date"
              v-model="form.documented_date"
              required/>
          </div>
          <!-- Add additoonal notes related to the chemical compound -->
          <div class="form-group" id="notes_group">
            <label for="notes">Notes</label>
              <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="10"
              class="form-control"
              v-model="form.notes"
              placeholder="Enter additional notes about this compound"></textarea>
          </div>
        
          <div class="row">
            <div class="col">
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click="addSlot()"> -->
              <!-- <router-link to="/inventory" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addSlot"> -->

              <!-- When submitted, prevent the form from automatically handling the submission and instead tell the application what to do on submit
              through the addInventory() method -->
              <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addInventory()">SUBMIT</button>
                <!-- SUBMIT -->
              <!-- </router-link> -->
            </div>
            <div class="col">
              <!-- Take the user back when they click return -->
              <router-link to="/inventory" class="btn btn-secondary btn-sm btn-block">
                RETURN
              </router-link>
            </div>
          </div>
          
        </b>
      </form>
    </div>

    <!-- If the user is not logged into the application (by checking the userToken value from the store.js page), redirect them to the login page -->
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

import SlotService from "@/services/SlotService";
export default {
  name: "AddInventory",
  data() {
    return {
      // Capture the data entered in the form; capture the current user logged in to the application in order to credit the person who
      // enters the new inventory item
      form: {
        cas_no: null,
        batch_id: null,
        supp_batch_id: null,
        supp_id: null,
        // supp_city: null,
        // supp_state: null,
        // supp_zip_code: null,
        compound_name: null,
        purity: null,
        p_f_r: null,
        quantity: null,
        quantity_produced_type: null,
        obtainment_date: null,
        documented_date: null,
        notes: null,
        acc_id: this.$store.getters.getUserID
      },
      // will hold the options of suppliers
      suppliers: [],
      // will hold the response of supplier data from the database and will be filtered and sent to the suppliers array
      supplierSelection: [],
      newInventory: {},
      // Give a list of fixed options for P/F/R
      p_f_r: [{text: "Select whether the compound passed (P), failed (F), or was rejected (R)", value: null, disabled: true}, 'P', 'F', 'R'],
      // provide a fixed list of options for the measurement types for quantity
      quantity_produced_type: [{text: "Select the quantity type", value: null, disabled: true}, {value: 'mg', text: 'Milligrams (mg)'}, {value: 'g', text: 'Grams (g)'}, {value: 'kg', text: 'Killograms (kg)'}, {value: 'mL', text: 'Milliliters (mL)'}, {value: 'L', text: 'Liters (L)'}]
    };
  },
  methods: {
    // This function will complete the axios method to refer to the Node.JS (backend) part of the application and send a message
    // if successful, followed by leading users back into the inventory page
    async addInventory() {
      console.log(JSON.stringify(this.form));
      // This was used to test a filtration system for the form
      // filteredForm: {
      //   cas_no = this.form.cas_no,
      //   batch_id = this.form.batch_id,
      //   supp_batch_id = this.form.supp_batch_id,
      //   compound_name = this.form.compound_name,
      //   purity = this.form.purity,
      //   p_f_r = this.form.p_f_r,
      //   quantity = this.form.quantity,
      //   obtainment_date = moment(this.form.obtainment_date),
      //   documented_Date = moment(this.form.documented_date),
      //   notes = this.form.notes
      //   }
      
      // Send a request to the SlotService.js file called addInventory, which will route to the backend to add the form into the database
      await SlotService.addInventory({newInventory: this.form})
      .then((result)=>{
        // If successful, provide feedback that the addition to the database was successful and go back to the inventory page
      this.$alert("Great!", `Your Inventory information has been added!`, "success").then( response =>{this.$router.push({ name: "Inventory" })
      })})
      .catch((error) => {
        // Catch an error and output it as an alert to the user
        this.$alert(error.response.data)
        //Ex: "Something is wrong with your form. You may have duplicate Batch IDs"
      })
       
      
      //  try{ await SlotService.addInventory({newInventory: this.form})
      //  }catch(error){
      //    console.log("This works");
      //    console.log(error);
      //  }
      
    
      // })
      // this.$router.go({ path: "/inventory" });
    },

    // This function will grab the suppliers from the database and put it on the form for the user to select
    async getSuppliers() {
      const response = await SlotService.fetchSuppliers();
      this.suppliers = response.data;
      this.suppliers.forEach((supplier, index, suppliersArray) => {
        let supplierSelectionOptions = {
          value: supplier.Supp_ID,
          text: supplier.Supplier
        }
        this.supplierSelection.push(supplierSelectionOptions)
      })
    },
  },
  
  // filters: {
  //   moment: function(date) {
  //     return moment(date).format('yyyy-MM-dd');
  //   }
  // },

  // When opening the page, Push the null option in the beginning so ensure that a user knows what the drop down is supposed to do
  created() {
    // push the null value first to tell the user what to do
    this.supplierSelection.push({text: "Select a Supplier", value: null, disabled: true})
    
      
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

    // Execute the function to retrieve the suppliers from the database
    this.getSuppliers()
  },
  computed:{
    // Validate to see if the the batch_id has been properly entered in and is not empty
    batch_id_validation(){
        return this.form.batch_id !== "" && this.form.batch_id !== null;
      },
      // Validate to make sure the quantity is at 0 or more
    quantity_validation(){
        return this.form.quantity >= 0
    },
    // Make sure that quantity_type was actually selected and not left empty
    quantity_type_validation(){
        return this.form.quantity_type !== "" && this.form.quantity_type !== null;
    },
    // Make sure that supplier batch ID is not empty and is properly filled out
    supp_batch_id_validation() {
      return this.form.supp_batch_id !== "" && this.form.supp_batch_id !== null;
    },
    // Retrieve a true or false as to whether the user is logged into the application or not
    userToken() {
      return this.$store.getters.getUser
    }
  }
};
</script>
<style>
</style>

