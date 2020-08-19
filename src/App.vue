<template>
  <div class="app">
    <top-nav-bar class="top-nav-bar"/>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import TopNavBar from "@/components/TopNavBar";

export default {
  name: 'App',
  components: {
    "top-nav-bar": TopNavBar
  }
}
</script>

<style>
.app {
  margin-bottom: 2px;

}
</style>
