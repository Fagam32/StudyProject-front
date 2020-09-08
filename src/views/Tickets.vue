<template>
  <div>

    <b-table v-if="this.$store.getters.logged" :items="tickets" :fields="train_table_fields" striped
             head-variant="light">

      <template v-slot:cell(actions)="row">
        <b-button-group>
          <b-button class="btn btn-danger" type="button" @click="cancelTicket(row.item)">
            <b-icon icon="trash"></b-icon>
            Cancel
          </b-button>
        </b-button-group>

      </template>

    </b-table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Tickets",
  data() {
    return {
      train_table_fields: [
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
      tickets: []
    }
  },
  created() {
    this.getTickets()
  },
  methods: {
    moment(date) {
      return moment(date).format('HH:mm D MMM YYYY')
    },
    getTickets() {
      this.$axios.get("http://localhost:8000/tickets", {headers: {Authorization: this.$store.getters.token}})
          .then(result => {
            this.tickets = result.data
            this.tickets.forEach(ticket => {
              ticket.arrival = this.moment(ticket.arrival)
              ticket.departure = this.moment(ticket.departure)
            })
          })
    },
    cancelTicket(ticket) {
      this.$axios.delete("http://localhost:8000/tickets", {
            headers: {Authorization: this.$store.getters.token},
            data:{
              trainName : ticket.trainName,
              fromStation: ticket.fromStation,
              toStation: ticket.toStation
            }
          },
      ).then(() => {
        this.getTickets()
      })
    }
  }
}
</script>

<style scoped>

</style>