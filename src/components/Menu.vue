<template>
  <Input  
    :input-value="searchWord"
    :type="'search'"
    @inputEvent="fncSearchInput"
    placeholder="검색" />
  <button @click="fncClickSearch">
    검색
  </button>
  <button @click="fncClickSearchInit">
    처음으로
  </button>
  <div className="add">
    <Input
      :input-value="addItem.title"
      :type="'title'"
      @inputEvent="fncSetInputValue"
      placeholder="title" />
    <Input
      :input-value="addItem.likeCount"
      :type="'likeCount'"
      @inputEvent="fncSetInputValue"
      placeholder="likeCount" />
    <Input
      :input-value="addItem.imageUrl"
      :type="'imageUrl'"
      @inputEvent="fncSetInputValue"
      placeholder="imageUrl" />
    <button @click="fncClickAddItem">
      추가
    </button>
  </div>
</template>

<script>
import Input from './Input.vue'
export default {
  components: {
    Input,
  },
  created(){
    //최근 입력어
    const cachedSearchWord = this.$getStorage('search-word');
    if(cachedSearchWord){
      this.searchWord = cachedSearchWord;
      this.$emit('fncMatchKeyword', this.searchWord);
    } else {
        this.$setStorage('search-word', "");
    }
    //최근 검색어
    const cachedLastSearch = this.$getStorage('last-search');
    if(cachedLastSearch){
      this.$emit('fncSearchItem', cachedLastSearch);
    } else {
      this.$setStorage('last-search', "")
    }
  },
  data() {
    return {
      addItem : this.initAddItem(),
      searchWord : '',
    }
  },
  methods: {
    initAddItem(){
      return {
        id : '',
        title : '',
        createdAt : '',
        likeCount : '',
        imageUrl : '',
      }
    },
    fncSearchInput({value}){
      this.searchWord = value;
      this.$setStorage('search-word', this.searchWord)
      this.$emit('fncMatchKeyword', this.searchWord);
    },
    fncClickSearchInit(){
      this.searchWord = '';
      this.$setStorage('search-word', '')
      this.$setStorage('last-search', '')
      this.$emit('fncSearchItem', this.searchWord);
      this.$emit('fncMatchKeyword', this.searchWord);
    },
    fncClickSearch(){
      this.$setStorage('last-search', this.searchWord)
      this.$emit('fncSearchItem', this.searchWord);
    },
    fncClickAddItem(){
      this.$emit('fncAddItem', this.addItem);
      this.addItem = this.initAddItem();
    },
    fncSetInputValue({type, value}){
      this.addItem[type] = value;
    }
  },
}
</script>

<style>

</style>