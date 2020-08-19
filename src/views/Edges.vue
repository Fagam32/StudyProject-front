<template>
  <div>
    <b-button class="btn btn-primary" @click="showAddEdgeModal">Add Edge</b-button>

    <b-modal
    ref="addEdgeModal"
    centered
    title="Add new Edge"
    @hide="resetModalInfo"
    @ok="addNewEdge">

    </b-modal>
  </div>
</template>

<script>
export default {
  name: "Edges",
  methods: {
    showAddEdgeModal(){
      this.$refs['addEdgeModal'].show()
    }
  }
}
</script>

<style scoped>

</style>