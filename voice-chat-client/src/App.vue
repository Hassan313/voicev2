<template>
  <div id="app">
    <VoiceChat />
  </div>
</template>

<script>
import VoiceChat from './components/VoiceChat.vue';

export default {
  components: {
    VoiceChat,
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 30px;
}
</style>

