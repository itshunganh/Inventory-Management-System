<style scoped>

</style>

<template>
 <div class ="container text-center py-5">
    <div class="card">
      <div class="card-header">
      <h4>PLEASE LOG IN BELOW</h4>
      </div>
      <br>
      <div class="card-body">
        <!-- When the form is submitted, execute the login method instead of letting the form complete its default
        functions -->
       <form @submit.prevent="login">
         <!-- enter the email -->
         <div class="form-group">
           <label><h5>EMAIL</h5></label>
           <div class="input-group mb-3">
             <div class="input-group-prepend">
               <span class="input-group-text"><img src="../assets/email.svg"/></span>
             </div>
             <input type="text" class="form-control" placeholder="Enter email address" aria-label="Emaill" aria-describedby="basic-addon1" v-model="user.email">
            </div>
          </div>
          <!-- enter the password -->
         <div class="form-group">
           <label><h5>PASSWORD</h5></label>
           <div class="input-group mb-3">
             <div class="input-group-prepend">
               <span class="input-group-text"><img src="../assets/password.svg"/></span>
             </div>
             <input type="password" class="form-control" placeholder="Enter password" aria-label="Password" aria-describedby="basic-addon2" v-model="user.password">
            </div>
         </div>
         <br>
         <!-- when clicked, will execute the submission, which will have the form execute the login() method -->
         <button type="submit" class="btn btn-sm btn-primary btn-block"><img src="../assets/login.svg"/><b> Log In</b></button>
         <!-- log out button here is used for testing to make sure the login system is properly working -->
         <!-- <button v-if="userToken" class="btn btn-danger" @click="logout()">Logout</button> -->

         <!-- Tag to register, though its commented out to prevent outsiders from registering into the system -->
         <!-- <br><p>Don't have an account? <router-link to="/register"><button type="button" class="btn btn-sm btn-success"><b>Register</b></button></router-link></p> -->
         
         <!-- status is used to output the error to the login page, though its not utilized -->
         <p v-if="status" class= "danger font-italic font-weight-bold text-danger text-center">{{status}}</p>
       </form> 
       </div>
    </div>
  </div>
</template>


<script>

// import axios from 'axios'
import SlotService from "@/services/SlotService";


export default {
    name: 'Login',
     

    data(){
        return{       
            user: {
              email: null,
              password: null,
              token: null
            },
            status: null ,
            // validation rule to ensure its not null and is at least 6 characters in length
            inputRules: [
              v => ( v && v.length >= 6) 
              ] 
        }
    },
   methods:{
     //Method to login 
     
         async login(){
          //  test to ensure the login function is executed
            console.log("This works")
            // take the credentials from the form and submit it to the backend application, which will verify with the
            // database to see whether the credentials exist
                await  SlotService.login({User: this.user})
                  // After the verificatino occurs
                 .then(res=>{
                  //  If the result returned is invalid password,
                   if (res.data === 'Invalid password')
                   {
                  // this.$alert("Wrong log in!").then(response => {
                  //           this.$router.push({name:'Login'})
                  //           })
                  // Send out an alert saying that the wrong login was used
                  this.$alert("Wrong log in!")
                     console.log("Invalid password was entered; please enter the correct password")
                    //  this.$router.push('/')
                   }
                  //  otherwise,
                   else {
                    //  take the response data and place it into the email, password, and acc_id variables
                    let dummyuser = res.data;
  

                    let email = dummyuser[0].Email;
                    let password = dummyuser[0].Password;
                    let acc_id = dummyuser[0].Acc_ID

                    console.log ("account info: ")
                    // which will be stored into the store.js to let the application know that users successfully
                    // logged in and will maintain that status
                    this.$store.commit('loginUser', {email, password, acc_id})
                    // this.$alert("Successfully logged in");
                    console.log("Successful login");

                    // console.log("Here is acc_id token: " + this.$store.getters.getUser);
                    // then pull out an alert letting the user know they logged in successfully and take them to the home
                    // page
                     this.$alert("You have successfully logged in!").then(response => {
                            this.$router.push({name:'Home'})})

                    // this.$router.go('/Home')
                   }
          
             
                 }).catch(err=>{ 
              
                  // console.log(err)
                  // this.status = err
                  // this.errors = err.response.data.errors;
                  // console.log(err)
                  // this.status = err
                  })
             },
          
    // this function will allow the user to log out, and was used for testing purposes to see if hte login system verified
    // correctly
    logout(){
      const token = null
      this.$store.commit('logout', {token})
      // this.$router.push('/')
    },

   },
  //Getters for token
   computed:{
    //  this is to figure out whether the user was logged in or not, but is not used since this is the login page
      userToken(){
        return this.$store.getters.getUser
      }
    }
 
}
</script>