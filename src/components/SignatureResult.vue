<template>
  <div class="w-100 dark:bg-gray-700 bg-emerald-100 px-4 py-5 rounded mb-4">
    <div class="flex justify-between">
      <span class="font-bold text-white">Signature:</span><br>
      <button type="button"
              @click="copy"
              class="button-main rounded hover:bg-emerald-500 text-white font-medium px-2 py-1 mb-2"
      >
        Click to copy
      </button>
      <Transition>
        <div v-show="showClipTooltip" class="tooltip absolute w-fit left-[unset] -right-4 -top-10">
          <span class="triangle"></span>Copied!
        </div>
      </Transition>
    </div>
    <span class="break-all text-white">{{ signature }}</span>
  </div>
  <Transition>

  </Transition>
</template>

<script>
export default {
  props: {
    signature: String
  },
  data() {
    return {
      showClipTooltip: false
    }
  },
  methods: {
    copy() {
      this.$copyText(this.$props.signature).then(() => {
        this.showClipTooltip = true
        setTimeout(() => this.showClipTooltip = false, 1500)
      })
    }
  }
}
</script>
