const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken');
var dateFormat = require("dateformat");
// const verify = require('../verifyToken')
//client data, update client, add client, delete client, supplier data, update supplier, delete supplier, add supplier, 
router = new express.Router();
const pool = require('../DBConnection.js');
const e = require('express');
const verifyToken = require('../verifyToken');



// ***************** INVENTORY MANIPULATION ***************************
        // retrieve inventory from the database (especifically, batches from the batches and product table)
router.get('/inventory', async(req,res) => {
    try {
        // Show a list of batches with their associated products from the database
        pool.query('SELECT * FROM BATCHES join PRODUCTS on BATCHES.Batch_ID = PRODUCTS.Batch_ID join SUPPLIER_BATCHES on BATCHES.Supp_Batch_ID = SUPPLIER_BATCHES.Supp_Batch_ID join SUPPLIERS on SUPPLIER_BATCHES.Supp_ID = SUPPLIERS.Supp_ID;',
        function(error,results,fields){
            if(error) res.status(500).send(error.message); 
            // console.log(results);
            results.forEach(inventory => {
                // Format the date to a human readable ISO Date Format (YYYY-MM-DD)
                inventory.Obtainment_Date = dateFormat(inventory.Obtainment_Date, "isoDate")
                inventory.Documented_Date = dateFormat(inventory.Documented_Date, "isoDate")
            });
            // Send back that the select statement was successful
            res.send(results);
        })
    }catch (error) {
        // Send an error message that the retrieval was not possible (this is if the database does not work as intended and
        // cannot retrieve the inventory information)
        res.status(500).send(error.message);
    }
})

// view one item of inventory in detail
router.get('/inventory/:id', async(req,res) => {
    try {
        // Retrieve a specific inventory item by identifying the Batch ID of the product and retrieving the record from the Products and Batches tables
        // console.log("req params id for fetching quantity produced:" + req.params.id)
        pool.query('SELECT Quantity_Produced_Type FROM BATCHES where BATCHES.Batch_ID = '+ '\"' + req.params.id + '\"'+ ';', function(error,results,fields){
            // If there is an error, send back a message as to why the statement could not execute from the database side
            if (error) res.status(500).send(error.message);
            // Print out the reuslts from the database
            // console.log(results);
            res.send(results);
        })
    }catch (error) {
        // Send back an error if something goes wrong during the execution of this route
        res.status(500).send(error.message);
    }
})

// save a new inventory item
router.post('/saveinventory', async(req,res) => {
    // This is to check the contents of what is sent to the route
    // console.log( + '\"' + req.body.newInventory + '\"');
    try{
        // Working insertion code
        // If the quantity recorded is less than 0 and is a negative number, send back an error telling the user to edit a quantity greater than or equal to 0
        if (req.body.newInventory.quantity < 0 || req.body.newInventory.quantity === null || req.body.newInventory.quantity === undefined) {
            res.status(500).send("Please enter a quantity greater than or equal to 0")
        }
        else if (req.body.newInventory.cas_no === null || req.body.newInventory.batch_id === null || req.body.newInventory.supp_batch_id === null || req.body.newInventory.cas_no === "" || req.body.newInventory.batch_id === "" || req.body.newInventory.supp_batch_id === "") {
            res.status(500).send("Please make sure the Cas No, Batch ID, and Supplier Batch ID fields are filled out.")
        }
        else if (req.body.newInventory.compound_name === null || req.body.newInventory.compound_name === "") {
            res.status(500).send("Please ensure the Chemical Compound Name field is filled out")
        }
        // Otherwise, make the insertion into the Supplier Batches Table, the Batches Table, and the Products table; send errors for any issues that might occur from the insertions through the if (error) statement
        else {
            pool.query(`insert into supplier_batches (Supp_Batch_ID, Supp_ID) values (\"${req.body.newInventory.supp_batch_id}\",\"${req.body.newInventory.supp_id}\");`,
            function(error, result, fields) {
                if (error) res.status(500).send(error.message);
                else{
                pool.query(`insert into batches (Batch_ID, Supp_Batch_ID, P_F_R, Quantity_Produced, Quantity_Produced_Type, Obtainment_Date, Documented_Date, Acc_ID) values (\"${req.body.newInventory.batch_id}\",\"${req.body.newInventory.supp_batch_id}\",\"${req.body.newInventory.p_f_r}\",${req.body.newInventory.quantity},\"${req.body.newInventory.quantity_produced_type}\",\"${req.body.newInventory.obtainment_date}\",\"${req.body.newInventory.documented_date}\",${req.body.newInventory.acc_id});`,
                function(error,result,fields) {
                if (error) res.status(500).send(error.message);
                else{
                pool.query(`insert into products (CAS_No, Compound, Purity, Notes, Batch_ID) values (\"${req.body.newInventory.cas_no}\",\"${req.body.newInventory.compound_name}\",\"${req.body.newInventory.purity}\",\"${req.body.newInventory.notes}\",\"${req.body.newInventory.batch_id}\");`,
                function(error,result,fields) {
                if (error) res.status(500).send(error.message);
                    res.send(result);
                })
            
            }
        })
    }
    
    
    })
        }
    }

    catch(error){
        // console.error('err thrown: ' + error.stack);
        // console.log("error received");
        // Test the error message and check to see if an insert statement for inventory does not work as intended
        // console.log("Beep")
        // console.log(error.message);
        res.status(500).send(error.message);
    }
})

//update an inventory item
router.post('/updateinventory', async(req,res) => {
    // try{
    // console.log(req.body.newInventory + "This is req.body")

    try{
        // If the quantity is less than 0 when updating a record, let the user kmnow to change the quantity to a value of 0 or higher
        if (req.body.newInventory.quantity < 0) {
            res.status(500).send("Please enter a quantity greater than or equal to 0")
        }
        else {
            // Update the Batches table, the Products table, and Supplier Batches table and send an error if an insertion cannot happen
            pool.query(`update batches set P_F_R = \"${req.body.newInventory.p_f_r}\", Quantity_Produced = ${req.body.newInventory.quantity}, Quantity_Produced_Type = \"${req.body.newInventory.quantity_produced_type}\", Obtainment_Date = \"${req.body.newInventory.obtainment_date}\",  Documented_Date = \"${req.body.newInventory.documented_date}\", Acc_ID = ${req.body.newInventory.acc_id} where Batch_ID = \"${req.body.newInventory.batch_id}\";`,
            function(error,result,fields) {
            if (error) res.status(500).send(error.message)
            else{
                pool.query(`update products set Compound = \"${req.body.newInventory.compound_name}\" , Purity = \"${req.body.newInventory.purity}\", Notes = \"${req.body.newInventory.notes}\" where CAS_No = \"${req.body.newInventory.cas_no}\";`,
                function(error,result,fields) {
            if (error) res.status(500).send(error.message)
                else{
                    pool.query(`update supplier_batches set Supp_ID =${req.body.newInventory.supp_id} where Supp_Batch_ID = \"${req.body.newInventory.supp_batch_id}\";`, 
                    function(error, results, fields) {
                    if (error) res.status(500).send(error.message); 
                    res.send(results);
                 })
                }
            
             })
            }
            // res.send(result);
        })
        
        }
         
        }
        catch(error){
            // Send out an error if there is an issue with a connection to the database
            res.status(500).send(error.message);

        }
})

//delete an inventory item
router.delete('/inventory/:id', async(req,res) => {
    // print out the parameters passed to this route
    // console.log(req.params);

    try{
        // Delete an inventory item by identifying the Supplier Batch ID. The database will use cascade deleting to delete the rest of the records associated with the Supplier Batches table,
        // which includes Batches and Products table
        pool.query(`delete from supplier_batches where Supp_Batch_ID = \"${req.params.id}\";`, 
            function(error, result, fields) {
                // Send an error if the deletion cannot happen
                if (error) res.status(500).send(error.message);
                // otherwise show a success and send back a result 
                // console.log('Success')
                res.send(result);
        })
    }
    catch(error){
        // Send back an error message if there is an issue connecting to the database
        res.status(500).send(error.message);
    }
})


// ***************** TRANSACTIONS MANIPULATION ***************************
// retrieve transactions from the transactions table
router.get('/transactions', async(req,res) => {
    try{
        // Select the transactions and link all the tables associated with transactions, in order to provide as much information as possible to the user
        pool.query('select * from transactions' + 
        ' join batches on transactions.Batch_ID = batches.Batch_ID' + 
        ' join products on transactions.Batch_ID = products.Batch_ID' +  
        ' join customers on customers.Cust_ID = transactions.Cust_ID' + 
        ' join suppliers on transactions.Supp_ID = suppliers.Supp_ID;', 
        function(error,results,fields){
            // Send back an error if this query does not work
            if (error) res.status(500).send(error.message); 
            console.log(results);
            // Format the dates to use the ISO Date that we can read and understand
            results.forEach(transaction => {
                transaction.Shipped_Date = dateFormat(transaction.Shipped_Date, "isoDate")
                transaction.Trans_Date = dateFormat(transaction.Trans_Date, "isoDate")
            });
            // Send the results of the query back to the page
            res.send(results);
        })
    }catch(error){
        // Send an error if there is an issue executing the query
        res.status(500).send(error.message);    }
})

//  Add a specific transaction
router.post('/savetransaction', async(req,res) => {
    try{//modify if crashes
        // Utilize this variable to store the results
        let quantity_produced = 0
        // If the quantity shipped or total amount is either empty or not a number (aka characters besides numbers are included), send back an error message saying that only decimal numbers are allowed on the form
        if (Number.isNaN(req.body.newTransaction.quantity_shipped) || Number.isNaN(req.body.newTransaction.total_amount) || req.body.newTransaction.quantity_shipped === '' || req.body.newTransaction.total_amount === '')
        {
            res.status(500)
            res.send("Please insert only decimal numbers on Quantity Shipped and Total Cost fields.")
        }
        // if the quantity shipped value is less than 0, send an error to the user informing them to make the Quantity Shipped field a positive number
        else if (req.body.newTransaction.quantity_shipped < 0) {
            res.status(500).send("Please insert only values greater than or equal to 0 for Quantity Shipped.")
        }
        // if the total amount value is less than 0, send an error to the user informing them to make the Total Amount field a positive number
        else if (req.body.newTransaction.total_amount < 0) {
            res.status(500).send("Please insert values greater than or equal to 0 for the Total Cost.")
        }
        else if (req.body.newTransaction.batch_id === null || req.body.newTransaction.supp_id === null || req.body.newTransaction.cust_id === null) {
            res.status(500).send("Please ensure that the Supplier, Customer, and Compound fields are selected")
        }
        else {
            // If the transaction is a buy, add the current quantity with the amount bought and replace the current product quantity with the new value
            if (req.body.newTransaction.trans_type === "Buy") {
                pool.query(`SELECT Quantity_Produced from batches where batches.Batch_ID = \"${req.body.newTransaction.batch_id}\"`,
                function(error, results, fields) {
                    if (error) res.status(500).send("Could not select quantity from batches. Please try again.")
                    else {
                        quantity_produced = results[0].Quantity_Produced;
                    
                        // console.log("results: " + quantity_produced)
            
                        let math = parseFloat(quantity_produced) + parseFloat(req.body.newTransaction.quantity_shipped)
                        // console.log("Math of adding quantities: " + math);

                        if (math < 0) {
                            res.status(500).send("Please make sure you are not shipping more than what you have in inventory.")
                        }
                        else {
                            pool.query(`UPDATE batches SET Quantity_Produced = ${math} where batches.Batch_ID = \"${req.body.newTransaction.batch_id}\"`,
                            function (error, results, fields) {
                                if (error) res.status(500).send("error");
                                else {
                                    pool.query(`INSERT INTO transactions SET ? `, req.body.newTransaction,
                                    function(error, results, fields) {
                                        if (error) res.status(500).send("error")
                                        res.send(results)
                                    })
                                }
                            })
                        }
                    }
                })
            }
            // If the transaction is a sell, subtract the current quantity with the amount bought and replace the current product quantity with the new value
            else if (req.body.newTransaction.trans_type === "Sell"){
                pool.query(`SELECT Quantity_Produced from batches where batches.Batch_ID = \"${req.body.newTransaction.batch_id}\"`,
                function(error, results, fields) {
                    if (error) res.status(500).send("Could not select quantity from batches. Please try again.") 
                    else{ 
                        quantity_produced = results[0].Quantity_Produced;
                        
                        // console.log("results: " + quantity_produced)
            
                        let math = parseFloat(quantity_produced) - parseFloat(req.body.newTransaction.quantity_shipped)
                        // console.log("Math of adding quantities: " + math);
    
                        if (math < 0) {
                            res.status(500).send("Please make sure you are not shipping more than what you have in inventory.")
                        }
                        else {
                            pool.query(`UPDATE batches SET Quantity_Produced = ${math} where batches.Batch_ID = \"${req.body.newTransaction.batch_id}\"`,
                            function (error, results, fields) {
                                if (error) res.status(500).send("Could not update quantity produced of your batch. Please try again");
                                else {
                                    pool.query(`INSERT INTO transactions SET ? `, req.body.newTransaction,
                                    function(error, results, fields) {
                                        if (error) res.status(500).send("Updating transaction failed. Please try again")
                                        res.send(results)
                                    })
                                }
                            })
                        }
                    }
                })
            }
            else {
                // Send an error to let the user know to select a transaction type
                res.status(500).send("Please make sure you selected a Transaction type.")
            }
        }
    }//modify if crashes
    catch(error){//modify if crashes
        // Inform the user that the save for the transaction was unsuccessful due to connection issues with the database
        res.status(500).send("Save unsuccessful. Please make sure to fill out the form with the correct information!");
    }//modify if crashes
    
    })

// update a transaction
router.post('/updatetransactions', async(req,res) => {
    try{
        // After a submission of a transaction update, set the new values to what it should be
        pool.query(`update transactions set Supp_ID = ${req.body.updatedTransaction.supp_id}, Cust_ID = ${req.body.updatedTransaction.cust_id}, Batch_ID= \"${req.body.updatedTransaction.batch_id}\", Trans_Type= \"${req.body.updatedTransaction.trans_type}\", Trans_Date = \"${req.body.updatedTransaction.trans_date}\", Shipped_Date = \"${req.body.updatedTransaction.shipped_date}\", Quantity_Shipped = ${req.body.updatedTransaction.quantity_shipped},  Total_Amount = ${req.body.updatedTransaction.total_amount}, Tracking_Link = \"${req.body.updatedTransaction.tracking_link}\", Trans_Notes = \"${req.body.updatedTransaction.notes}\", Acc_ID = ${req.body.updatedTransaction.acc_id} where Trans_ID = ${req.body.updatedTransaction.trans_id};`,
        function(error,result,fields) {
            if (error) res.status(500).send(error.message); 
            res.send(result);
        })
    }catch(error){
        // print out an error if there is an error that appears when connecting to the application
        // console.log(error)
    }
})

// delete a transaction
router.delete('/transactions/:id', async(req,res) => {
    // Print out the parameters that are passed to this route
    // console.log(req.params);
    try{
        // Delete the selected transaction by identifying the transaction ID
        pool.query(`delete from transactions where Trans_ID= ${req.params.id};`, 
            function(error, result, fields) {
                if (error) res.status(500).send(error.message); 
                // console.log('Success')
                res.send(result);
            }
    )

    }catch(error){
        // Send back an error if there is an error message that appears
        res.status(500).send(error.message);    }
})


// ***************** CUSTOMER MANIPULATION ***************************
// retrieve all customers from the customers database table
router.get('/customers', async(req,res) => {
    console.log("Customers received");
    try{
        pool.query('select * from customers',
            function(error,results,fields) {
                if (error) res.status(500).send(error.message); 
                res.send(results)
            })
    }catch(error){
        // Send back an error message if there is an issue retrieving the information
        res.status(500).send(error.message);    }
})

// retrieve information about a specific customer
router.get('/customers/:id', async(req,res) => {
    try{
        // Select the specific customer whose name is equivalent to the parameter passed to the route
        pool.query(`select * from customers where customers.Cust_Name = \"${req.params.id}\"`,
            function(error,results,fields) {
                // If there is an error retrieving the query, sedn back the error message
                if (error) res.status(500).send(error.message); 
                res.send(results)
            })
    }catch(error){
        // If there is an error in attempting to execute this statement, send back the error message stating why this is occurring
        res.status(500).send(error.message);    }
})

// save customer information
router.post('/savecustomer', async(req,res) => {
    // Print out the parameters that are passed to the route
    // console.log(req.body.newCustomer);
    try{
        // Used to test the contents that would be passed onto this route
        const addCustomer = req.body
        // Insert into the Customers table the newCustomer parameter, which is submitted from the Add Customers form
        pool.query(`INSERT INTO customers SET ? `, req.body.newCustomer,
        function(error, results, fields) {
            // If the customer could not be added, send a message to let the user know it could not be added
            if (error) res.status(500).send("Could not add customer, please try again."); 
            // Otherwise, send back a result to show it occurred successfully
            res.send(results);
        })
    }
    catch(error){
        // If the statement cannot be executed at all, send back that the customer was not able to be added
        res.status(500).send("Could not add customer, please try again.");
    }
})

//update customer information
router.post('/updatecustomer', async(req,res) => {
    try{
        // Update the customer with the information that is passed
        pool.query(`update customers set Cust_Name = \"${req.body.newCustomer.cust_name}\", Phone_No = \"${req.body.newCustomer.phone_no}\", Email = \"${req.body.newCustomer.email}\",  City_Name= \"${req.body.newCustomer.city_name}\", State_Name= \"${req.body.newCustomer.state_name}\", Zip_Code= \"${req.body.newCustomer.zip_code}\" where Cust_ID = ${req.body.newCustomer.cust_id};`,
            function(error,result,fields) {
                // If there is an error, let the user knwo that the customer information could not be updated
                if (error) res.status(500).send("Could not update customer please try again.");
                // Otherwise, send the results of the successful update to display to the user
                res.send(result);
        })
    }
    catch(error){
        // If there is an error in the execution of this statement, send the error back to the user to let them know
        res.status(500).send(error.message);
    }
})


// edit customer information
router.patch('/customers/:id', async(req,res) => {
    try{
        // Select a customer based on the Customer ID passed into the route
        pool.query(`select * from customers where Cust_ID = \"${req.params.id}\"`,
            function(error,results,fields) {
                // If there is an error, send an error message
                if (error) res.status(500).send(error.message); 
                // Otherwise, send back a result stating the successful execution of the SQL statement
                res.send(results)
            })

    }catch(error){
        // Any errors in executing the code in this route will send back an error message
        res.status(500).send(error.message);    }
})

// delete customer information
router.delete('/customers/:id', async(req,res) => {
    try{
        // Print out what is sent to the route
        // console.log(req.params);
        // Delete the customers from the Customers table where the customer ID is equivalent to what is passed to the route
        pool.query(`delete from customers where Cust_ID = \"${req.params.id}\";`, 
            function(error, result, fields) {
                // If there is an error in the deletion, send back an error message
                if (error) res.status(500).send(error.message); 
                // Otherwise, print out success and send back the result
                // console.log('Success')
                res.send(result);
            })
    }
    catch(error){
        // If there is an issue executing the query in the try statement, send back an error message
        res.status(500).send(error.message);
    }

})

// ***************** SUPPLIER MANIPULATION ***************************

// retrieve all suppliers from the suppliers database table
router.get('/suppliers', async(req,res) => {
    try{
        // Select all the suppliers from the database to show in the Suppliers page
        pool.query('SELECT * FROM SUPPLIERS', function(error,results,fields){
            // If there is an error, send back the error message
            if (error) res.status(500).send(error.message); 
            // console.log(results);
            // Otherwise, send the results back to the front end
            res.send(results);
        })
    }catch(error){ 
        // If there are any errors in executing the statement, send back an error message explaining why
        res.status(500).send(error.message);
    }
})

// save supplier information
router.post('/savesupplier', async(req,res) => {
    try{
        // Insert a new supplier into the supplier table with the parameters sent from the form utilizing the auto-increment function
        pool.query(`INSERT INTO suppliers SET ? `, req.body.newSupplier,
        function(error, results, fields) {
            // If there is an error in the execution of the statement, send an error back stating that there is an issue
            if (error) res.status(500).send("Could not save supplier, please try again.");
            // Otherwise send a result back
            res.send(results);
        })
    }
    catch(error){
        // Send back an error message if the statement does not work within the try block
        res.status(500).send(error.message);
    }
})

// edit supplier information
router.post('/updatesupplier', async(req,res) => {
    try{
        // Update the value of suppliers once the form is submitted
        pool.query(`update suppliers set Supplier = \"${req.body.updatedSupplier.supplier}\", Phone_No = \"${req.body.updatedSupplier.phone_no}\", Email = \"${req.body.updatedSupplier.email}\",  City_Name= \"${req.body.updatedSupplier.city_name}\", State_Name= \"${req.body.updatedSupplier.state_name}\", Zip_Code= \"${req.body.updatedSupplier.zip_code}\" where Supp_ID = ${req.body.updatedSupplier.supp_id};`,
        function(error,result,fields) {
            // If there is an error, send back the message saying that it could not be updated, please try again
            if (error) res.status(500).send("Could not update supplier, please try again.");
            // Otherwise, send back a result
            res.send(result);
        })
    }catch(error){
        res.status(500).send(error.message);    }
})

// delete supplier information
router.delete('/suppliers/:id', async(req,res) => {
    try{
        //delete a supplier_batch by the supplier ID given
        pool.query(`delete from supplier_batches where Supp_ID = \"${req.params.id}\"`,
            function(error, result, fields){
                //sends an error if a supplier_batch cannot be deleted
                if (error) res.status(500).send(error.message);
                
            }
        )
        //delete a supplier from the suppliers table with matching supp_id
        pool.query(`delete from suppliers where Supp_ID = \"${req.params.id}\";`,
            function(error, results, fields) {
                //sends an error if supplier could not be deleted.
                if (error) res.status(500).send(error.message);
                res.send(results)
        })
    }
    // Sends an error if there was an error during the run
    catch(error){
        res.status(500).send(error.message);
    }
})

// ***************** EMPLOYEE MANIPULATION ***************************
// Get the name of an employee based on their Account ID
router.get('/employees/:id', async(req,res) => {
    // Print out the data that is sent to that route
    // console.log(req.params);
    // Select the first name and last name of the individual where their account id is the parameter passed in
    // This is because the first name and last name are part of the employee table, which is linked to the accounts table through account ID
    pool.query(`select First_Name, Last_Name from Employees where Acc_ID = ${req.params.id}`,
    function(error, results, fields) {
        // If there is an error, send back an error message
        if (error)  res.status(500).send(error.message);
        // Otherwise, send back a result signifying the successful execution of the query
        res.send(results)
    })
})

// Get the Account ID from the employees table
router.get('/employeetransactions/:id', async(req,res) => {
    // Print out the contents that are passed to that route
    // console.log(req.params)
    // Utilize this query to identify the account associated with creating the transaction
    pool.query(`select Acc_ID from transactions where Trans_ID = ${req.params.id}`,
    function (error, results, fields) {
        // If there is an error pulling in that information, send an error message back
        if (error) return res.status(500).send(error.message);
        // console.log(results)
        // Run another query inside that looks for the First and Last names of the employees table, based on the Account ID pulled from the previous query
        pool.query(`select First_Name, Last_Name from Employees where Acc_ID = ${results[0].Acc_ID}`,
        function (error, results, fields) {
            // If successful, send back an error message
            if (error) return res.status(500).send(error.message);
            // Otherwise, send back the results
            res.send(results)
        })
    })
})

// ***************** LOGIN MANIPULATION ***************************
//register a new user
router.post('/register', async (req,res) => {
try{
    //check the body and send an error if there are nulls in any of the parts.
    if (req.body.newAccount.first_name === null || req.body.newAccount.last_name === null || req.body.newAccount.email === null || req.body.newAccount.password === null || req.body.newAccount.first_name === "" || req.body.newAccount.last_name === "" || req.body.newAccount.email === "" || req.body.newAccount.password === "")
    {
        // If there is an error, send an alert asking to fill all fields out in the form before submission
        res.status(500).send("Please fill out all fields in the form before submission.")
    }
    else {
        // Print out the contents of the parameter passed into the route
        // console.log(req.body.newAccount)
        
        // Define the number of salts that will be done to encrypt the password
        const salt = 10;
        // let password = bcrypt.hash(req.body.newAccount.password, 10);

        //encrypts the new user password 
        let password = await bcrypt.hash(req.body.newAccount.password, salt);
        //holds the user account information(includes newly encrypted password)
        let Account = {Email: req.body.newAccount.email, Password: password}
        //inserts the Account variable into the database in the table accounts
        pool.query(`INSERT INTO accounts SET ? `, Account,
        function(error, results, fields) {
            //sends an error if not able to register user
            if (error)  res.status(500).send(error.message);
            else{
                //registers the employee name associated with the newly created account using the newly created account Id generated by the accounts table
                let Employee = {Acc_ID: results.insertId, First_Name: req.body.newAccount.first_name, Last_Name: req.body.newAccount.last_name}
                pool.query(`INSERT INTO employees SET ? `, Employee,
                function (error, results, fields) {
                    //sends error if there was an issue inserting an employee into the employees table
                    if (error)    res.status(500).send(error.message);
                    // Send the results back saying the query was successful
                    res.send(results);
                })
            }
        })
    }
}
    
    catch(error){
    }

    //save the information into the database

})

//login the user
router.post('/login', async(req,res) => {
    // console.log(req.body);
    //
    try{
        //query's the database to find the user with the submitted email address
        pool.query(`Select * from accounts where Email = \"${req.body.User.email}\";`, 
        //if fails to find the email, this process returns an error stating that the user could not be found
        async function(error, results, fields) {
            // console.log("Beep")
            // console.log(results[0])
            const user = results[0];
            // this.user = results;
            // console.log(user.length == 0);
            // console.log("Password: " + user[0].Password);
            if(user === null || user === undefined)
            { res.send("Invalid password")}
            else{
                
                // console.log("Password for success: " + user.Password);
                    //next process checks to see if the password is correct by encrypting it and comparing it with the original encrypted password of the user located int he database
                    const validPass= await bcrypt.compare(req.body.User.password, user.Password);
                    //if the process fails, it will send an invalid password msg to the front-end notifying that it was a wrong password
                    if(!validPass) res.send("Invalid password");
                    //if passed the user ID will be passed and the user will be verified
                    else {
                        res.send(results)
                    }
            }

        })
    }
    catch(error){
        // If the try block code does not execute, send back an error message
        res.status(500).send(error.message);
    }
        
})

// ***************** EMAIL MANIPULATION ***************************
//will send all the transactions from the transactions table along with data from their associated tables 
router.post('/emailtransactions/:id', async(req,res) => {

    try{
        //querys the database using the transactionReport() procedure created in the database to pull all transactions
        pool.query(`Call transactionReport();`,
        function(error, results, fields) {
                //used to create a object that sends emails to the specified user
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        //login information for sending email
                    user: 'aosynthesistestemail@gmail.com',
                    pass: 'Aosynth123'
                    }
                });
        
                // Provide the information on what email address the information will be sent from and what the title of the email will be
                var mailOptions = {
                    from: 'aosynthesistestemail@gmail.com',
                    to: `${req.params.id}`,
                    subject: 'AOS Inventory Management System: Transactions Report',
                    // text: JSON.stringify(JSON.parse(results),null,2)
                    text: JSON.stringify(results, null, 2)
                };
            
            // Send the email thorugh
            transporter.sendMail(mailOptions, function(error, info){
                // If there is an error, send back an error message
                if (error) {
                    res.status(500).send(error.message); 
                } else {
                    // Otherwise, notify in the console that the email was sent, along with the response attached to it
                    // console.log('Email sent: ' + info.response);
                    // Send back the results of a successful insertion
                    res.send(results);
                }
            })
        })
    }
    catch(error){
        //sends an uncaught error if something went wrong with sending the email
        res.status(500).send(error.message);
    }

})
        //sends a list of all products to the specified email address that was submitted
router.post('/emailproducts/:id', async(req,res) => {

    try{
        //querys the batches table to gather a list of all products to send to the specified user
        pool.query(`select CAS_No, Compound, Purity, P_F_R, Obtainment_Date, Documented_Date, Notes from products join batches using (Batch_ID) group by CAS_No;`,
        function(error, results, fields) {
            //object created to send emails
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    //login for sending email
                user: 'aosynthesistestemail@gmail.com',
                pass: 'Aosynth123'
                }
            })
            
            var mailOptions = {
                //options that tells what to be sent in email
                from: 'aosynthesistestemail@gmail.com',
                to: `${req.params.id}`,
                subject: 'AOS Inventory Management System: Products Report',
                // text: JSON.stringify(JSON.parse(results),null,2)
                text: JSON.stringify(results, null, 2)
            };
            // initiates the sending of the email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    //if something goes wrong with sending an email, an error message will be sent
                    res.status(500).send(error.message); 
                } else {
                    //will send a success message back to the front-end stating that the email was successfully sent
                    // console.log('Email sent: ' + info.response);
                    res.send(results);
                }
            })

        })
    }
    catch(error){
        //send an uncaught error message to the front-end if there was an error sending the message to the user
        res.status(500).send(error.message);
    }

})

//Will send an email to the specified user with a list of all the customers
router.post('/emailcustomers/:id', async(req,res) => {
    try{
        // console.log(req.params.id);
        //don't know where data went to, leave incase it breaks something
        let data;
        //querys the database for a list of all customers and their information in the customers table
        pool.query(`select Cust_Name, Email, Phone_No, State_Name, City_Name, Zip_Code from customers group by Cust_Name;`,
        function(error, results, fields) {
            //object created for sending emails
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    //login information for sending email
                user: 'aosynthesistestemail@gmail.com',
                pass: 'Aosynth123'
                }
            });
            
            var mailOptions = {
                //options that tell what to be sent in the email
                from: 'aosynthesistestemail@gmail.com',
                to: `${req.params.id}`,
                subject: 'AOS Inventory Management System: Customers Report',
                // text: JSON.stringify(JSON.parse(results),null,2)
                text: JSON.stringify(results, null, 2)
            };
            
            //initiates the sending process
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    //will return an error to the front-end if could not send
                    res.status(500).send(error.message); 
                } else {
                    //will return an email success to the front-end if could send successfully
                // console.log('Email sent: ' + info.response);
                res.send(results);
                }
            })
        })
    }
    catch(error){
        //catch uncaught errors when attempting to send to user
        res.status(500).send(error.message);
    }
}),
// router.post('/customersCSV', async(req,res) => {
    
//     try{
       
//         pool.query(`select Cust_Name, Email, Phone_No, State_Name, City_Name, Zip_Code from customers group by Cust_Name;`, 
//             function(error, result, fields) {
//                 // Send an error if the deletion cannot happen
//                 if (error) res.status(500).send(error.message);
//                 // otherwise show a success and send back a result 
//                 console.log('Success')
//                 res.send(result);
//         })
//     }
//     catch(error){
//         // Send back an error message if there is an issue connecting to the database
//         res.status(500).send(error.message);
//     }
// })




module.exports = router;