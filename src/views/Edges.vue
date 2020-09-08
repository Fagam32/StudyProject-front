<template>
  <div v-if="$store.getters.roles.includes('ADMIN')">
    <b-button class="btn btn-primary" @click="showAddEdgeModal">Add Edge</b-button>
    <b-button class="btn btn-dark" @click="getAllEdges">Refresh</b-button>
    <b-table :items="edges" :fields="fields" striped head-variant="light" sticky-header="500px">
      <template v-slot:cell(actions)="{item}">

        <b-button-group>
          <b-button class="btn btn-info" type="button">
            <b-icon icon="info-square"></b-icon>
          </b-button>

          <b-button class="btn btn-secondary" type="button" @click="showUpdateModal(item)">
            <b-icon icon="pencil"></b-icon>
          </b-button>

          <b-button class="btn btn-danger" type="button" @click="deleteStation(item.fromStation, item.toStation)">
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-button-group>

      </template>
    </b-table>

    <b-modal
        ref="addEdgeModal"
        centered
        size="lg"
        title="Add new Edge"
        @hide="resetModalInfo"
        @ok="addNewEdge">
      <b-container>
        <b-row class="m-3">
          <b-col><span v-if="!addEdgeModal.fromSelected" style="color: red">Select from list</span></b-col>
          <b-col><span v-if="!addEdgeModal.toSelected " style="color: red">Select from list</span></b-col>
          <b-col><span v-if="addEdgeModal.distance <= 0" style="color: red">Distance must be more 0</span></b-col>
        </b-row>
        <b-row class="m-3">
          <b-col>
            <vue-autosuggest
                :suggestions="suggestionsForFrom"
                :limit="10"
                @selected="onSelectedForFrom"
                @input="onInputChangeForFrom"
                :input-props="inputPropsForFrom"
            ></vue-autosuggest>
          </b-col>
          <b-col>
            <vue-autosuggest
                :suggestions="suggestionsForTo"
                :limit="10"
                @selected="onSelectedForTo"
                @input="onInputChangeForTo"
                :input-props="inputPropsForTo"
            ></vue-autosuggest>
          </b-col>
          <b-col>
            <b-input type="number" min="1" placeholder="Distance" v-bind:value="addEdgeModal.distance"
                     @change="distanceChange"/>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>

    <b-modal
        ref="updateEdgeModal"
        centered
        size="lg"
        title="Update Edge"
        @hide="resetModalInfo"
        @ok="updateEdge"
    >
      <b-form-group>
        <b-form-row>
          <b-col class="text-center">From</b-col>
          <b-col class="text-center">To</b-col>
          <b-col class="text-center">
            <div style="color: red" v-if="updateEdgeModal.distance <= 0"> Distance is not valid</div>
            <div v-else>Distance</div>
          </b-col>
        </b-form-row>

        <b-form-row>
          <b-col>
            <b-input
                v-bind:value="updateEdgeModal.fromStation"
                disabled
            ></b-input>
          </b-col>
          <b-col>
            <b-input
                v-bind:value="updateEdgeModal.toStation"
                disabled
            ></b-input>
          </b-col>
          <b-col>
            <b-input
                v-bind:value="updateEdgeModal.distance"
                v-model="updateEdgeModal.distance"
                type="number"
            ></b-input>
          </b-col>
        </b-form-row>
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "Edges",
  data() {
    return {
      fields: [
        {
          key: "fromStation",
          sortable: true,
          label: "From"
        },
        {
          key: "toStation",
          sortable: true,
          label: "To"
        },
        {
          key: "distance",
          sortable: true,
          label: "Distance in minutes"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      edges: [],
      addEdgeModal: {
        fromStation: '',
        fromSelected: false,
        toStation: '',
        toSelected: false,
        distance: -1
      },
      suggestionsForFrom: [{data: []}],
      suggestionsForTo: [{data: []}],
      inputPropsForFrom: {
        id: "autosuggestForFrom",
        class: 'form-control',
        placeholder: "From"
      },
      inputPropsForTo: {
        id: "autosuggestForTo",
        class: 'form-control',
        placeholder: "To"
      },
      updateEdgeModal: {
        fromStation: '',
        toStation: '',
        distance: -1,
      }
    }
  },
  created() {
    this.getAllEdges()
  },
  methods: {
    getAllEdges() {
      this.$axios.get('/edges', {headers: {Authorization: this.$store.getters.token}})
          .then(result => {
            this.edges = result.data;
          })
    },
    showAddEdgeModal() {
      this.$refs['addEdgeModal'].show()
    },
    resetModalInfo() {
      this.addEdgeModal.fromStation = this.addEdgeModal.toStation = ''
      this.addEdgeModal.fromSelected = this.addEdgeModal.toSelected = false
      this.addEdgeModal.distance = this.updateEdgeModal.distance = -1
      this.updateEdgeModal.fromStation = this.updateEdgeModal.toStation = ''
    },
    distanceChange(value) {
      this.addEdgeModal.distance = value
    },
    onInputChangeForFrom(text) {
      this.addEdgeModal.fromSelected = false
      this.suggestionsForFrom[0].data.length = 0
      if (text === '' || text === undefined || text.length < 2)
        return;

      this.$axios.get('/stations/?name=' + text, {headers: {Authorization: this.$store.getters.token}})
          .then(result => {
            result.data.forEach(station => {
              this.suggestionsForFrom[0].data.push(station.name)
            })
          })
    },
    onInputChangeForTo(text) {
      this.addEdgeModal.toSelected = false
      this.suggestionsForTo[0].data.length = 0
      if (text === '' || text === undefined || text.length < 2)
        return;

      this.$axios.get('/stations/?name=' + text, {headers: {Authorization: this.$store.getters.token}})
          .then(result => {
            result.data.forEach(station => {
              this.suggestionsForTo[0].data.push(station.name)
            })
          })
    },
    onSelectedForFrom(option) {
      this.addEdgeModal.fromStation = option.item
      this.addEdgeModal.fromSelected = true
    },
    onSelectedForTo(option) {
      this.addEdgeModal.toStation = option.item
      this.addEdgeModal.toSelected = true
    },
    addNewEdge(modalEvent) {
      if (!this.addEdgeModal.fromSelected || !this.addEdgeModal.toSelected || this.addEdgeModal.distance <= 0)
        modalEvent.preventDefault()
      else {
        this.$axios.post('/edges',
            {
              fromStation: this.addEdgeModal.fromStation,
              toStation: this.addEdgeModal.toStation,
              distance: this.addEdgeModal.distance
            },
            {
              headers:
                  {
                    'content-type': 'application/json',
                    Authorization: this.$store.getters.token
                  }
            })
            .then(this.getAllEdges)
      }
    },
    showUpdateModal(item) {
      this.updateEdgeModal.fromStation = item.fromStation
      this.updateEdgeModal.toStation = item.toStation
      this.updateEdgeModal.distance = item.distance
      this.$refs['updateEdgeModal'].show()
    },
    updateEdge(modalEvent) {
      let modalData = this.updateEdgeModal;
      if (modalData.distance <= 0) {
        modalEvent.preventDefault()
      }
      this.$axios.put('/edges',
          {
            fromStation: modalData.fromStation,
            toStation: modalData.toStation,
            distance: modalData.distance
          },
          {headers: {Authorization: this.$store.getters.token}}
      )
          .then(result => {
            let edges = this.edges;
            let data = result.data;
            for (let i = 0; i < edges.length; i++) {
              if (edges[i].fromStation === data.fromStation && edges[i].toStation === data.toStation) {
                edges[i].distance = data.distance
                break
              }
            }
          })
    },
    deleteStation(fromStation, toStation) {
      this.$axios.delete('/edges/' + fromStation + '/' + toStation, {headers: {Authorization: this.$store.getters.token}})
          .then(() => {
            let edges = this.edges;
            for (let i = 0; i < edges.length; i++) {
              if (edges[i].fromStation === fromStation && edges[i].toStation === toStation) {
                edges.splice(i, 1)
                break
              }
            }
          })
    }
  }
}
</script>

<style scoped>

</style>