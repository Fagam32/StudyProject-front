<template>
  <div v-if="this.$store.getters.logged" class="row justify-content-center align-content-center container text-center">
    <div class="col-3 card card-body">
      <form>
        <div class="form-group text-center">
          <label>Username
            <input type="text" class="form-control" v-model="settings.userName" placeholder="Username" disabled>
          </label>
        </div>
        <div class="form-group text-center">
          <label>Email
            <b-input type="email" v-model="settings.email" v-bind:value="settings.email" placeholder="Email"></b-input>
          </label>
        </div>
        <div class="form-group text-center">
          <label>Name
            <input type="text" class="form-control" v-model="settings.name" placeholder="Name">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Surname
            <input type="text" class="form-control" v-model="settings.surname" placeholder="Surname">
          </label>
        </div>
        <div class="form-group text-center">
          <label>Birthdate
            <input type="date" class="form-control" v-model="settings.birthdate" placeholder="Birthdate">
          </label>
        </div>
        <button type="submit" class="form-group btn btn-primary" @click="sendSaveRequest">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      settings: {
        email: '',
        userName: '',
        name: '',
        surname: '',
        birthdate: '',
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$axios.get("http://localhost:8000/user?full=true", {
        headers: {Authorization: this.$store.getters.token}
      }).then(result => {
        this.settings = result.data
      })
    },
    sendSaveRequest() {
      this.$axios.put("http://localhost:8000/user", {
        name: this.settings.name,
        surname: this.settings.surname,
        email: this.settings.email,
        birthdate: this.settings.birthdate
      },
          {headers: {Authorization: this.$store.getters.token}})
          .then(() => {
            this.getUserInfo()
          })
    }
  }
}
</script>

<style scoped>

</style>