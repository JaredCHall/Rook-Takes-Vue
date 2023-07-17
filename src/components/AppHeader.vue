<script setup lang="ts">
import {RouterLink, RouterView, useRoute} from 'vue-router'
import Piece from "../components/chessboard/Piece.vue";

const route = useRoute()

</script>

<template>

  <div id="app-header">
    <div class="row">
      <div class="column" id="header-logo-column">
        <Piece color="black" width=40 x=0 y=0 piece-name="rook" class="header-logo"></Piece>
        <strong class="header-title">Rook Takes</strong>
      </div>

      <div class="column" :class="{ selected: route.path === '/'}">
        <RouterLink class="app-link" to="/">
        Chessboard
        </RouterLink>
      </div>

      <div class="column" :class="{ selected: route.path === '/visualization'}">
        <RouterLink  class="app-link" to="/visualization">
          Visualization
        </RouterLink>
      </div>


      <div class="column" :class="{ selected: route.path === '/classic-games'}">
        <RouterLink  class="app-link" to="/classic-games">
        Classic Games
        </RouterLink>
      </div>
    </div>
  </div>



</template>

<style lang="sass">
  @import "../style/header"
</style>