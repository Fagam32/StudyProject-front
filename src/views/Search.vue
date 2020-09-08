<template>
  <div>
    <div class="form-group">
      <form class="form-inline justify-content-md-center pt-5">
        <b-row>
          <b-col>
            <vue-autosuggest
                :suggestions="suggestionsForFrom"
                :limit="10"
                @selected="onSelectedForFrom"
                @input="onInputChangeForFrom"
                :input-props="inputPropsForFrom"
            ></vue-autosuggest>
            <span v-if="!searchFormData.fromSelected" style="color: red">Select from list</span>

          </b-col>
          <b-col>
            <vue-autosuggest
                :suggestions="suggestionsForTo"
                :limit="10"
                @selected="onSelectedForTo"
                @input="onInputChangeForTo"
                :input-props="inputPropsForTo"
            ></vue-autosuggest>
            <span v-if="!searchFormData.toSelected" style="color: red">Select from list</span>
          </b-col>
          <b-col>
            <label>
              <input type="date" class="form-control" v-model="searchFormData.date">
            </label>
          </b-col>
          <b-col>
            <label>
              <button type="button" class="btn btn-primary" @click="findTrains">Search</button>
            </label>
          </b-col>
        </b-row>
      </form>
    </div>
    <b-table :items="trains" :fields="train_table_fields" striped head-variant="light">
      <template v-slot:cell(actions)="row">
        <b-button-group>
          <b-button class="btn btn-info" type="button" @click="row['toggleDetails']">
            <b-icon icon="info-square"></b-icon>
          </b-button>
          <button value="Buy ticket" class="btn btn-primary" type="button" @click="showBuyTicketModal(row)">
            Buy ticket
            <b-icon class="ml-1" icon="card-text"></b-icon>
          </button>
        </b-button-group>

      </template>

      <template v-slot:row-details="row">
        <b-table :items="row.item.path" :fields="train_path_fields" small>
          <template v-slot:cell(standing)="row">
            {{ row.item.standing }}
          </template>
        </b-table>
      </template>
    </b-table>
    <b-modal
        ref="buyTicketModal"
        centered

        title="Buy ticket"
        @hide="resetTicketInfo"
        @ok="buyTicket"
    >

      <b-col>
        <b-input-group disabled prepend="     Name:">
          <b-form-input v-bind:value="userInfo.name" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="Surname:">
          <b-form-input v-bind:value="userInfo.surname" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="Birthdate:">
          <b-form-input v-bind:value="userInfo.birthdate" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="Train name:">
          <b-form-input v-bind:value="ticketInfo.trainName" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="From:">
          <b-form-input v-bind:value="ticketInfo.fromStation" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="To:">
          <b-form-input v-bind:value="ticketInfo.toStation" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="Departure:">
          <b-form-input v-bind:value="ticketInfo.departure" disabled></b-form-input>
        </b-input-group>
        <b-input-group disabled prepend="Arrival:">
          <b-form-input v-bind:value="ticketInfo.arrival" disabled></b-form-input>
        </b-input-group>

      </b-col>
    </b-modal>
  </div>
</template>

<script>
import moment from "moment";
import router from "@/router";

export default {
  name: "Search",
  data() {
    return {
      searchFormData: {
        fromStation: '',
        fromSelected: false,
        toStation: '',
        toSelected: false,
        date: ''
      },
      loadedData: {fromStation: '', toStation: '', date: ''},
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
          key: "seatsLeft",
          label: "Seats left"
        },
        {
          key: "departure",
          label: "Departure"
        }
      ],
      trains: [{
        trainName: "Third",
        seatsNumber: 20,
        fromStation: "Aaa",
        toStation: "Ddd",
        departure: "2020-09-25T10:00:00",
        arrival: "2020-09-25T10:45:00",
        path: [
          {
            TrainName: "Third",
            order: 1,
            seatsLeft: 20,
            stationName: "Aaa",
            departure: "2020-09-25T10:00:00",
            standing: 0,
            arrival: null
          },
          {
            trainName: "Third",
            order: 2,
            seatsLeft: 20,
            stationName: "Bbb",
            departure: "2020-09-25T10:10:00",
            standing: 0,
            arrival: "2020-09-25T10:10:00"
          },
          {
            trainName: "Third",
            order: 3,
            seatsLeft: 20,
            stationName: "Ccc",
            departure: "2020-09-25T10:25:00",
            standing: 0,
            arrival: "2020-09-25T10:25:00"
          },
          {
            trainName: "Third",
            order: 4,
            seatsLeft: 20,
            stationName: "Ddd",
            departure: null,
            standing: 0,
            arrival: "2020-09-25T10:45:00"
          }
        ],

      }],
      userInfo: {},
      ticketInfo: {}
    }
  },
  methods: {
    onInputChangeForFrom(text) {
      this.searchFormData.fromSelected = false
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
      this.searchFormData.toSelected = false
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
      this.searchFormData.fromStation = option.item
      this.searchFormData.fromSelected = true
    },
    onSelectedForTo(option) {
      this.searchFormData.toStation = option.item
      this.searchFormData.toSelected = true
    },
    checkForm() {
      let formData = this.searchFormData
      if (!formData.fromSelected) {
        return false;
      }
      if (!formData.toSelected) {
        return false
      }
      if (!formData.date) {
        console.log(formData.date)
        return false;
      }
      return true;
    },
    moment(date) {
      return moment(date).format('HH:mm D MMM YYYY')
    },
    findTrains() {
      if (this.checkForm()) {
        let form = this.searchFormData;
        this.$axios("/search?from=" + form.fromStation + "&to=" + form.toStation + "&date=" + form.date).then(result => {
          this.trains = result.data;
          this.trains.forEach(train => {
            let minSeats = 20000, foundStart = false, foundEnd = false;
            train.fromStation = this.searchFormData.fromStation
            train.toStation = this.searchFormData.toStation

            for (let i = 0; i < train.path.length; i++) {
              let edge = train.path[i];
              edge.arrival = this.moment(edge.arrival)
              edge.departure = this.moment(edge.departure)

              if (edge.stationName === this.searchFormData.fromStation) {
                minSeats = edge.seatsLeft
                foundStart = true
                train.departure = edge.departure
              }
              if (foundStart && !foundEnd) {
                minSeats = Math.min(minSeats, edge.seatsLeft)
              }
              if (edge.stationName === this.searchFormData.toStation) {
                train.seatsNumber = minSeats
                foundEnd = true
                train.arrival = edge.arrival
              }
            }
            train.path[0].standing = 0
            train.path[0].arrival = null
            train.path[train.path.length - 1].standing = 0
            train.path[train.path.length - 1].departure = null
          })
        })
      }
    },
    showBuyTicketModal(row) {
      if (!this.$store.getters.logged) {
        router.push({path: "/singin"})
      } else {
        this.$axios.get("http://localhost:8000/user", {headers: {Authorization: this.$store.getters.token}}).then(result => {
          this.userInfo = result.data
        })
        this.ticketInfo.fromStation = row.item.fromStation
        this.ticketInfo.toStation = row.item.toStation
        this.ticketInfo.departure = row.item.departure
        this.ticketInfo.arrival = row.item.arrival
        this.ticketInfo.trainName = row.item.trainName
        this.$refs['buyTicketModal'].show()
      }
    },
    buyTicket() {
      this.$axios.put(
          "http://localhost:8000/tickets",
          {
            trainName: this.ticketInfo.trainName,
            fromStation: this.ticketInfo.fromStation,
            toStation: this.ticketInfo.toStation
          },
          {headers: {Authorization: this.$store.getters.token}})
          .then(() => {
            router.push({path: "/mytickets"})
          }).catch(error => {
        alert(error.response.data.message)
      })
    },
    resetTicketInfo() {
      this.ticketInfo = {
        trainName: '',
        fromStation: '',
        toStation: '',
        departure: '',
        arrival: ''
      }
    }
  }

}
</script>

<style>
</style>