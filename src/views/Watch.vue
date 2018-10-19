<template>
    <div>{{ id }}</div>
    <!-- TODO: This is where all the d3.js stuff will go -->
</template>

<script>
export default {
    props: {
        id: {
            required: true
        }
    },
    data() {
        return {
        votes: [],
        choices: []
        };
    },
    sockets: {
        connect: function() {
            console.log("socket connected");
        },
        results: function(newVotes) {
            console.log(
            'received results from server', newVotes
            );
            // the votes come in the form of indices
            // have to remap them to actual choices
            this.votes = newVotes.map( voteIndex => this.choices[voteIndex]);
        },
    },
    methods: {
        joinRoom(room) {
            this.$socket.emit("room", room)
        }
    },
    mounted() {
        this.joinRoom(this.id)
    }
}
</script>

<style>

</style>
