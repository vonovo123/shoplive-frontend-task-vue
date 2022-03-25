<template>
  <div className="wrap-items">
    <div class="inner items">
      <Item
        v-for="item in items"
        :key="item.id" 
        :item="item"
        @remove-item="removeItem"
        @edit-item="editItem"
        @set-default-image="setDefaultImage" />
    </div>
  </div>
</template>

<script>
import Item from './Item.vue'
export default {
  components: {
    Item,
  },
  props: {
    items: {
      type: Array,
      default: null
    },
  },
  emits: ['remove-item','edit-item','set-default-image'],
  methods: {
    removeItem(id) {
      this.$emit('remove-item', id);
    },
    editItem(editItem) {
      this.$emit('edit-item', editItem)
    },
    setDefaultImage({id, url}) {
      this.$emit('set-default-image', {id, url});
    }
  },
}
</script>

<style>

</style>