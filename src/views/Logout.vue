<template>
  <div>
    <span>Successfully logout</span>
  </div>
</template>

<script>
export default {
  name: "Logout",
  mounted() {
    this.$store.dispatch("logout")
  }
}
</script>

<style scoped>

</style>