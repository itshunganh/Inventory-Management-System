<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">ADD</h1>
    
    <!-- start of the form -->
    <!-- <div v-if="this.userToken"> -->
    <div>
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
                :options="supplierSelection"
                required>
              </b-form-select>
              
          </div>

          <!-- Customer Drop Down -->
          <div class="form-group" id="customer_group">
            <label for="customer">Customer Name</label>
            
              <b-form-select
                id="customer"
                class="form-control"
                text="Select a Customer"
                v-model="form.cust_id"
                :options="customersSelection"
                required>
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
                required>
              </b-form-select>
              <!-- <input type="text" hidden :value="inventorySelection.quantity" v-model="form.quantity_produced"> -->
              
          </div>
          
          <!-- order number input -->
        <div class="form-group">
            <label for="order_no">Order Number</label>
              <input
              type="text"
              id="order_no"
              class="form-control"
              v-model="form.order_no"
              required/>
          </div>
          
          <!-- Transaction type input  -->
          <div class="form-group">
            <label for="transaction_type">Transaction Type</label>
            <br>
            <input type="radio" id="Buy" value="Buy" v-model="form.trans_type">
            <label for="Buy">Buy</label>
            <input type="radio" id="Sell" value="Sell" v-model="form.trans_type">
            <label for="Sell">Sell</label>
          </div>

          <div class="form-group">
            <label for="trans_date">Transaction Date</label>
            <!-- Date input -->
            <input
              type="date"
              class="form-control"
              name="trans_date"
              v-model="form.trans_date"
              required/>
          </div>

          <!-- Shipped date -->
          <div class="form-group">
            <label for="shipped_date">Shipped Date</label>
            <!-- Date input -->
            <input
              type="date"
              class="form-control"
              name="shipped_date"
              v-model="form.shipped_date"
              required/>
          </div>

          <!-- quantity shipped input-->
          <div class="form-group">
            <label for="quantity_shipped">Quantity Shipped</label>
            <input
              id="quantity_shipped_input"
              type="number"
              class="form-control"
              name="quantity_shipped"
              placeholder="Enter Quantity Shipped"
              v-model="form.quantity_shipped"
              required
              step=".00"
              min="0"/>
              <b-form-invalid-feedback :state="quantity_shipped_validation">
                Make sure the value entered is greater than 0
              </b-form-invalid-feedback>
          </div>
          <!-- Measurement type input  -->
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
              id="total_cost_input"
              type="number"
              step=".00"
              min="0"
              class="form-control"
              name="total_amount"
              v-model="form.total_amount"
              required/>
              <b-form-invalid-feedback :state="total_cost_validation">
                Make sure the value entered is greater than 0
              </b-form-invalid-feedback>
          </div>
          
          <!-- Tracking info link -->
          <div class="form-group">
            <label for="tracking_link">Tracking Link</label>
            <input
              type="text"
              class="form-control"
              name="tracking_link"
              placeholder="Enter the tracking link for shipping"
              v-model="form.tracking_link"
              required/>
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
              v-model="form.trans_notes"
              placeholder="Enter additonal notes about this transaction"></textarea>
          </div>

        
          <!-- Button to submit data entered into database -->
          <div class="row">
            <div class="col">
              <button class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addTransaction()">
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

    <!-- <div class="card mb-3" v-if="!this.userToken">
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
    </div> -->
    
  </div>
</template>

<script>
import axios from 'axios'
import SlotService from "@/services/SlotService";
export default {
  name: "AddTransaction",
  data() {
    return {
      //form data for input submission
      form: {
        trans_date: null,
        batch_id: null,
        order_no: null,
        // supplier: null,
        // supp_city: null,
        // supp_state: null,
        // supp_zip_code: null,
        shipped_date: null,
        cust_id: null,
        quantity_shipped: null,
        quantity_shipped_type: null,
        // quantity_produced: null,
        // reserve: this.$route.params.selectedTransaction.Quantity_Produced - reserve,
        total_amount: null,
        // cust_city: null,
        // cust_state: null,
        // cust_zip_code: null,
        tracking_link: null,
        trans_notes: null,
        trans_type: null,
        acc_id: null
        // reserve: calculateReserve()
      },

      //array for suppliers drop down after its correctly filtered
      suppliers: [],
      // Will hold the suppliers directly retrieved from the database
      supplierSelection: [],

      //array for customers drop down after its correctly filtered
      customers:[],
      // will hold the customers directly retrieved from the database
      customersSelection: [],

      //array for inventory drop down after its correctly filtered
      inventorys:[],
      // Will hold the inventory directly retrieved from the database
      inventorySelection:[],
      
      // this was used to calculate the reserve, though it has no use in the code
      quantity_produced: null,

      // Create a fixed list of quantity produced types
      quantity_produced_type: [{text: "Select the quantity type", value: null, disabled: true}, {value: 'mg', text: 'Milligrams (mg)'}, {value: 'g', text: 'Grams (g)'}, {value: 'kg', text: 'Killograms (kg)'}, {value: 'mL', text: 'Milliliters (mL)'}, {value: 'L', text: 'Liters (L)'}]
      
      //enter any lists here
    };
  },

  methods: {
    // The method to submit the transaction inputted into the database
    async addTransaction() {
        // if (this.$store.getters.getUser) {
        // First store the account id to whatever user is logged in at the moment
        this.form.acc_id = this.$store.getters.getUserID
        // console.log(this.form.acc_id)
        // function will use axios to to add the transaction to the database
        await SlotService.addTransaction({
          // ^^^ command to attempt to insert into the database
          newTransaction: this.form
        }).then((result)=>{
          // display an alert if the insertion was successful and reroute back to the transactions page
        this.$alert("Success! Your Transaction information has been added!").then( response =>{this.$router.push({ name: "Transactions" })
        })})
        // otherwise, catch the error and print it to the user through an alert
        .catch((error) => {
          this.$alert(error.response.data);
        });
      // } else {
      //   this.$alert("Error! Your session has ended. Please Login again.").then(response=> {
      //     this.$router.push({name: 'Login'})
      //   })
      // }
    },

  //function to get supplier data from database
    async getSuppliers() {
      // fetch suppliers from the route defined in the backend of the application
      const response = await SlotService.fetchSuppliers();
      // Retrieve the data and place it into the suppliers array
      this.suppliers = response.data;
      // go through each supplier object from the suppliers array and insert the value of supplier id, but display the text of supplier name
      // when user looks and selects from the dropdown
      this.suppliers.forEach((supplier, index, suppliersArray) => {
        let supplierSelectionOptions = {
          value: supplier.Supp_ID,
          text: supplier.Supplier
        }
        // push each value into the supplierSelection Array
        this.supplierSelection.push(supplierSelectionOptions)
      })
    },

  //function to get customer from database
    async getCustomers() {
      // fetch customers from the route defined in the backend of the application
      const response = await SlotService.fetchCustomers();
      // Retrieve the data and place it into the customers array
      this.customers = response.data;
      // go through each customers object from the customers array and insert the value of customer id, but display the text of customer name
      // when user looks and selects from the dropdown
      this.customers.forEach((customer, index, suppliersArray) => {
        let customerSelectionOptions = {
          value: customer.Cust_ID,
          text: customer.Cust_Name
        }
        // push each value into the customerSelection Array
        this.customersSelection.push(customerSelectionOptions)
      })
    },

  //function to get inventory from database
    async getInventory() {
      // fetch inventory from the route defined in the backend of the application
      const response = await SlotService.fetchInventory()
      // Retrieve the data and place it into the inventory array
      this.inventorys = response.data;
      // go through each inventory object from the inventory array and insert the value of inventory id, but display the text of inventory name
      // when user looks and selects from the dropdown
      this.inventorys.forEach((inventory, index, inventoriesArray) => {
        let inventorySelectionOptions = {
          value: inventory.Batch_ID,
          text: inventory.Compound,
          quantity: inventory.Quantity_Produced,
          quantity_type: inventory.Quantity_Produced_Type,
          index: index
          // quantity_type: inventory.Quantity_Produced_Type
        }
        // push each value into the inventorySelection Array
        this.inventorySelection.push(inventorySelectionOptions)
      })
    },

  //function to get quantity specific produced from database
    async getQuantityProduced(id) {
      // retrieve the current quantity from inventory based on the batch id given
      const response = await SlotService.fetchInventoryItem(id)
      // console.log("Response data: " + response.data)
      // assign the response into this variable
      this.quantity_produced = response.data
    },

  //function to set measurement by pulling data about specific item in inventory
    async setMeasurement(event) {
      // retrieve the measurement of the ivnentory item
      const response = await SlotService.fetchInventoryItem(event)
      // console.log(response.data)
      // console.log("Event: " + event)
      // console.log(this.inventorySelection[event])

      // set the measurement variable as the response
      let measurement = response.data
      // print it out for testing
      console.log(measurement)
      // assign the measurement's Quantity_Produced_Type into the quantity_shipped_type, to prevent other measurements from occurring and
      // messing up the calculations/inserting the wrong data
      this.form.quantity_shipped_type = measurement[0].Quantity_Produced_Type
    },
  },
  created(){
    // print out whether a user is logged in or not (for testing purposes)
    console.log(this.userToken);

    //provide a null and disabled value to tell users what to do in the supplier drop down
    this.supplierSelection.push({text: "Select a Supplier", value: null, disabled: true})
    // retrieve suppliers from the database
    this.getSuppliers();

   //provide a null and disabled value to tell users what to do in the customer drop down
    this.customersSelection.push({text: "Select a Customer", value: null, disabled: true})
    // retrieve customers from the database
    this.getCustomers();

   //provide a null and disabled value to tell users what to do in the inventory drop down
    this.inventorySelection.push({text: "Select a Compound", value: null, disabled: true})
  // retrieve inventory from the database
    this.getInventory();

    // this.form.acc_id = this.$store.getters.getUserID
    // console.log("Account ID: " + this.form.acc_id);
  },

  computed: {
    // retrieve whether a user is logged into the application or not
    userToken() {
      return this.$store.getters.getUser
    },

    //Validate if quantity shipped is not negative
    quantity_shipped_validation() {
      return this.form.quantity_shipped > 0
    },

    //check to see if total cost is not negative
    total_cost_validation() {
      return this.form.total_amount > 0
    }
  }
  
};
</script>

<style>
</style>

