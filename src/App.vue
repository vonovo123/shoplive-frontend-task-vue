<template>
  <div className="App">
    <Header />
    <div className="wrap-menu">
      <div class="inner">
        <Menu 
          @fncSearchItem="fncSearchItem"
          @fncAddItem="fncAddItem"
          @fncMatchKeyword="fncMatchKeyword" />
      </div>
    </div>
    <div className="wrap-info">
      <div class="inner">
        <div>아이템 - 총 {{ count }} 개</div>
      </div>
    </div>
    <div className="wrap-items">
      <div class="inner items">
        <Item
          v-for="item in items"
          :key="item.id" 
          :item="item"
          @fncRemoveItem="fncRemoveItem"
          @fncEditItem="fncEditItem"
          @fnsSetDefaultImage="fnsSetDefaultImage" />
      </div>
    </div>
  </div>
</template>


<script>
import {DUMMY} from './dummies.js'
import Item from './components/Item.vue'
import Header from './components/Header.vue'
import Menu from './components/Menu.vue'
export default {
  components : {Item,Header, Menu},
  created(){
      let cacheData = this.$getStorage('itemList');
      if(!cacheData) cacheData = [...DUMMY];
      this.fncReadItems(cacheData);
  },
  data() {
    return {
      items: [],
      itemIDs : [],
      count : 0
    }
  },
  methods : {
    //create
    fncAddItem(addItem){
      const date  = new Date();
      const timeStamp = date.getTime()
      addItem.id = timeStamp;
      addItem.createdAt = timeStamp;
      addItem.titleView =`<div class=title>${addItem.title}</div>`;
      addItem.isHidden = false;
      this.items.push({...addItem});
      this.itemIDs.push(timeStamp);
      this.count = this.items.length;
      this.$setStorage('itemList', this.items);
    },
    //read
    fncReadItems(data){
      this.itemIDs = [];
      data.forEach(item => {
            this.itemIDs.push(item.id);
            item.titleView = `<div class=title>${item.title}</div>`;
            item.isHidden = false;
            return item;
      })
      this.items = [...data];
      this.count = this.items.length;
      this.$setStorage('itemList', this.items);
    },
    //update
    fncEditItem(editItem){
      const editItemIdx = this.itemIDs.indexOf(editItem.id);
      let item = this.items[editItemIdx];
      item.title = editItem.title;
      item.titleView = `<div class=title>${item.title}</div>`;
      item.likeCount = editItem.likeCount;
      item.imageUrl = editItem.imageUrl;
      this.$setStorage('itemList', [...this.items])
    },
    //delete
    fncRemoveItem(id){
      const removieItemIdx = this.itemIDs.indexOf(id);
      this.itemIDs.splice(removieItemIdx,1);
      this.items.splice(removieItemIdx,1);
      this.count = this.items.length;
      this.$setStorage('itemList', [...this.items])
    },
    //search
    fncSearchItem(searchword){
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
    fncMatchKeyword(searchWord){
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
    fnsSetDefaultImage({id, url}){
      console.log(`this.items[editItemIdx].imageUrl`)
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].imageUrl = url;
      console.log(this.items[editItemIdx].imageUrl);
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
        margin-left:5px;
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
          }
        }
      }
      @media (max-width: 480px){
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