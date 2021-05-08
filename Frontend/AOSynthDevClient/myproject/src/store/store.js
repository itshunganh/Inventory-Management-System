import Vue from 'vue'
import Vuex from 'Vuex'
Vue.use(Vuex)



export const store = new Vuex.Store({
    state:{
        // user store will hold basic user information
        user:{
            // first_name: null,
            // last_name: null,
            email: null,
            password: null,
            // token: null,
            acc_id: null
        }
    },
    getters:{
        // get whether the user's account id is filled in (aka if they are logged in or logged out)
        getUser: state =>{
            return (state.user.acc_id) ? true: false
        },
        // retrieve the account id of the user
        getUserID: state => {
            return state.user.acc_id
        }
    },
    mutations:{
        // when logging in, replace the email, password, and account id with the values entered in the login if authorized
        loginUser(state,{email, password, acc_id}){
            try{
                // state.user = userLogin 
                state.user.email = email;
                state.user.password = password;
                state.user.acc_id = acc_id;
            }catch(error){
                // log an error if it occurs irl
                console.log(error)
            }
        },
        // have the log out function equivalent to token, which is often null
        logout(state, {token}){
            state.user.acc_id = token
            state.user.email = token
            state.user.password = token
        }
        
    }

})