<template> 
<!-- Form to signup a user into the application (can only be done by someone already logged into the application) -->
  <div class ="container text-center py-5">
    <div class="card" v-if="userToken">
      <div class="card-header">
      <h4>PLEASE ENTER THE FOLLOWING</h4>
      </div>
      <br>
      <div class="card-body">
      <form>
        <!-- enter the first name of the user -->
        <div class="form-group">
          <label><h5>FIRST NAME</h5></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><img src="../assets/customer.svg"/></span>
            </div>
            <input type="text" class="form-control" placeholder="Enter first name" id="first_name" v-model="form.first_name" required>
            <!-- validation is done to ensure the user knows to fill out the first name -->
            <b-form-invalid-feedback :state="first_name_validation">
              Make sure to enter a First Name
            </b-form-invalid-feedback>
          </div>
        </div>
        <!-- enter the last name of the user -->
        <div class="form-group">
          <label><h5>LAST NAME</h5></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><img src="../assets/customer.svg"/></span>
            </div>
            <input type="text" class="form-control" placeholder="Enter last name" id="last_name" v-model="form.last_name" required>
             <!-- validation is done to ensure the user knows to fill out the last name -->
            <b-form-invalid-feedback :state="last_name_validation">
              Make sure to enter a Last Name
            </b-form-invalid-feedback>
          </div>
        </div>
        <!-- enter the user's email address -->
        <div class="form-group">
          <label><h5>EMAIL</h5></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><img src="../assets/email.svg"/></span>
            </div>
            <input type="email" class="form-control" placeholder="Enter email address" id="email" v-model="form.email" required>
            <!-- validation is done to ensure the user knows to fill out the email portion -->
            <b-form-invalid-feedback :state="email_validation">
              Make sure to enter an Email
            </b-form-invalid-feedback>
          </div>
       </div>
       <!-- enter the user's password -->
       <div class="form-group">
         <label><h5>PASSWORD</h5></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text"><img src="../assets/password.svg"/></span>
            </div>
            <input  type="password" class="form-control" placeholder="Enter password" id="password" v-model="form.password" required>
            <!-- validation is done to ensure the user knows to fill out the password portion -->
            <b-form-invalid-feedback :state="password_validation">
              Make sure to enter a Password
            </b-form-invalid-feedback>
          </div>
       </div>
       <br>
       <div class="row">
         <div class="col">
           <!-- When the user clicks register, it will execute the addAccount() function -->
          <button type="submit" class="btn btn-primary btn-sm btn-block" @click.stop.prevent="addAccount()">REGISTER</button>
         </div>
         <!-- otherwise, it will allow the user to go back to the home page -->
         <div class="col">
          <button type="submit" class="btn btn-secondary btn-sm btn-block" @click="$router.push('/home')">RETURN</button>
         </div>
       </div>
       <!-- Provide a status if there is an error, though it is not used effectively -->
       <p v-if="status" class= "danger font-italic font-weight-bold text-danger text-center">{{status}}</p>
      </form>
      </div>
    </div>

    <!-- If a user is not logged in, they will be rerouted back to the login page -->
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
// import {minLength, required} from 'vuelidate/lib/validators'
import SlotService from "@/services/SlotService";
export default {
    name: "Register",
    data(){
        return{
          // form will capture all the fields entered, but by default all values will be empty
            form: {
                first_name: null,
                last_name: null,
                email: null,
                password: null,
                // status: null,
                token:null
            },
        }
    },
    //Client-side validation. I have validation on server-side also (schema). 
    // This client-side validation is used to display the errors to the user.
    //  validations: {
    //    name:{
    //      required,
    //    },
    //    email:{
    //      required
    //    },
    //    password:{
    //      required,
    //      minLength: minLength(6)
    //    }
    // },

    methods:{
    // this is the method to add the account
    async addAccount() {
      // this is to test and make sure the form information is passed
      console.log(JSON.stringify(this.form));
      // use the axios route to add the account by sending it to the database
      await SlotService.addAccount({  
        newAccount: this.form
      }).then((result)=>{
        // afterwards, if successful, send an alert letting the user know that the insert was successful and
        // send them back to the login screen
      this.$alert("Great!", `You have successfully created an account`).then( response =>{this.$router.push({ name: "Login" })
      })})
      // otherwise, catch the error and print out the error through the alert
      .catch((error) => {
        this.$alert(error.response.data)
      });

    

      //    this.$alert("Success! Your Supplier information has been added!").then(response => {
      //   this.$router.push({ name: "Suppliers" });
      // })
    },
    
      //Creates a new user for login
        //   onSubmit(){
        //     this.$v.$touch();
        //     if(!this.$v.$invalid){
        //     let formData={
        //         name: this.name,
        //         email: this.email,
        //         password: this.password
        //      }

        //         // axios.post('http://localhost:3000/api/user/register', formData).then(res=>{
        //         //   this.status = null
        //         //   this.$alert("Account has been created");
        //         //     }).catch(err=>{
        //         //         this.errors = err.response.data.errors;
        //         //         this.status = err
                        
        //         //           })  
        //             }
        //     }
    },
    computed: {
      // use to determine whether the user is logged in or not
      userToken() {
        return this.$store.getters.getUser
      },
      // ensure the first name field is not null or empty string
      first_name_validation(){
        return this.form.first_name !== "" && this.form.first_name !== null;
      },
      // ensure the last name field is not null or empty string
      last_name_validation(){
        return this.form.last_name !== "" && this.form.last_name !== null;
      },
      // ensure the email field is not null or empty string
      email_validation(){
        return this.form.email !== "" && this.form.email !== null;
      },
      // ensure the password field is not null or empty string
      password_validation(){
        return this.form.password !== "" && this.form.email !== null;
      },
    }
 
}
</script>

<style scoped>

</style>