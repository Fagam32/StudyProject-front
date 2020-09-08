<template>
  <div class="row justify-content-center align-content-center container text-center">
    <div class="col-3 card card-body">
      <form>
        <div class="form-group text-center">
          <label>Email
            <b-input type="email" v-model="email" placeholder="Email"></b-input>
          </label>
        </div>
        <div class="form-group text-center">
          <label>Username
            <input type="text" class="form-control" v-model="username" placeholder="Username">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Password
            <input type="password" class="form-control" v-model="password" placeholder="Password">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Name
            <input type="text" class="form-control" v-model="name" placeholder="Name">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Surname
            <input type="text" class="form-control" v-model="surname" placeholder="Surname">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Birthdate
            <input type="date" class="form-control" v-model="birthdate" placeholder="Birthdate">
          </label>
        </div>
        <button type="submit" class="form-group btn btn-primary" @click="sendRequest">Sing up</button>
        <div class="form-group text-center">
          <span v-if="$store.getters.message" style="color: red"> {{ $store.getters.message }}</span>
          <span v-if="message" style="color: red"> {{ message }}</span>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "Singup",
  data() {
    return {
      email: '',
      username: '',
      password: '',
      name: '',
      surname: '',
      birthdate: '',
      message: ''
    }
  },
  methods: {
    checkForm() {
      if (!this.username.trim()) {
        this.message = "Fill username"
        return false
      }
      if (!this.password) {
        this.message = "Fill password"
        return false
      }
      if (!this.name.trim()) {
        this.message = "Fill name"
        return false
      }
      if (this.surname.trim().length === 0) {
        this.message = "Fill surname"
        return false
      }
      if (!this.birthdate) {
        this.message = "Fill birthdate"
        return false
      }
      return true
    },
    sendRequest(form) {
      form.preventDefault();
      if (this.checkForm()) {
        this.$axios.post("http://localhost:8000/auth/singup", {
          username : this.username,
          name : this.name,
          surname : this.surname,
          email : this.email,
          birthdate : this.birthdate,
          password : this.password
        }).then(() => {
          router.push({path:"singin"})
        }).catch(error => {
          this.message = error.response.data.message
        })
      }
    }
  }
}
</script>

<style scoped>

</style>