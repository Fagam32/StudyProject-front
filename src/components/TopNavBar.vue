<template>

  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/">Home</b-nav-item>
        <div v-if="$store.getters.roles.includes('ADMIN')">
          <b-nav-item href="/trains">Trains</b-nav-item>
        </div>
        <div v-if="$store.getters.roles.includes('USER')">
          <b-nav-item href="/stations">Stations</b-nav-item>
        </div>
        <div v-if="$store.getters.roles.includes('ADMIN')">
          <b-nav-item href="/edges">Edges</b-nav-item>
        </div>
        <div>
          <b-nav-item href="/search">Search</b-nav-item>
        </div>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <div v-if="$store.getters.logged">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              Profile
            </template>
            <b-dropdown-item href="/mytickets">My tickets</b-dropdown-item>
            <b-dropdown-item href="/settings">Settings</b-dropdown-item>
            <b-dropdown-item href="/logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>

        <div v-else>
          <router-link to="/singup" class="mr-2">Sing up</router-link>
          <router-link to="/singin">Sign in</router-link>
        </div>

      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

</template>

<script>
export default {
  name: "TopNavBar"
}
</script>

<style scoped>

</style>