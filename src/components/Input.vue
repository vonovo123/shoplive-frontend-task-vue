<template>
  <input
    :value="inputValue" 
    @input="setInputValue" />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    inputValue: {
      type: String,
      default: ''
    },
  },
  emits: ['input-event'],
  methods: {
    setInputValue(e) {
      const value = e.target.value.trim();
      this.$emit('input-event', { type : this.type, value});
    }
  },
}
</script>

<style>

</style>