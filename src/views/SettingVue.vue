<template>
  <form>
    <div class="mb-6" v-show="success">
      <div class="w-100 bg-emerald-200 px-3 py-2">
        <span class="font-bold text-emerald-500">Success</span>
      </div>
    </div>
    <div class="mb-6">
      <label for="merchant-id">Merchant ID</label>
      <input type="text" id="merchant-id" class="form-control" v-model="merchant_id" placeholder="xxx"/>
    </div>
    <div class="mb-6">
      <label for="secret-key">Secret Key</label>
      <input type="text" id="secret-key" class="form-control" v-model="secret_key" placeholder="rAnd0mStr1n6"/>
    </div>
    <div class="mb-6">
      <label for="private-key">Private Key</label>
      <textarea id="private-key" class="form-control" rows="5" v-model="private_key" placeholder="-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqZ1n0DQB6eppM
C8BdXMcq0ILiQMqmyYw5iABsMal332wDz7FnDINFj2KDuJGzwRgpQRQXyxhX00Bx......
-----END PRIVATE KEY-----"></textarea>
    </div>
    <div class="flex items-start mb-6">
      <button @click="save" type="button" class="button-main">Save</button>
    </div>
  </form>
</template>

<script>
export default {
  mounted() {
    this.private_key = localStorage.getItem('private_key')
    this.secret_key = localStorage.getItem('secret_key')
    this.merchant_id = localStorage.getItem('merchant_id')
  },
  data() {
    return {
      success: false,
      merchant_id: '',
      private_key: '',
      secret_key: ''
    }
  },
  methods: {
    save() {
      if (!this.merchant_id) {
        alert('Merchant ID cannot be empty!')
      } else if (!this.secret_key) {
        alert('Secret Key cannot be empty!')
      } else if (!this.private_key) {
        alert('Private Key cannot be empty!')
      } else {
        localStorage.setItem('merchant_id', this.merchant_id)
        localStorage.setItem('private_key', this.private_key)
        localStorage.setItem('secret_key', this.secret_key)
        this.success = true
      }
    }
}
}
</script>

