<template>
  <div>
    <div class="form-group">
      <form class="form-inline justify-content-md-center pt-5">
        <b-row>
          <b-col>
            <label>
              <input type="date" class="form-control" v-model="date">
            </label>
          </b-col>
          <b-col>
            <label>
              <button type="button" class="btn btn-primary" @click="getTrainsOnStation(date)">Search</button>
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
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Station",
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
      date : '',
      stationName: '',
    }
  },
  created() {
    this.getStationName()
    this.date = new Date().toISOString().slice(0, 10)
    this.getTrainsOnStation(this.date)
  },
  methods: {
    moment(date) {
      return moment(date).format('HH:mm D MMM YYYY')
    },
    getStationName() {
      this.stationName = this.$router.currentRoute.params.stationName
    },
    getTrainsOnStation(date) {
      this.$axios.get("http://localhost:8000/stations/" + this.stationName + "?date=" + date)
          .then(result => {
            this.trains = result.data;

            this.trains.forEach(train => {
              for (let i = 0; i < train.path.length; i++) {
                let edge = train.path[i];
                edge.arrival = edge.arrival ? this.moment(edge.arrival) : ''
                edge.departure = edge.departure ? this.moment(edge.departure) : ''

                if (edge.stationName === this.stationName) {
                  train.departure = edge.departure
                  train.arrival = edge.arrival ? edge.arrival : null
                }
              }
              train.path[0].standing = 0
              train.path[0].arrival = null
              train.path[train.path.length - 1].standing = 0
              train.path[train.path.length - 1].departure = null
            })
          })
    }
  }
}
</script>

<style scoped>

</style>