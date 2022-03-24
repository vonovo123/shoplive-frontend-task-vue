<template>
  <textarea
    :value="inputText"
    @input="handleInput"
    :class="className"></textarea>
</template>

<script>
export default {
  props : {
    inputText : {
      type:String,
      default:""
    },
    target : {
      type:String,
      default: ""
    },
    className : {
      type:Array,
      default: null
    }
  },
  methods: {
    handleInput(event){
      this.$emit("edit", {target : this.target, value:event.target.value});
    }
  }
}
</script>

<style lang="scss" scoped>
    textarea {
      box-sizing:border-box;
      border : #f9f9f9;
      background-color: #aaa7a7;
      resize:none;
      width:100%;
      height: 25px;
      font-size:15px;
      padding-left:8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      color:grey;
    }
    .item-title-text {
        color:black;
        font-size: 20px;
        font-weight: bold;
        height: 30px;
        margin-top : 5px;
    }
    .item-like-text {
        margin-left :3px;
        width:30%
    }
    .image-text {
      height:100px;
      width:100%;
    }

    @media (max-width: 1024px){
      .like-text {
        width:30%;
        height:25px;
        margin-left :5px;
      }
    }
</style>