<template>
  <div className="App">
    <Header />
    <Menu 
      @search-item="searchItem"
      @add-item="addItem"
      @match-keyword="matchKeyword" />
    <Info :count="count" />
    <ItemList
      :items="items"
      @remove-item="removeItem"
      @edit-item="editItem"
      @set-default-image="setDefaultImage" />
  </div>
</template>
<script>
import {DUMMY} from './dummies.js'
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
import Info from './components/Info.vue'
import ItemList from './components/ItemList.vue'
export default {
  components : {Header, Menu, Info, ItemList},
  created(){
      let cacheData = this.$getStorage('item-list');
      if(!cacheData) cacheData = [...DUMMY];
      this.initItems(cacheData);
  },
  data() {
    return {
      items: [],
      itemIDs : [],
      count : 0
    }
  },
  methods : {
    //items 구성에 필요한 데이터 set
    initItems(data){
      this.itemIDs = [];
      data.forEach(item => {
            this.itemIDs.push(item.id);
            item.titleView = `<div class=title>${item.title}</div>`;
            item.isHidden = false;
            return item;
      })
      this.items = [...data];
      this.count = this.items.length;
      this.$setStorage('item-list', this.items);
      return data;
    },
    //사용자 아이템 추가
    addItem(addItem){
      const date  = new Date();
      const timeStamp = date.getTime()
      addItem.id = timeStamp;
      addItem.createdAt = timeStamp;
      addItem.titleView =`<div class=title>${addItem.title}</div>`;
      addItem.isHidden = false;
      this.items.unshift({...addItem});
      this.itemIDs.unshift(timeStamp);
      this.count = this.items.length;
      this.$setStorage('item-list', this.items);
      return addItem;
    },
    //지정 아이템 삭제
    removeItem(id){
      const removieItemIdx = this.itemIDs.indexOf(id);
      this.itemIDs.splice(removieItemIdx,1);
      this.items.splice(removieItemIdx,1);
      this.count = this.items.length;
      this.$setStorage('item-list', [...this.items])
    },
    //검색어와 일치하는 제목을 가진 item만 보여줌
    searchItem(searchword){
      this.count = 0;
      this.items.forEach(item => {
        const searchIdx = item.title.indexOf(searchword)
        if( searchIdx === -1){
          item.isHidden = true;
        } else {
          item.isHidden = false;
          this.count +=1;
        }
      })

    },
    //title 내에서 검색어 입력과 일치하는 부분 찾아 하이라이트
    matchKeyword(searchWord){
      this.items.forEach(item => {
        let {title} = item;
        let searchIdx = title.indexOf(searchWord);
        if(searchIdx  === -1 || searchWord === ''){
            item.titleView =`<div class="title">${title}</div>`
        } else{
            let titleView = `<div class="title">`;
              let prefix, match, suffix;
              while(searchIdx !== -1){
                prefix  = title.substr(0, searchIdx);
                match = title.substr(searchIdx, searchWord.length);
                suffix =  title.substr(searchIdx + searchWord.length);
                titleView += prefix;
                titleView += `<span class="highlight">${match}</span>`;
                title = suffix;
                searchIdx = title.indexOf(searchWord);
              }
            titleView +=  `${title}</div>`;
            item.titleView = titleView;
        }
      })
    },
    //사용자 아이템 내용 변경
    editItem(editItem){
      const editItemIdx = this.itemIDs.indexOf(editItem.id);
      let item = this.items[editItemIdx];
      item.title = editItem.title;
      item.titleView = `<div class=title>${item.title}</div>`;
      item.likeCount = editItem.likeCount;
      item.imageUrl = editItem.imageUrl;
      this.$setStorage('item-list', [...this.items])
    },

    //사용자가 입력한 이미지가 존재하지않거나 load에 실패하면 특정이미지로 변환
    setDefaultImage({id, url}){
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].imageUrl = url;
    }
  }
}
</script>

<style lang="scss">
  body {
    background-color: #f9f9f9;
    .App {
      input {
        padding: 4px 8px;
        margin: 2px;
      }
      .inner {
        width: 60%;
        margin: 0 auto;
        position: relative;
        padding: 10px 0 15px 0;
      }
      button {
        margin-left:2px;
      }

      @media (max-width: 1024px){
        input {
          width:25%;
        }
        .inner{
          width:95%;
          &.items{
            display:flex;
            flex-wrap: wrap;
            justify-content:space-between;
          }
        }
      }
      @media (max-width: 479px){
        input {
          width:40%;
        }
        .inner{
            &.items{
              display:block;
            }
          }
      }
    }
  }
</style>