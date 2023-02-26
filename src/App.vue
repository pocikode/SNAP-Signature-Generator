<script setup>
import {RouterView} from 'vue-router'
import MainHeader from "./components/MainHeader.vue";
</script>

<template>
  <div class="px-4">
    <MainHeader/>
  </div>
  <div class="container px-6">
    <RouterView/>
  </div>
</template>
