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
      <label for="access-token">Access Token (B2B)
        <span class="text-xs ml-1 text-white"> - &nbsp;Status:
          <span v-show="token_status.valid" class="font-semibold text-green-600">{{ token_status.valid_message }}</span>
          <span v-show="token_status.invalid" class="font-semibold text-red-600">{{ token_status.invalid_message }}</span>
        </span>
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-2">
          <button type="button" @click="copyToken" class="bg-emerald-400 hover:bg-emerald-600 z-20 px-1 py-1 rounded">
            <IconCopy class="text-white"/>
          </button>
          <Transition>
            <div v-show="showClipTokenTooltip" class="tooltip absolute z-20 left-[unset] -right-14 -top-8">
              <span class="triangle"></span>Copied!
            </div>
          </Transition>
        </div>
        <input type="text" @keyup="inputToken" id="access-token" class="form-control pl-11 pr-20" v-model="access_token"
               placeholder="eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ....."/>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2">
          <button type="button" @click="getToken" :disabled="get_token.loading"
                  class="bg-orange-400 hover:bg-orange-500 z-20 px-1 py-1 text-xs text-white rounded">
            <transition name="v-btn-label" mode="out-in">
              <div v-if="get_token.loading">
                <LoadingSpinner class="w-3.5 h-3.5 my-0.5 mx-0.5" />
              </div>
              <span v-else>
                Get Token
              </span>
            </transition>
          </button>
        </div>
      </div>
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
import {symmetricEncryption, asymmetricEncryption, getTokenB2B} from "@/assets/helpers";
import IconCopy from "@/components/icons/IconCopy.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  components: {LoadingSpinner, IconCopy, InputTimestamp, SignatureResult},
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
      this.validateToken()
    }
  },
  data() {
    return {
      ASYMMETRIC_SIGNATURE: 'ASYMMETRIC_SIGNATURE',
      SYMMETRIC_SIGNATURE: 'SYMMETRIC_SIGNATURE',
      success: false,
      error: false,
      token_active: false,
      token_inactive: false,
      error_text: '',
      signature_type: 'SYMMETRIC_SIGNATURE',
      http_method: 'POST',
      endpoint: '',
      access_token: '',
      payload: '',
      timestamp: '',
      signature: '',
      showClipTokenTooltip: false,
      token_status: {
        valid: false,
        invalid: false,
        valid_message: '',
        invalid_message: '',
        timeout_typing: null,
      },
      get_token: {
        loading: false,
        success: false,
        reset_timer: null,
      }
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
      this.validateToken()

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
    copyToken() {
      this.$copyText(this.access_token).then(() => {
        this.showClipTokenTooltip = true
        setTimeout(() => this.showClipTokenTooltip = false, 1500)
      })
    },
    inputToken() {
      clearTimeout(this.token_status.timeout_typing)
      const self = this
      this.token_status.timeout_typing = setTimeout(() => {
        self.validateToken()
      }, 400)
    },
    validateToken() {
      if (!this.access_token || this.access_token === '') {
        this.token_status.valid = false
        this.token_status.invalid = false
        return
      }

      const token_split = this.access_token.split('.')
      if (token_split.length !== 3) {
        this.token_status.valid = false
        this.token_status.invalid = true
        this.token_status.invalid_message = 'Invalid Token'
      } else {
        try {
          // eslint-disable-next-line no-unused-vars
          const jwt_header = JSON.parse(atob(token_split[0]))
          const jwt_payload = JSON.parse(atob(token_split[1]))

          this.token_status.invalid = false
          this.token_status.valid = true
          this.token_status.valid_message = 'Valid'

          if (jwt_payload.exp) {
            const now = moment()
            const expired = moment.unix(jwt_payload.exp)
            if (now >= expired) {
              this.token_status.valid = false
              this.token_status.invalid = true
              this.token_status.invalid_message = 'Expired'
            } else {
              this.token_status.valid_message = 'Active until ' + expired.format('YYYY-MM-DDTHH:mm:ssZ')
            }
          }
        } catch (e) {
          console.log(e)
          this.token_status.valid = false
          this.token_status.invalid = true
          this.token_status.invalid_message = 'Invalid Token'
        }
      }
    },
    getToken() {
      this.get_token.loading = true
      getTokenB2B().then(res => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(`${data.responseCode} - ${data.responseMessage}`)
          })
        }
        return res.json()
      }).then(resp_json => {
        this.access_token = resp_json.accessToken
        this.validateToken()
        localStorage.setItem('str_symmetric_payload', JSON.stringify({
          'endpoint': this.endpoint,
          'access_token': this.access_token,
          'payload': this.payload,
        }))
      }).catch(err => {
        alert(err)
        console.log(err)
      }).finally(() => {
        this.get_token.loading = false
      })
    }
  }
}
</script>
