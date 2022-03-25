<template>
  <div className="wrap-info">
    <div class="inner">
      <div>아이템 - 총 {{ count }} 개</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0 
    },
  },
}
</script>

<style>

</style>