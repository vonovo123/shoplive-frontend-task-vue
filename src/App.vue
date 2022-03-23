<template>
  <div className="App">
    <header>
      <div class="inner">
        SHOPLIVE
      </div>
    </header>
    <div className="wrap-menu">
      <div class="inner">
        <input
          placeholder="검색"
          :value="searchWord" 
          @input="fncSearchInput" />
        <button @click="fncSearchItem">
          검색
        </button>
        <button @click="fncSearchInit">
          처음으로
        </button>
        <div className="add">
          <input
            v-model="addItem.title"
            placeholder="title" />
          <input
            v-model="addItem.likeCount"
            placeholder="likeCount" />
          <input
            v-model="addItem.imageUrl"
            placeholder="imageUrl" />
          <button @click="fncAddItem">
            추가
          </button>
        </div>
      </div>
    </div>
    <div className="wrap-info">
      <div class="inner">
        <div>아이템 - 총 {{ count }} 개</div>
      </div>
    </div>
    <div className="wrap-items">
      <div class="inner items">
        <div
          class="item-row"
          :class="{'hidden' : item.isHidden}"
          v-for="item in items"
          :key="item.id">
          <template v-if="!item.edit">
            <div class="image">
              <img :src="item.imageUrl" />
            </div> 
            <div
              class="like"
              v-if="windowWidth < 1025">
              LIKE: {{ item.likeCount }}
            </div>
            <div class="content">
              <div
                class="text"
                v-if="windowWidth > 1025">
                <div class="item-like">
                  <span>LIKE:</span> 
                  <span class="like">{{ item.likeCount }}</span>
                </div>
                <div
                  class="item-title"
                  v-html="item.titleView">
                </div>
                <div class="item-date">
                  {{ item.date }}
                </div>
              </div>
              <div
                class="text"
                v-else>
                <div class="item-date">
                  {{ item.date }}
                </div>
                <div
                  class="item-title"
                  v-html="item.titleView">
                </div>
              </div>
              
              <div class="btns">
                <button
                  class="update"
                  @click="fncClickEditBtn(item.id)">
                  수정
                </button>
                <button
                  class="remove"
                  @click="fncRemoveItem(item.id)">
                  제거
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="image edit">
              <div class="content">
                <p>이미지 URL</p>
                <textarea
                  v-model="item.imageUrlEdit"
                  placeholder="imageUrl"></textarea> 
              </div> 
            </div>
            <div
              class="like"
              v-if="windowWidth < 1025">
              <span>LIKE:</span>
              <textarea
                v-model="item.likeCountEdit"
                placeholder="LIKE"></textarea>
            </div>
            <div class="content edit">
              <div
                class="text"
                v-if="windowWidth > 1025">
                <div class="item-like">
                  <span>LIKE:</span>
                  <textarea
                    v-model="item.likeCountEdit"
                    placeholder="LIKE"></textarea>
                </div>
                <div class="item-title">
                  <textarea
                    class="title"
                    v-model="item.titleEdit"
                    placeholder="TITLE"></textarea>
                </div>
                <div class="item-date">
                  {{ item.date }}
                </div>
              </div>
              <div
                class="text"
                v-else>
                <div class="item-date">
                  {{ item.date }}
                </div>
                <div class="item-title">
                  <textarea
                    v-model="item.titleEdit"
                    placeholder="TITLE"></textarea>
                </div>
              </div>
              <div class="btns">
                <button
                  class="update"
                  @click="fncClickCancelBtn(item.id)">
                  취소
                </button>
                <button
                  class="remove"
                  @click="fncEditItem(item.id)">
                  저장
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {DUMMY} from './dummies.js'
export default {
  components : {},
  created(){
      let cacheData = this.$getStorage('itemList');
      if(!cacheData) cacheData = [...DUMMY];
      else console.log('cache');
      this.fncReadItems(cacheData);
      window.addEventListener('resize',()=>{
        console.log()
        const {innerWidth, innerHeight} = window;
        this.fncSetViewPortSize(innerWidth, innerHeight)
      })
  },
  data() {
    return {
      items: [],
      itemIDs : [],
      count : 0,
      addItem : this.initAddItem(),
      editItem : null,
      searchWord : '',
      windowWidth : window.innerWidth,
      windowHeight : window.innerHeight
    }
  },
  methods : {
    fncSetViewPortSize(width, height){
      this.windowWidth = width;
      this.windowHeight = height;
    },
    initLoadItem(item){
        let date = new Date(item.createdAt);
        item.date = `${date.getFullYear()}. ${date.getMonth()}. ${date.getDay()}.`
        item.titleView = `<div class="title">${item.title}</div>`;
        item.titleEdit = item.title;
        item.likeCountEdit = item.likeCount;
        item.imageUrlEdit = item.imageUrl;
        item.edit = false;
        item.editImg = false;
        item.isHidden = false;
        return item;
    },
    initAddItem(){
      return {
        id : '',
        title : '',
        titleEdit : '',
        titleView : '',
        createdAt : '',
        date: '',
        likeCount : '',
        likeCountEdit : '',
        imageUrl : '',
        imageUrlEdit : '',
        edit : false,
        editImg : false,
        isHidden : false,
      }
    },
    //create
    fncAddItem(){
      const date  = new Date();
      const timeStamp = date.getTime()
      this.addItem.id = timeStamp;
      this.addItem.createdAt = timeStamp;
      this.addItem.date = `${date.getFullYear()}. ${date.getMonth()}. ${date.getDay()}.`
      this.addItem.titleEdit = this.addItem.title;
      this.addItem.titleView = this.addItem.title;
      this.addItem.likeCountEdit = this.addItem.likeCount;
      this.addItem.imageUrlEdit = this.addItem.imageUrl;
      this.items.push({...this.addItem});
      this.itemIDs.push(timeStamp);
      this.count = this.items.length;
      this.$setStorage('itemList', this.items);
      //init
      this.addItem = this.initAddItem();
    },
    //read
    fncReadItems(data){
      this.itemIDs = [];
      this.items = data.map(item => {
            item = this.initLoadItem(item);
            this.itemIDs.push(item.id);
            return item;
      })
      this.$setStorage('itemList', [...this.items])
      this.count = this.items.length;
    },
    //update
    fncEditItem(id){
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].title = this.items[editItemIdx].titleEdit;
      this.items[editItemIdx].titleView = this.items[editItemIdx].titleEdit;
      this.items[editItemIdx].likeCount = this.items[editItemIdx].likeCountEdit;
      this.items[editItemIdx].imageUrl = this.items[editItemIdx].imageUrlEdit;
      this.items[editItemIdx].edit = !this.items[editItemIdx].edit;
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
    fncSearchItem(){
      this.count = 0;
      this.items.forEach(item => {
        const searchIdx = item.title.indexOf(this.searchWord)
        if( searchIdx === -1){
          item.isHidden = true;
        } else {
          item.isHidden = false;
          this.count +=1;
        }
      })
    },
    fncSearchInput(e){
     this.searchWord = e.target.value.trim();
      this.fncMatchKeyword();
    },
    fncMatchKeyword(){
      this.items.forEach(item => {
        let {title} = item;
        let searchIdx = title.indexOf(this.searchWord);
        if(searchIdx  === -1 || this.searchWord === ''){
            item.titleView =`<div class="title">${title}</div>`
        } else{
            let titleView = `<div class="title">`;
              let prefix, match, suffix;
              while(searchIdx !== -1){
                prefix  = title.substr(0, searchIdx);
                match = title.substr(searchIdx, this.searchWord.length);
                suffix =  title.substr(searchIdx + this.searchWord.length);
                titleView += prefix;
                titleView += `<span class="highlight">${match}</span>`;
                title = suffix;
                searchIdx = title.indexOf(this.searchWord);
              }
            titleView +=  `${title}</div>`;
            item.titleView = titleView;
        }
      })
    },
    fncSearchInit(){
      this.searchWord = '';
      this.fncSearchItem();
      this.fncMatchKeyword();
    },
    fncClickEditBtn(id){
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].edit = true;
      this.items[editItemIdx].editImg = true;
    },
    fncClickImg(id, event){
      if(event.target.tagName === 'TEXTAREA') return;
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].editImg = !this.items[editItemIdx].editImg;
    },
    fncClickCancelBtn(id){
      const editItemIdx = this.itemIDs.indexOf(id);
      this.items[editItemIdx].titleEdit = this.items[editItemIdx].title;
      this.items[editItemIdx].likeCountEdit = this.items[editItemIdx].likeCount;
      this.items[editItemIdx].imageUrlEdit = this.items[editItemIdx].imageUrl;
      this.items[editItemIdx].edit = false;
      this.items[editItemIdx].editImg = false;
    },
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
      header {
        background-color: gray;
        color: white;
      }
      button {
        margin-left:5px;
      }
      .wrap-menu{

      }
      .wrap-info{

      }

      .inner {
        width: 60%;
        margin: 0 auto;
        position: relative;
        padding: 10px 0 15px 0;
      }

      .wrap-items{
        .item-row {
          margin-top: 16px;
          margin-bottom: 16px;
          border-radius: 12px;
          box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
          display:flex;
          align-items: center;
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
            &.title{
              color:black;
              font-size: 20px;
              font-weight: bold;
              height: 30px;
            }
          }
          .image {
              width:20%;
              height:210px;
              padding-left:0;
              position:relative;
              img {
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;
                position:relative;
                width:100%;
                height:100%;
                object-fit: cover;
              }
              &.edit{
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;  
                background-color:grey;
                padding-top:10px;
                box-sizing:border-box;
                > .content {
                  width:100%;
                  color:black;
                  height:50px;
                  display: flex;
                  justify-content: center;
                  flex-wrap:wrap;
                  > textarea {
                    margin-top : 10px;
                    position:relative;
                    width:100%;
                    height:100px;
                  }
                }
 
              }
          }
          > .content{
            width:80%;
            box-sizing:border-box;
            padding-left:30px;
            color:grey;
            display: flex;

            .item-like {
                display : flex;
                align-content: center;
                >textarea {
                  margin-left :3px;
                  width:30%
                }
              }
            .text{
              width:70%;
              span {
                //padding-top: 1px;
                  padding-left : 3px;
                  padding-top: 5px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              .item-title{
                width:90%;
                font-weight: bold;
                color:black;
                font-size: 20px;
                .highlight {
                  padding-left : 0;
                  color:red;
                  background-color:yellow;
                }
                .title {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
   
              }
              > div{
                margin-top : 2px;
                margin-bottom : 11px
              }
            }
            .btns{
              display: flex;
              flex-wrap:wrap;
              align-content:center;
              width:30%;
              box-sizing: border-box;
              padding-left : 10%;
            }
            &.edit {
              .text > div {
              margin-top : 0px;
              margin-bottom : 3px;
              }
              .item-like > span {
                padding-top: 0px;
              }
              .text > .item-title > textarea {
                margin-top : 5px;
                height:25px;
              }
            }
          }
        }
        .item-row.hidden {
          display: none;
        }
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
        .wrap-items{
         .item-row {
          width:47%;
          margin-left :3%;
          display: block;
          position:relative;
          .image {
                width:100%;
                height:300px;
                padding-left:0;
                img {
                  border-radius: 12px;
                  width:100%;
                  height:100%;
                  object-fit: cover;
                }
                &.edit {
                  > .content {
                    justify-content: left;
                    p {
                      padding-left :10px;
                    }
                  }
                }
          }
            >.like {
              position:absolute;
              top:5%;
              right:3%;
              border-radius: 6px;
              background-color:rgba(0, 0, 0, 0.5);
              padding :7px;
              color : white;
              width:40%;
              display:flex;
              justify-content: center;
              box-sizing : border-box;
              >span {
                margin-top:3px;
              }
              >textarea {
                width:50%;
                height:20px;
                margin-left :5px;
              }
            }
            >.content{
              position:absolute;
              bottom:0%;
              border-bottom-right-radius: 12px;
              border-bottom-left-radius: 12px;
              background-color:rgba(0, 0, 0, 0.5);
              width:100%;
              box-sizing:border-box;
              padding:0 10px;
              color:grey;
              min-height:100px;
              > div{
                margin-bottom : 3px
              }
              .text{
                padding: 3% 3%;
                width:90%;
                position:relative;
                .item-title{
                  font-weight: bold;
                  color:white;
                  font-size: 20px;
                  .highlight {
                    color:red;
                    background-color:yellow;
                  }
                }
                .item-like {
                }
                .itme-date {

                }
                &.sub{
                  position:absolute;
                  top:0;
                }

              }
              .btns {
                position:absolute;
                top: -30px;
                right:5px;
                width:200px;
                justify-content: center;
              }
              &.edit {
                > div {
                margin-bottom : 0
                }
              }
            }

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
        .wrap-items{
          .item-row {
            width:95%; 
          }
        } 
      }
    }
  }
</style>