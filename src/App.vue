<script setup lang="ts">
import {RouterView } from 'vue-router'
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>

  <AppHeader />
  <div class="container">
      <div class="container-content">&nbsp;</div>
  </div>

  <RouterView />
</template>

<style scoped lang="sass">


</style>
