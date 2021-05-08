import axios from 'axios'

export default() => {
  return axios.create({
    // Link to front end: https://aosyntht.herokuapp.com/
    // Link to the backend API in heroku
    baseURL: `https://aosynth-inv-api.herokuapp.com`
    // link to backend API through localhost machine
    // baseURL: `http://localhost:3000`
  })
}
