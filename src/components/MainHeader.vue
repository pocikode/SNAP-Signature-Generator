<template>
  <header class="flex flex-col py-10 align-middle">
    <h1 class="text-center text-4xl">SNAP Signature Generator</h1>
    <nav>
      <RouterLink to="/">Settings</RouterLink>
      <RouterLink to="/get-token-signature">Get Token Signature</RouterLink>
      <RouterLink to="/service-signature">Service Signature</RouterLink>
    </nav>
    <div class="mt-3 py-3 flex flex-col items-center">
<!--      <h3 class="text-center">made with <span class="text-red-600">❤️</span> using Vue.js</h3>-->
      <div class="flex">
        <a href="https://github.com/pocikode/SNAP-Signature-Generator" target="_blank" class="mr-3"><GithubIcon /></a>
        <a href="https://github1s.com/pocikode/SNAP-Signature-Generator" target="_blank" class=""><Github1sIcon /></a>
      </div>
    </div>
  </header>
</template>
<script setup>
import GithubIcon from "@/components/icons/GithubIcon.vue";
import Github1sIcon from "@/components/icons/Github1sIcon.vue";
</script>