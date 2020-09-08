<template>
  <div v-if="!$store.getters.logged" class="row justify-content-center align-content-center">

    <div class="col-3 card card-body text-center">
      <form>
        <div class="form-group">
          <label> Username
            <input type="text" class="form-control" v-model="username" placeholder="Login">
          </label>
        </div>
        <div class="form-group">
          <label>Password
            <input type="password" class="form-control" v-model="password" placeholder="Password">
          </label>
        </div>
        <button type="button" class="btn btn-primary" @click="login">Sing in</button>
        <div class="form-group">
          <span v-if="$store.getters.message" style="color: red"> {{ $store.getters.message }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Singin",
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", {username: this.username, password: this.password})
    }
  }
}
</script>

<style scoped>

</style>