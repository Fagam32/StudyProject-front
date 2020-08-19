<template>
  <div>
    <b-button class="btn btn-dark" @click="getAllStations">Refresh</b-button>
    <b-button class="btn btn-dark" @click="showNewStationModal">Add</b-button>
    <b-table :items="stations" :fields="fields" striped head-variant="light" sticky-header="500px">
      <template v-slot:cell(actions)="{item}">

        <b-button-group>
          <b-button class="btn btn-info" type="button">
            <b-icon icon="info-square"></b-icon>
          </b-button>

          <b-button class="btn btn-secondary" type="button" @click="showUpdateModal(item)">
            <b-icon icon="pencil"></b-icon>
          </b-button>

          <b-button class="btn btn-danger" type="button" @click="deleteStation(item.id)">
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-button-group>

      </template>
    </b-table>

    <b-modal
        ref="stationUpdateModal"
        centered
        :title="modalStation.title"
        @hide="resetModalInfo"
        @ok="updateStation"
    >
      <b-form-input
          id="stationNameInput"
          placeholder="New station name"
          v-bind:value="modalStation.content.name"
          v-model="modalStation.content.name"
      />
      <b-form-input
          hidden
          v-bind:value="modalStation.content.id"
      />
    </b-modal>

    <b-modal
      ref="newStationModal"
      centered
      title="Add new Station"
      @hide="resetModalInfo"
      @ok="addNewStation"
    >
      <b-form-input
      v-model="modalStation.content.name"
      />
    </b-modal>
  </div>
</template>

<script>


export default {
  name: "Stations",
  data() {
    return {
      fields: [
        {
          key: "id",
          sortable: true,
          label: "Id"
        },
        {
          key: "name",
          sortable: true,
          label: "Station name",
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      stations: [
        {id: 1, name: "A"},
        {id: 2, name: "B"},
        {id: 3, name: "C"},
        {id: 4, name: "D"}
      ],
      modalStation: {
        title: 'Edit station',
        content: {
          id: '',
          name: ''
        },
      },
    }
  },
  created() {
    this.getAllStations()
  },
  methods: {
    showNewStationModal(){
      this.$refs['newStationModal'].show()
    },
    deleteStation(id) {
      this.$axios.delete('/stations/' + id)
          .then(() => {
            for (let i = 0; i < this.stations.length; i++) {
              if (this.stations[i].id === id) {
                this.stations.splice(i, 1)
              }
            }
          })
      .catch(error => console.log(error))
    },
    replaceStation(id, content) {
      for (let i = 0; i < this.stations.length; i++) {
        if (this.stations[i].id === id) {
          this.stations[i].name = content.name
          break
        }
      }
    },
    updateStation() {
      const id = this.modalStation.content.id;
      this.$axios.put("/stations/" + id, this.modalStation.content)
          .then(result => {
            this.replaceStation(id, result.data)
          })
          .catch(error => {
            console.log(error)
          })
    },

    showUpdateModal(item) {
      this.modalStation.content = Object.assign({}, item)
      this.$refs['stationUpdateModal'].show()
    },
    resetModalInfo() {
      this.modalStation.content = {}
    },
    getAllStations() {
      this.$axios.get('/stations')
          .then(result => {
            this.stations = result.data
          })
          .catch(error => {
            console.log(error)
          })
    },
    addNewStation(){
      this.$axios.post("/stations",{
        name : this.modalStation.content.name
      })
      .then(result =>{
        this.stations.push(result.data)
      })
      .catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>

</style>