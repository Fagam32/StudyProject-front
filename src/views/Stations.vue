<template>
  <div>
    <b-button class="btn btn-dark" @click="getAllStations">Refresh</b-button>
    <b-button v-if="$store.getters.roles.includes('ADMIN')" class="btn btn-dark" @click="showNewStationModal">Add
    </b-button>
    <b-table :items="stations" :fields="fields" striped head-variant="light" sticky-header="500px">
      <template v-slot:cell(actions)="row">

        <b-button-group>
          <b-button class="btn btn-info" type="button" @click="goToStationInfo(row.item.name)">
            <b-icon icon="info-square"></b-icon>
          </b-button>

          <b-button v-if="$store.getters.roles.includes('ADMIN')" class="btn btn-secondary" type="button"
                    @click="showUpdateModal(row.item)">
            <b-icon icon="pencil"></b-icon>
          </b-button>

          <b-button v-if="$store.getters.roles.includes('ADMIN')" class="btn btn-danger" type="button"
                    @click="deleteStation(row.item.name)">
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-button-group>

      </template>
    </b-table>

    <b-modal
        ref="updateStationModal"
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


import router from "@/router";

export default {
  name: "Stations",
  data() {
    return {
      fields: [
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
      ],
      modalStation: {
        title: 'Edit station',
        content: {
          prevName: '',
          name: ''
        },
      },
    }
  },
  created() {
    this.getAllStations()
  },
  methods: {
    showNewStationModal() {
      this.$refs['newStationModal'].show()
    },
    deleteStation(name) {
      this.$axios.delete('/stations/' + name, {headers: {Authorization: this.$store.getters.token}})
          .then(() => {
            for (let i = 0; i < this.stations.length; i++) {
              if (this.stations[i].name === name) {
                this.stations.splice(i, 1)
              }
            }
          })
          .catch(error => console.log(error))
    },
    replaceStation(name, content) {
      for (let i = 0; i < this.stations.length; i++) {
        if (this.stations[i].name === name) {
          this.stations[i].name = content.name
          break
        }
      }
    },
    updateStation() {
      const prevName = this.modalStation.content.prevName;
      this.$axios.put("/stations/" + prevName, {name: this.modalStation.content.name},
          {headers: {'content-type': 'application/json', Authorization: this.$store.getters.token}})
          .then(result => {
            this.replaceStation(prevName, result.data)
          })
          .catch(error => {
            console.log(error)
          })
    },

    showUpdateModal(item) {
      this.modalStation.content = Object.assign({}, item)
      this.modalStation.content.prevName = item.name;
      this.$refs['updateStationModal'].show()
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
    addNewStation() {
      this.$axios.post("/stations",
          {
            name: this.modalStation.content.name
          },
          {headers: {Authorization: this.$store.getters.token}})
          .then(result => {
            this.stations.push(result.data)
          })
          .catch(error => console.log(error))
    },
    goToStationInfo(name) {
      router.push({path: '/stations/' + name})
    }
  }
}
</script>

<style scoped>

</style>