<template>
  <div>
    <b-table :items="trains" :fields="train_table_fields" striped head-variant="light">
      <template v-slot:cell(actions)="row">
        <b-button-group>
          <b-button class="btn btn-info" type="button" @click="row['toggleDetails']">
            <b-icon icon="info-square"></b-icon>
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
    <b-table v-if="$store.getters.roles.includes('ADMIN')" :items="tickets" :fields="ticket_table_fields" striped head-variant="light">
    </b-table>


  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Train",
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
      ticket_table_fields: [
        {
          key: "trainName",
          label: "Train"
        },
        {
          key: "fromStation",
          label: "From"
        },
        {
          key: "toStation",
          label: "To"
        },
        {
          key: "name",
          label: "Name"
        },
        {
          key: "surname",
          label: "Surname"
        },
        {
          key: "birthdate",
          label: "Birthdate"
        },
        {
          key: "arrival",
          label: "Arrival"
        },
        {
          key: "departure",
          label: "Departure"
        },

      ],
      trains: [],
      tickets: [],
      trainName: ''
    }
  },
  created() {
    this.getCurrentTrainName()
    this.getTrainInfo()
  },
  methods: {
    moment(date) {
      return moment(date).format('HH:mm D MMM YYYY')
    },
    getCurrentTrainName() {
      this.trainName = this.$router.currentRoute.params.trainName
    },
    getTrainInfo() {
      this.$axios.get("http://localhost:8000/trains/" + this.trainName).then(result => {
        this.trains = []
        this.trains.push(result.data)
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
      if (this.$store.getters.roles.includes('ADMIN')) {
        this.getTrainTickets()
      }
    },
    getTrainTickets() {
      this.$axios.get("http://localhost:8000/tickets/" + this.trainName,
          {headers: {Authorization: this.$store.getters.token}}).then(result => {
        this.tickets = result.data
        this.tickets.forEach(ticket =>{
          ticket.arrival = this.moment(ticket.arrival)
          ticket.departure = this.moment(ticket.departure)
        })

      })
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

  }
}
</script>

<style scoped>

</style>