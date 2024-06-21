<template>
  <div>
    <h1>Voice Chat</h1>
    <button @click="startCall">Start Call</button>
    <button @click="endCall">End Call</button>
    <audio ref="audio" autoplay></audio>
  </div>
</template>

<script>
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

export default {
  data() {
    return {
      peer: null,
      stream: null,
      socket: null,
    };
  },
  mounted() {
    this.socket = io('http://192.168.254.14:5432');
    console.log(this.socket)
    console.log("The socket is fine in vcs code");
    this.socket.on('connect', () => {
      console.log('Connected to server'); // Debug message
    });
    this.socket.on('connect_error', (err) => {
      console.error('Connection error:', err); // Debug message
    });
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason); // Debug message
    });
    this.socket.on('reconnect_attempt', () => {
      console.log('Reconnecting to server'); // Debug message
    });
    this.socket.on('signal', (data) => {
      if (this.peer) {
        console.log("Entering the peer");
        this.peer.signal(data);
      }
    });
  },
  methods: {
    async startCall() {
      console.log("starting call")
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.stream = stream;
        this.peer = new SimplePeer({ initiator: true, stream: stream });
        console.log("stream captured " + new Date().toLocaleTimeString())

        this.peer.on('signal', (data) => {
          console.log("starting call " + new Date().toLocaleTimeString())
          this.socket.emit('signal', data);
          console.log("signal sent")
        });

        this.peer.on('stream', (stream) => {
          console.log("On Stream")
          this.$refs.audio.srcObject = stream;
          this.$refs.audio.play();
        });

        this.peer.on('error', (err) => console.error(err));
      } catch (err) {
        console.error('Failed to get local stream', err);
      }
    },
    endCall() {
      console.log("ending call")
      if (this.peer) {
        this.peer.destroy();
      }
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
      this.peer = null;
      this.stream = null;
    },
  },
};
</script>

<style scoped>
button {
  margin: 10px;
}
</style>

