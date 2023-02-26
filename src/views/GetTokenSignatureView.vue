<template>
  <form>
    <div class="mb-6">
      <InputTimestamp label="X-Timestamp" v-model="timestamp" />
    </div>
    <div class="flex items-start mb-6">
      <button @click="generate" type="button" class="button-main">Generate</button>
    </div>
    <div v-show="error" class="w-100 bg-red-200 px-4 py-5 rounded">
      <span class="text-red-500"><span class="font-bold">Error: </span> {{ error_text }}</span>
    </div>
    <div v-show="success">
      <SignatureResult :signature="signature"/>
    </div>
  </form>
</template>

<script>
import SignatureResult from "@/components/SignatureResult.vue";
import moment from "moment";
import {asymmetricEncryption} from "@/assets/helpers";
import InputTimestamp from "@/components/InputTimestamp.vue";

export default {
  components: {InputTimestamp, SignatureResult},
  beforeMount() {
    if (!localStorage.getItem('merchant_id') || !localStorage.getItem('secret_key' || !localStorage.getItem('private_key'))) {
      alert('Setup credential first!')
      this.$router.push({name: 'settings'})
    }
  },
  mounted() {
    this.timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ')
  },
  data() {
    return {
      success: false,
      error: false,
      error_text: '',
      timestamp: '',
      signature: '',
    }
  },
  methods: {
    generate() {
      const strToSign = `${localStorage.getItem('merchant_id')}|${this.timestamp}`
      this.signature = asymmetricEncryption(strToSign)
      this.success = this.signature !== false
    }
  }
}
</script>
