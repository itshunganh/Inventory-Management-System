<template>
  <div class="addslot container">
    <h1 class="display-3 mt-5">VIEW</h1>
    
    <!-- start of the form -->
    <!-- if the user is logged in, show the form to them -->
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
                :options="supplierSelection"
                readonly
                disabled>
              </b-form-select>
              <!-- <input 
              type="text"
              id="supplier"
              v-model="form.supp_id"/> -->
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
                readonly
                disabled>
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
                readonly
                disabled>
              </b-form-select>
              
          </div>
          
        <div class="form-group">
            <label for="order_no">Order Number:</label>
              <input
              type="text"
              id="order_no"
              class="form-control"
              v-model="form.order_no"
              readonly/>
          </div>
          
          <div class="form-group">
            <label for="transaction_type">Transaction Type</label>
            <br>
            <input type="radio" id="Buy" value="Buy" v-model="form.trans_type" disabled="true">
            <label for="Buy">Buy</label>
            <input type="radio" id="Sell" value="Sell" v-model="form.trans_type" disabled="true">
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
              readonly/>
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
              readonly/>
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
              v-model="form.total_amount"
              readonly/>
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
              readonly/>
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
              placeholder="Enter additonal notes about this transaction"
              readonly></textarea>
          </div>
          <!-- diplay who created the transaction record -->
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
        
        <!-- Button to submit data entered into database -->
          <div class="row">
            <!-- <div class="col">
              <button class="btn btn-primary btn-sm btn-block" @click="addSlot">
                SUBMIT
              </button>
            </div> -->
            <div class="col">
              <!-- <a class="btn btn-secondary btn-sm btn-block" href="/transactions" role="button">
              RETURN
              </a> -->
              <!-- user can only go back to the transactions page -->
              <router-link to="/transactions" class="btn btn-secondary btn-sm btn-block"> RETURN</router-link>
            </div>
          </div>
          
        </b>
      </form>
    </div>

    <!-- if the user is not logged in, take them back to the login page -->
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
  name: "ViewTransaction",
  data() {
    return {
      // fname: "",
      // lname: "",
      // phone: "",
      // date: "",
      // time: "",
      // prepopulate the form with the selected Transaction
      form: {
        trans_date: this.$route.params.selectedTransaction.Trans_Date,
        batch_id: this.$route.params.selectedTransaction.Batch_ID,
        order_no: this.$route.params.selectedTransaction.Order_No,
        supp_id: this.$route.params.selectedTransaction.Supp_ID,
        // supp_city: this.$route.params.selectedTransaction.,
        // supp_state: null,
        // supp_zip_code: null,
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
        created_by: null
        // reserve: calculateReserve()
      },
      suppliers: [],
      supplierSelection: [],

      customers:[],
      customersSelection: [],

      inventorys:[],
      inventorySelection:[],

      transaction_id: this.$route.params.selectedTransaction.Trans_ID
      
      //enter any lists here
    };
  },
  methods: {
    // get the first and last name of the individual in order to display who recorded the transaction
    async getEmployee(id) {
      const response = await SlotService.fetchEmployeeFromTransaction(id)
      let name = response.data
      this.form.created_by = name[0].First_Name + " " + name[0].Last_Name
    },

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

    async getCustomers() {
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

    async getInventory() {
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
  },

  computed: {
    // determine if the user is logged in or not
    userToken() {
      return this.$store.getters.getUser
    }
  },

  created(){
    this.getEmployee(this.transaction_id)
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
    this.getSuppliers()
  

  this.customersSelection.push({text: "Select a Customer", value: null, disabled: true})
    // axios.get('https://aosynth-inv-api.herokuapp.com/customers').then(response => {
    //   // console.log(JSON.stringify(response.data));
    //   this.customers = response.data;
    //   this.customers.forEach((customer, index, customersArray) => {
    //     let customerSelectionOptions = {
    //       value: customer.Cust_ID,
    //       text: customer.Cust_Name
    //     }
    //     this.customersSelection.push(customerSelectionOptions)
    //   })
    //   console.log(JSON.stringify(this.customersSelection))
    // })
    this.getCustomers()

    this.inventorySelection.push({text: "Select a compound", value: null, disabled: true})
    // axios.get('https://aosynth-inv-api.herokuapp.com/inventory').then(response => {
    //   // console.log(JSON.stringify(response.data));
    //   this.inventorys = response.data;
    //   this.inventorys.forEach((inventory, index, customersArray) => {
    //     let inventorySelectionOptions = {
    //       value: inventory.Batch_ID,
    //       text: inventory.Compound
    //     }
    //     this.inventorySelection.push(inventorySelectionOptions)
    //   })
    //   console.log(JSON.stringify(this.inventorySelection))
    // })
    this.getInventory()
    // console.log("Transaction ID: " + this.$route.params.selectedTransaction.Trans_ID)
  }
  
};
</script>

<style>
</style>

