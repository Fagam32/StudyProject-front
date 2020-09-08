<template>
  <div>
    <b-button @click="getTrainList">Refresh</b-button>
    <b-button @click="showAddTrainModal">Add Train</b-button>
    <b-table :items="trains" :fields="train_table_fields" striped head-variant="light">
      <template v-slot:cell(actions)="row">
        <b-button-group>
          <b-button class="btn btn-info" type="button" @click="row['toggleDetails']">
            <b-icon icon="info-square"></b-icon>
          </b-button>
          <b-button class="btn btn-primary" type="button" @click="goToTrainInfo(row.item.trainName)">
            <b-icon icon="card-text"></b-icon>
          </b-button>
          <b-button v-if="$store.getters.roles.includes('ADMIN')" class="btn btn-danger" type="button"
                    @click="deleteTrain(row.item.trainName)">
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-button-group>
      </template>

      <template v-if="$store.getters.roles.includes('ADMIN')" v-slot:row-details="row">
        <b-table :items="row.item.path" :fields="train_path_fields" small>
          <template v-slot:cell(standing)="row">
            <b-input size="sm" type="number" v-model="row.item.standing"></b-input>
          </template>
        </b-table>
        <b-button class="btn btn-info" type="button" @click="updateStandings(row.item.path)">Save</b-button>
        <b-button class="btn btn-secondary ml-3" type="button" @click="row['toggleDetails']">Close</b-button>
      </template>

      <template v-else v-slot:row-details="row">
        <b-table :items="row.item.path" :fields="train_path_fields" small>
          <template v-slot:cell(standing)="row">
            {{ row.item.standing }}
          </template>
        </b-table>

      </template>
    </b-table>

    <b-modal
        ref="addTrainModal"
        centered
        size="lg"
        title="Add new Train"
        @hide="resetModalInfo"
        @ok="addTrain"
    >
      <b-row class="ml-3 mt-1">
        <b-col>
          <b-input type="text" placeholder="Train name" v-model="addTrainModal.trainName"></b-input>
        </b-col>
        <b-col>
          <span>{{ addTrainModal.trainName }}</span>
        </b-col>
      </b-row>
      <b-row class="ml-3 mt-1">
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
          <span v-if="!addTrainModal.fromSelected" style="color: red">Select from list</span>
          <span v-else>{{ addTrainModal.fromStation }}</span>
        </b-col>
      </b-row>

      <b-row class="ml-3 mt-1">
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
          <span v-if="!addTrainModal.toSelected " style="color: red">Select from list</span>
          <span v-else>{{ addTrainModal.toStation }}</span>
        </b-col>
      </b-row>

      <b-row class="ml-3 mt-1">
        <b-col>
          <b-input type="number" min="1" placeholder="Seats numbers" v-bind:value="addTrainModal.seatsNumber"
                   @change="seatsNumberChanged"/>
        </b-col>
        <b-col>
          <span v-if="addTrainModal.seatsNumber <= 0" style="color: red">Seats number must be positive</span>
          <span v-else>{{ addTrainModal.seatsNumber }}</span>
        </b-col>
      </b-row>

      <b-row class="ml-3 mt-1">
        <b-col>
          <label>
            <input type="datetime-local" class="form-control" v-model="addTrainModal.departure">
          </label>
        </b-col>
        <b-col>
          <span> {{ addTrainModal.departure }}</span>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import moment from "moment";
import router from "@/router";

export default {
  name: "Trains",
  data() {
    return {
      train_table_fields: [
        {
          key: "trainName",
          label: "Name"
        },
        {
          key: "seatsNumber",
          label: "Seats"
        },
        {
          key: "fromStation",
          label: "From station"
        },
        {
          key: "toStation",
          label: "To station"
        },
        {
          key: "departure",
          label: "Departure"
        },
        {
          key: "arrival",
          label: "Arrival"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      train_path_fields: [
        {
          key: "stationName",
          label: "Station"
        },
        {
          key: "arrival",
          label: "Arrival"
        },
        {
          key: "standing",
          label: "Standing"
        },
        {
          key: "departure",
          label: "Departure"
        }
      ],
      trains: [],
      addTrainModal: {
        trainName: '',
        fromStation: '',
        fromSelected: false,
        toStation: '',
        toSelected: false,
        seatsNumber: '',
        departure: '',
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
    }
  },
  created() {
    this.getTrainList();
  },
  methods: {
    moment(date) {
      return moment(date).format('HH:mm D MMM YYYY')
    },
    getTrainList() {
      this.$axios.get('/trains').then(result => {
        this.trains = result.data;

        this.trains.forEach(train => {
          train.arrival = this.moment(train.arrival)
          train.departure = this.moment(train.departure)
          for (let i = 0; i < train.path.length; i++) {
            train.path[i].arrival = this.moment(train.path[i].arrival)
            train.path[i].departure = this.moment(train.path[i].departure)
          }

          train.path[0].standing = 0
          train.path[0].arrival = null
          train.path[train.path.length - 1].standing = 0
          train.path[train.path.length - 1].departure = null
        })
      })
    },
    showAddTrainModal() {
      this.$refs['addTrainModal'].show()
    },
    onInputChangeForFrom(text) {
      this.addTrainModal.fromSelected = false
      this.suggestionsForFrom[0].data.length = 0
      if (text === '' || text === undefined || text.length < 2)
        return;

      this.$axios.get('/stations/?name=' + text)
          .then(result => {
            result.data.forEach(station => {
              this.suggestionsForFrom[0].data.push(station.name)
            })
          })
    },
    onInputChangeForTo(text) {
      this.addTrainModal.toSelected = false
      this.suggestionsForTo[0].data.length = 0
      if (text === '' || text === undefined || text.length < 2)
        return;

      this.$axios.get('/stations/?name=' + text)
          .then(result => {
            result.data.forEach(station => {
              this.suggestionsForTo[0].data.push(station.name)
            })
          })
    },
    onSelectedForFrom(option) {
      this.addTrainModal.fromStation = option.item
      this.addTrainModal.fromSelected = true
    },
    onSelectedForTo(option) {
      this.addTrainModal.toStation = option.item
      this.addTrainModal.toSelected = true
    },
    seatsNumberChanged(value) {
      this.addTrainModal.seatsNumber = value
    },
    resetModalInfo() {
      let modal = this.addTrainModal;
      modal.trainName = ''
      modal.departure = ''
      modal.seatsNumber = ''
      modal.fromStation = ''
      modal.fromSelected = false
      modal.toStation = ''
      modal.toSelected = false
    },
    addTrain() {
      let modal = this.addTrainModal;
      this.$axios.post('/trains', {
        trainName: modal.trainName,
        seatsNumber: modal.seatsNumber,
        fromStation: modal.fromStation,
        toStation: modal.toStation,
        departure: modal.departure
      }).then(() => this.getTrainList())
    },
    updateStandings(path) {
      let dataToSend = []
      path.forEach(st => {
        let data = {};
        data.trainName = st.trainName
        data.stationName = st.stationName
        data.standing = st.standing
        dataToSend.push(data)
      })
      this.$axios.put('/trains', dataToSend, {headers: {Authorization: this.$store.getters.token}}).then(() => this.getTrainList())
    },
    goToTrainInfo(name) {
      router.push({path: '/trains/' + name})
    },
    deleteTrain(trainName) {
      this.$axios.delete("http://localhost:8000/trains/" + trainName, {headers: {Authorization: this.$store.getters.token}})
          .then(() => this.getTrainList())
    }
  }
}
</script>

<style scoped>

</style>