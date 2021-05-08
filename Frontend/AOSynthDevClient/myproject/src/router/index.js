// import the front end library used to structure the application
import Vue from 'vue'
// Router will route through each page by assigning them a path
import Router from 'vue-router'
// Import the inventory page to show the chemicals recorded
import Inventory from '@/components/Inventory'
// Import a read only form to show the selected inventory item
import ViewInventory from '@/components/ViewInventory'
// Import an empty form to add an inventory item
import AddInventory from '@/components/AddInventory'
// Import a prepopulated form to update an inventory item
import UpdateInventory from '@/components/UpdateInventory'
// Import the transactions page to show the transactions recorded
import Transactions from '@/components/Transactions'
// Import a read only form to view the transaction selected
import ViewTransaction from '@/components/ViewTransaction'
// Import an empty form page to add transactions
import AddTransaction from '@/components/AddTransaction'
// import an empty form page to update a transaction, prepopulated with data
import UpdateTransaction from '@/components/UpdateTransaction'
// import the customers page to show the list of customers recorded
import Customers from '@/components/Customers'
// Import a prepopulated read-only form for a customer record selected
import ViewCustomer from '@/components/ViewCustomer'
// Import an empty form to add a new customer
import AddCustomer from '@/components/AddCustomer'
// Import a prepopulated form to update a customer selected
import UpdateCustomer from '@/components/UpdateCustomer'
// Import all suppliers recorded within the system
import Suppliers from '@/components/Suppliers'
// Import a prepopulated read-only form for a supplier record selected
import ViewSupplier from '@/components/ViewSupplier'
// Import an empty form to add a new supplier to the system
import AddSupplier from '@/components/AddSupplier'
// Import a prepopulated form to update a supplier record selected
import UpdateSupplier from '@/components/UpdateSupplier'
// Import a home page for the user after they login successfully
import Home from '@/components/Home'
// Import the login page to allow the user to log in
import Login from '@/components/Login'
// Import the register page to allow a user to register another user
import Register from '@/components/Register'
// Import the Reports page to allow a user to generate reports
import Reports from '@/components/Reports'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login,
      name: 'Login'
    },
    {
      path: '/register',
      component: Register,
      name: 'Register'
    },
    {
      path: '/home',
      component: Home,
      name: 'Home'
    },
    {
      path: '/inventory',
      component: Inventory,
      name: 'Inventory'
    },
    {
      path:'/inventory/:id',
      component: ViewInventory,
      name: 'ViewInventory'
    },
    {
      path: '/inventory/add',
      component: AddInventory,
      name: 'AddInventory'
    },
    {
      path: '/inventory/:id/update',
      component: UpdateInventory,
      name: 'UpdateInventory'
    },
    // {
    //   path: '/inventory/:id/delete',
    //   component: DeleteInventory,
    //   name: 'DeleteInventory'
    // },
    {
      path: '/transactions',
      component: Transactions,
      name: 'Transactions'
    },
    {
      path: '/transactions/:id',
      component: ViewTransaction,
      name: 'ViewTransaction'
    },
    {
      path: '/transactions/add',
      component: AddTransaction,
      name: 'AddTransaction'
    },
    {
      path: '/transactions/:id/update',
      component: UpdateTransaction,
      name: 'UpdateTransaction'
    },
    // {
    //   path: 'transactions/:id/delete',
    //   component: DeleteTransaction,
    //   name: 'DeleteTransactions'
    // }
    {
      path: '/customers',
      component: Customers,
      name: 'Customers'
    },
    {
      path: '/customers/:id',
      component: ViewCustomer,
      name: 'ViewCustomer'
    },
    {
      path: '/addcustomer',
      component: AddCustomer,
      name:'AddCustomer'
    },
    {
      path: '/customers/:id/update',
      component: UpdateCustomer,
      name: 'UpdateCustomer'
    },
    {
      path: '/suppliers',
      component: Suppliers,
      name: 'Suppliers'
    },
    {
      path: '/suppliers/:id',
      component: ViewSupplier,
      name: 'ViewSupplier'
    },
    {
      path: '/addsupplier',
      component: AddSupplier,
      name: 'AddSupplier'
    },
    {
      path: '/suppliers/:id/update',
      component: UpdateSupplier,
      name: 'UpdateSupplier'
    },
    {
      path: '/reports',
      component: Reports,
      name: 'Reports'
    },
  ]
})
