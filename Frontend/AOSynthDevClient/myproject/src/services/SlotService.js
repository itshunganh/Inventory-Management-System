import Api from '@/services/Api'

export default {
  // fetch all inventory items
  fetchInventory () {
    return Api().get('inventory')
  },

  // Fetch inventory item quantity_produced_type
  fetchInventoryItem(id){
    return Api().get('/inventory/' + id)
  },
  // Add item into inventory
  addInventory (params) {
    return Api().post('/saveinventory', params)
  },
  // update an inventory item
  updateInventory (params) {
    return Api().post('/updateinventory', params)
  },
  // delete an inventory item
  deleteInventory (params) {
    return Api().delete('/inventory/' + params)
  },
  // get all transactions from the databasse
  getTransactions (params) {
    return Api().get('/transactions')
  },
  // delete a transaction
  deleteTransaction (id) {
    return Api().delete('/transactions/' + id)
  },
  // fetch a specific customer
  fetchSpecificCustomers(id) {
    return Api().get('/customers/' + id)
  },
  // add a transaction to the database
  addTransaction (params){
    return Api().post('/savetransaction', params)
  },
  // update an item from the database
  updateTransaction(params) {
    return Api().post('/updatetransactions', params)
  },
  // retrieve all customers from the database
  fetchCustomers() {
    return Api().get('/customers')
  },
  // add a customer into the database
  addCustomer(params) {
    console.log(params);
    return Api().post('/savecustomer', params);
  },
  // update one customer from the database
  updateCustomer(params) {
    return Api().post('/updatecustomer', params)
  },
  // delete a specific customer from the database
  deleteCustomer(params) {
    return Api().delete('/customers/' + params)
  },
  // fetch the suppliers from the database
  fetchSuppliers(){
    return Api().get('/suppliers')
  },
  // Add a supplier into the database
  addSupplier(params){
    return Api().post('/savesupplier', params)
  },
  // update the supplier into the database
  updateSupplier(params) {
    return Api().post('/updatesupplier', params)
  },
  // delete a specific supplier
  deleteSupplier(params){
    return Api().delete('/suppliers/' + params)
  },
  // get the report for customers in the system
  getCustomerReports(id
     ){
    return Api().post('/emailcustomers/'+id)
  },
  // get the report for transactions in the system
  getTransactionReports(id){
    return Api().post('/emailtransactions/'+id)
  },
  // get the report for products in the system
  getProductReports(id){
    return Api().post('/emailproducts/'+id)
  },
  getCustomersCSV(){
    return Api().post('/customersCSV')
  },
  // add an account to the system
  addAccount(params){
    return Api().post('/register', params)
  },
  // verify the login credentials
  login(params){
    return Api().post('/login',params)
  },
  // get the specific employee based on account id
  fetchEmployee(params) {
    return Api().get('/employees/' + params)
  },
  // get specific employee from transactions based on acc_id assigned to it
  fetchEmployeeFromTransaction(params) {
    return Api().get('/employeetransactions/' + params)
  }
}


// mounted() {
//     // Tells that once page is loaded, this command will be executed
//           const newUser = this.$store.getters.getUser
//           this.user = newUser
//           console.log(this.user)
//   },