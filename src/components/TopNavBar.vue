<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/">Home</b-nav-item>
        <b-nav-item href="/trains">Trains</b-nav-item>
        <b-nav-item href="/stations">Stations</b-nav-item>
        <b-nav-item href="/edges">Edges</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            Profile
          </template>
          <b-dropdown-item href="/settings">Settings</b-dropdown-item>
          <b-dropdown-item href="/logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>

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