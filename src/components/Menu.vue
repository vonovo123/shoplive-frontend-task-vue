<template>
  <div className="wrap-menu">
    <div class="inner">
      <Input  
        :input-value="searchWord"
        :type="'search'"
        @input-event="inputSearchValue"
        placeholder="검색" />
      <button @click="clickSearch">
        검색
      </button>
      <button @click="clickSearchInit">
        처음으로
      </button>
      <div className="add">
        <Input
          :input-value="addItem.title"
          :type="'title'"
          @input-event="setInputValue"
          placeholder="title" />
        <Input
          :input-value="addItem.likeCount"
          :type="'likeCount'"
          @input-event="setInputValue"
          placeholder="likeCount" />
        <Input
          :input-value="addItem.imageUrl"
          :type="'imageUrl'"
          @input-event="setInputValue"
          placeholder="imageUrl" />
        <button @click="clickAddItem">
          추가
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Input from './Input.vue'
export default {
  components: {
    Input,
  },
  created(){
   this.getCacheData();
  },
  data() {
    return {
      addItem : this.initAddItem(),
      searchWord : '',
    }
  },
  emits:['search-item', 'add-item', 'match-keyword'],
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
    //입력어/검색어 캐싱을 위해 localStorage에 저장된 값을 가져옵니다.
    getCacheData(){
      //최근 입력어
      const cachedSearchWord = this.$getStorage('search-word');
      if(cachedSearchWord){
        this.searchWord = cachedSearchWord;
        this.$emit('match-keyword', this.searchWord);
      } else {
          this.$setStorage('search-word', "");
      }
      //최근 검색어
      const cachedLastSearch = this.$getStorage('last-search');
      if(cachedLastSearch){
        this.$emit('search-item', cachedLastSearch);
      } else {
        this.$setStorage('last-search', "")
      }
    },
    //검색어입력시 상위컴포넌트의 matchKeyword를 실행합니다.
    inputSearchValue({value}){
      this.searchWord = value;
      this.$setStorage('search-word', this.searchWord)
      this.$emit('match-keyword', this.searchWord);
    },
    //처음으로 버튼 클릭시 검색어를 초기화합니다.
    clickSearchInit(){
      this.searchWord = '';
      this.$setStorage('search-word', '')
      this.$setStorage('last-search', '')
      this.$emit('search-item', this.searchWord);
      this.$emit('match-keyword', this.searchWord);
    },
    //검색버튼 클릭시 상위 컴포넌트의 searchItem를 실행합니다.
    clickSearch(){
      this.$setStorage('last-search', this.searchWord)
      this.$emit('search-item', this.searchWord);
    },
    // 추가버튼 클릭시 상위 컴포넌트의 addItem를 실행합니다.
    clickAddItem(){
      this.$emit('add-item', this.addItem);
      this.addItem = this.initAddItem();
    },
    //Input 컴포넌트로 부터 전달 받은 값을 set 합니다.
    setInputValue({type, value}){
      this.addItem[type] = value;
    }
  },

}
</script>

<style>

</style>