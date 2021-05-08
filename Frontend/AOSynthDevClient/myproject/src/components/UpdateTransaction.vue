<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">UPDATE</h1>
    
    <!-- start of the form -->
    <!-- Check to see if the user is logged in -->
    <div v-if="userToken">
    <!-- <div> -->
      <form class="py-3">
        <b>

          <!-- Supplier dropdown -->
          <div class="form-group" id="supplier_group">
            <label for="supplier">Supplier</label>
              <b-form-select
                id="supplier"
                class="form-control"
                text="Select a Supplier"
                v-model="form.supp_id"
                :options="supplierSelection">
              </b-form-select>
              <!-- <input 
              type="text"
              id="supplier"
              v-model="form.supp_id"/> -->
          </div>

          <!-- Customer name input-->
          <div class="form-group" id="customer_group">
            <label for="customer">Customer Name</label>
            
              <b-form-select
                id="customer"
                class="form-control"
                text="Select a Customer"
                v-model="form.cust_id"
                :options="customersSelection">
              </b-form-select>
        
          </div>

          <!-- Compound Drop Down -->
          <div class="form-group" id="compound_group">
            <label for="compound">Compound</label>
          
              <b-form-select
                id="compound"
                class="form-control"
                text="Select a compound"
                v-model="form.batch_id"
                :options="inventorySelection"
                @change="setMeasurement($event)"
                readonly
                disabled>
              </b-form-select>
              
          </div>
          <!-- order number text input -->
        <div class="form-group">
            <label for="order_no">Order Number:</label>
              <input
              type="text"
              id="order_no"
              class="form-control"
              v-model="form.order_no"
              readonly/>
          </div>
          
          <!-- transaction type radio button input  -->
          <div class="form-group">
            <label for="transaction_type">Transaction Type</label>
            <br>
            <input type="radio" id="Buy" value="Buy" v-model="form.trans_type" disabled>
            <label for="Buy">Buy</label>
            <input type="radio" id="Sell" value="Sell" v-model="form.trans_type" disabled>
            <label for="Sell">Sell</label>
          </div>
            <!-- Input for transactions date -->
          <div class="form-group">
            <label for="trans_date">Transaction Date</label>
            <!-- Date input -->
            <input
              type="date"
              class="form-control"
              name="trans_date"
              v-model="form.trans_date"/>
          </div>

          <!-- Shipped date -->
          <div class="form-group">
            <label for="shipped_date">Shipped Date</label>
            <!-- Date input -->
            <input
              type="date"
              class="form-control"
              name="shipped_date"
              v-model="form.shipped_date"/>
          </div>

          <!-- quantity shipped input-->
          <div class="form-group">
            <label for="quantity_shipped">Quantity Shipped</label>
            <input
              type="number"
              class="form-control"
              name="quantity_shipped"
              placeholder="Enter Quantity Shipped"
              v-model="form.quantity_shipped"
              readonly/>
          </div>

          <!-- quantity shipped type input -->
          <div class="form-group">
            <label for="quantity_shipped">Measurement Type</label>
            <input
              type="text"
              class="form-control"
              name="quantity_shipped"
              placeholder="Select the appropriate measurement"
              v-model="form.quantity_shipped_type"
              required
              readonly/>
              <!-- <b-form-select
                id="quantity_shipped_type"
                class="form-control"
                text="Select the appropriate measurement"
                v-model="form.quantity_shipped_type"
                :options="quantity_produced_type"
                required>
              </b-form-select> -->
          </div>

          <!-- Reserve Calculation; document how much of a chemical compound is left in inventory -->
          <!-- <div class="form-group">
            <label for="reserve">Reserve</label>
            <input
              type="number"
              class="form-control"
              name="reserve"
              v-model="form.reserve"
              readonly/>
          </div> -->

          <!-- Total cost of transaction -->
          <div class="form-group">
            <label for="total_amount">Total Cost</label>
            <input
              type="number"
              step=".00"
              min="0"
              class="form-control"
              name="total_amount"
              v-model="form.total_amount"/>
          </div>
          
          <!-- Tracking info link -->
          <div class="form-group">
            <label for="tracking_link">Tracking Link</label>
            <input
              type="text"
              class="form-control"
              name="tracking_link"
              placeholder="Enter the tracking link for shipping"
              v-model="form.tracking_link"/>
          </div>

          <!-- notes input -->
          <div class="form-group">
            <label for="notes">Notes</label>
              <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="10"
              class="form-control"
              v-model="form.notes"
              placeholder="Enter additonal notes about this transaction">
              </textarea>
          </div>

        
        <!-- Button to submit data entered into database -->
          <div class="row">
            <div class="col">
              <button class="btn btn-primary btn-sm btn-block" @click.stop.prevent="updateTransaction()">
                SUBMIT
              </button>
            </div>
            <div class="col">
              <!-- <a class="btn btn-secondary btn-sm btn-block" href="/transactions" role="button">
              RETURN
              </a> -->
              <router-link to="/transactions" class="btn btn-secondary btn-sm btn-block"> RETURN</router-link>
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
  name: "UpdateTransaction",
  data() {
    return {
      //form data to be submitted
      // populate the form with the selected Transaction record
      form: {
        trans_id: this.$route.params.selectedTransaction.Trans_ID,
        trans_date: this.$route.params.selectedTransaction.Trans_Date,
        batch_id: this.$route.params.selectedTransaction.Batch_ID,
        order_no: this.$route.params.selectedTransaction.Order_No,
        supp_id: this.$route.params.selectedTransaction.Supp_ID,
        shipped_date: this.$route.params.selectedTransaction.Shipped_Date,
        cust_id: this.$route.params.selectedTransaction.Cust_ID,
        quantity_shipped: this.$route.params.selectedTransaction.Quantity_Shipped,
        quantity_shipped_type: this.$route.params.selectedTransaction.Quantity_Shipped_Type,
        // reserve: this.$route.params.selectedTransaction.Reserve,
        total_amount: this.$route.params.selectedTransaction.Total_Amount,
        // cust_city: null,
        // cust_state: null,
        // cust_zip_code: null,
        // tracking_link: null,
        tracking_link: this.$route.params.selectedTransaction.Tracking_Link,
        notes: this.$route.params.selectedTransaction.Trans_Notes,
        trans_type: this.$route.params.selectedTransaction.Trans_Type,
        acc_id: null
        // reserve: calculateReserve()
      },
      //supplier will be used to store all records from the database
      suppliers: [],
      // this array will be used for the supplier drop down field
      supplierSelection: [],

      //store customer drop down info
      customers:[],
      //this array will be used for the customer drop down field
      customersSelection: [],
      
      //store inventory drop down info
      inventorys:[],
      // this array will be used for the inventory drop down field
      inventorySelection:[]
      
      //enter any lists here
    };
  },
  methods: {
    // update transaction function
    // on submission, take the form and do an axios request and then send an alert to say that the transaction
    // was updated and push back to the transaction page and if there is an error, send an error message saying
    // that the transaction has failed
    async updateTransaction() {
      this.form.acc_id = this.$store.getters.getUserID
      await SlotService.updateTransaction({updatedTransaction: this.form}).then((result)=>{
      this.$alert("Success! Your Transaction information has been updated!").then( response =>{this.$router.push({ name: "Transactions" })
      })})
      .catch((error) => {
        this.$alert("Could not update transaction. Please try again.")
      });
    },
    // retrieve suppliers from axios and place the response in the suppliers array, which will be iterated and placed
    // in a variable known as supplierSelectionOption, which will take only the value of supplier ID and text of supplier
    // so that a user can read the selections as the supplier name, but the database will get the value of the ID,
    // which will be easier to p;lace in the database, and then place it in the supplierSelection array.
    async getSuppliers() {
      // get suppliers function 
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
    // retrieve customers from axios request and place the response in the customers array, which will be iterated and placed
    // in a variable known as customerSelectionOption, which will take only the value of customer ID and text of customer
    // so that a user can read the selections as the customer name, but the database will get the value of the ID,
    // which will be easier to p;lace in the database, and then place it in the customerSelection array.
    async getCustomers() {
      // function to get customers
      const response = await SlotService.fetchCustomers();
      this.customers = response.data;
      this.customers.forEach((customer, index, suppliersArray) => {
        let customerSelectionOptions = {
          value: customer.Cust_ID,
          text: customer.Cust_Name
        }
        this.customersSelection.push(customerSelectionOptions)
      })
    },
    // retrieve ivnentory from axios and place the response in the inventory array, which will be iterated and placed
    // in a variable known as inventorySelectionOption, which will take only the value of batch ID and text of compound name
    // so that a user can read the selections as the compound name, but the database will get the value of the batch ID,
    // which will be easier to place in the database, and then place it in the inventorySelection array.
    async getInventory() {
      //function to get inventory
      const response = await SlotService.fetchInventory()
      this.inventorys = response.data;
      this.inventorys.forEach((inventory, index, customersArray) => {
        let inventorySelectionOptions = {
          value: inventory.Batch_ID,
          text: inventory.Compound
        }
        this.inventorySelection.push(inventorySelectionOptions)
      })
    },
    // fetch the inventory item based on the item selected and get the measurement type and assign it to the form
    // shipped type, to ensure that measurements arent changed when updating a transaction
    async setMeasurement(event) {
      //function to set measurements
      const response = await SlotService.fetchInventoryItem(event)
      let measurement = response.data
      console.log(measurement)
      this.form.quantity_shipped_type = measurement[0].Quantity_Produced_Type
    }
  },
  //get the user's token to make sure that he is logged in
  computed: {
    // determine whether the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },

  created(){
    //pushes text "select a supplier" to drop down box
    this.supplierSelection.push({text: "Select a Supplier", value: null, disabled: true})
    this.getSuppliers()
  
    //push "select a customer" to drop down box and gets a list of customers
  this.customersSelection.push({text: "Select a Customer", value: null, disabled: true})
    this.getCustomers()

    //pushes "select a compound" to drop down box and calls the function to get inventory
    this.inventorySelection.push({text: "Select a compound", value: null, disabled: true})
    this.getInventory()
  }
  
};
</script>

<style>
</style>

