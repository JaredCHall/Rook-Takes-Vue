<script setup lang="ts">
const props = defineProps<{
  color: 'white'|'black'
  pieceName: null|'pawn'|'rook'|'knight'|'bishop'|'king'|'queen'
  width: number
  x: number
  y: number
}>()

const classObject = {
  'chess-piece': true,
  'white-piece' : props.color === 'white',
  'black-piece': props.color === 'black',
}

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="width" x="x" y="y" viewBox="0 0 50 50">
    <g :class="classObject" v-if="pieceName == 'pawn'">
      <text y=48>♟</text>
    </g>

    <g x=100 y=100 :class="classObject" v-if="pieceName == 'rook'">
      <rect x=17 y=15 width="18" height="30" class="piece-fill"></rect>
      <text y=48>♜</text>
    </g>

    <g x=100 y=100 :class="classObject" v-if="pieceName == 'knight'">
      <rect x=14 y=20 width="8" height="8" class="piece-fill"></rect>
      <rect x=8 y=32 width="4" height="4" class="piece-fill"></rect>
      <ellipse cx="19" cy="14" rx="6" ry="17" transform="rotate(150 25 25)" class="piece-fill" />
      <text y=48>♞</text>
    </g>

    <g x=100 y=100 :class="classObject" v-if="pieceName == 'bishop'">
      <rect x=17 y=16 width="18" height="22" class="piece-fill"></rect>
      <circle cx="26" cy="9" r="2.5" class="piece-fill"/>
      <text y=48>♝</text>
    </g>

    <g x=100 y=100 :class="classObject" v-if="pieceName == 'king'">
      <rect x=14 y=25 width="24" height="20" class="piece-fill"></rect>
      <ellipse cx="33" cy="22" rx="8" ry="14" transform="rotate(50 25 25)" class="piece-fill" />
      <ellipse cx="34" cy="24" rx="8" ry="14" transform="rotate(140 25 25)"  class="piece-fill" />
      <text y=48>♚</text>
    </g>

    <g x=100 y=100 :class="classObject" v-if="pieceName == 'queen'">
      <rect x=14 y=25 width="24" height="20" class="piece-fill"></rect>
      <circle cx="7" cy="15.5" r="2.5" class="piece-fill"/>
      <circle cx="15.8" cy="11.5" r="2.5" class="piece-fill"/>
      <circle cx="26" cy="9" r="2.5" class="piece-fill"/>
      <circle cx="36" cy="11.5" r="2.5" class="piece-fill"/>
      <circle cx="45" cy="15.5" r="2.5" class="piece-fill"/>

      <text y=48>♛</text>

    </g>

  </svg>
</template>

<style scoped lang="sass">

</style>