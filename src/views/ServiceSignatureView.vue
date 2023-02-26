<template>
  <form>
    <div class="mb-4">
      <fieldset>
        <legend>Signature Type</legend>
        <div class="flex mt-1">
          <div class="flex items-center">
            <input id="signature-option-1" type="radio" v-model="signature_type" :value="SYMMETRIC_SIGNATURE" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 dark:focus:bg-emerald-500 dark:bg-gray-700 dark:border-gray-600" checked>
            <label for="signature-option-1" class="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Symmetric
            </label>
          </div>
          <div class="flex items-center ml-4">
            <input id="signature-option-2" type="radio" v-model="signature_type" :value="ASYMMETRIC_SIGNATURE" class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-500 dark:focus:bg-emerald-500 dark:bg-gray-700 dark:border-gray-600">
            <label for="signature-option-2" class="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Asymmetric
            </label>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="mb-4">
      <label for="endpoint">Endpoint</label>
      <div class="flex">
        <span class="inline-flex items-center text-sm w-[90px] text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
          <select id="http-method2" class="form-select border-0 bg-transparent w-full" v-model="http_method">
            <option value="POST" selected>POST</option>
            <option value="GET">GET</option>
          </select>
        </span>
        <input type="text" id="endpoint" v-model="endpoint"
               class="form-control rounded-none rounded-r-lg"
               placeholder="/openapi/v1.0/registration-account-binding">
      </div>
    </div>
    <div class="mb-4">
      <label for="access-token">Access Token (B2B)</label>
      <input type="text" id="access-token" class="form-control" v-model="access_token"
             placeholder="eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ....."/>
    </div>
    <div class="mb-4">
      <label for="payload">JSON Payload</label>
      <textarea id="payload" class="form-control" rows="5" v-model="payload"
                placeholder="{&#10;&#9;&quot;grantType&quot;: &quot;client_credentials&quot;,&#10;&#9;&quot;additionalInfo&quot;:{}&#10;}"
      ></textarea>
    </div>
    <div class="mb-4">
      <InputTimestamp label="X-Timestamp" v-model="timestamp"/>
    </div>
    <div class="flex items-start mb-4">
      <button @click="generate" type="button" class="button-main">Generate</button>
      <button @click="reset" type="button" class="button-main text-slate-600 bg-slate-200 ml-3">Reset</button>
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
import moment from "moment";
import sha256 from "crypto-js/sha256";
import SignatureResult from "@/components/SignatureResult.vue";
import InputTimestamp from "@/components/InputTimestamp.vue";
import {symmetricEncryption, asymmetricEncryption} from "@/assets/helpers";

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
    if (localStorage.getItem('str_symmetric_payload') && localStorage.getItem('str_symmetric_payload') !== 'null') {
      const sign_payload = JSON.parse(localStorage.getItem('str_symmetric_payload'))
      this.endpoint = sign_payload.endpoint
      this.access_token = sign_payload.access_token
      this.payload = sign_payload.payload
    }
  },
  data() {
    return {
      ASYMMETRIC_SIGNATURE: 'ASYMMETRIC_SIGNATURE',
      SYMMETRIC_SIGNATURE: 'SYMMETRIC_SIGNATURE',
      success: false,
      error: false,
      error_text: '',
      signature_type: 'SYMMETRIC_SIGNATURE',
      http_method: 'POST',
      endpoint: '',
      access_token: '',
      payload: '',
      timestamp: '',
      signature: '',
    }
  },
  methods: {
    generate() {
      let strToSign = `${this.http_method}:${this.endpoint}:`

      if (this.access_token) {
        strToSign += `${this.access_token}:`
      }

      if (this.payload) {
        const payload_hash = sha256(JSON.stringify(JSON.parse(this.payload))).toString()
        strToSign += `${payload_hash}:`
      }

      strToSign += `${this.timestamp}`
      console.log(strToSign)

      if (this.signature_type === this.SYMMETRIC_SIGNATURE) {
        this.signature = symmetricEncryption(strToSign)
      } else {
        this.signature = asymmetricEncryption(strToSign)
      }

      this.success = this.signature !== false

      localStorage.setItem('str_symmetric_payload', JSON.stringify({
        'endpoint': this.endpoint,
        'access_token': this.access_token,
        'payload': this.payload,
      }))
    },
    reset() {
      this.endpoint = ''
      this.access_token = ''
      this.payload = ''
      this.timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ')
      localStorage.setItem('str_symmetric_payload', null)
      this.success = false
    },
  }
}
</script>
