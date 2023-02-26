<template>
  <label for="timestamp">{{ label }}</label>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-2">
      <button type="button" @click="copy" class="bg-emerald-400 hover:bg-emerald-600 z-20 px-1 py-1 rounded">
        <IconCopy class="text-white"/>
      </button>
      <Transition>
        <div v-show="showClipTooltip" class="tooltip absolute z-20 left-[unset] -right-14 -top-8">
          <span class="triangle"></span>Copied!
        </div>
      </Transition>
    </div>
    <input type="text" id="timestamp" class="form-control pl-11" :value="modelValue"
           @input="$emit('update:modelValue', $event.target.value)"/>
  </div>
</template>

<script>
import moment from "moment/moment";
import IconCopy from "@/components/icons/IconCopy.vue";

export default {
  components: {IconCopy},
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      default: moment().format('YYYY-MM-DDTHH:mm:ssZ')
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showClipTooltip: false
    }
  },
  methods: {
    copy() {
      this.$copyText(this.$props.modelValue).then(() => {
        this.showClipTooltip = true
        setTimeout(() => this.showClipTooltip = false, 1500)
      })
    }
  }
}
</script>
