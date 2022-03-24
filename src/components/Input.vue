<template>
  <input
    :value="inputValue" 
    @input="fncSetInputValue" />
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
  methods: {
    fncSetInputValue(e) {
      const value = e.target.value.trim();
      this.$emit('inputEvent', { type : this.type, value});
    }
  },
}
</script>

<style>

</style>