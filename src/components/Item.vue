<template>
  <div
    class="item-row"
    :class="{'hidden' : item.isHidden}">
    <template v-if="!itemView.edit">
      <div class="image">
        <img :src="itemView.imageUrl" />
      </div> 
      <div
        class="like"
        v-if="windowWidth < 1025">
        LIKE: {{ itemView.likeCount }}
      </div>
      <div class="content">
        <div
          class="text"
          v-if="windowWidth > 1025">
          <div class="item-like">
            <span>LIKE:</span> 
            <span class="like">{{ itemView.likeCount }}</span>
          </div>
          <div
            class="item-title"
            v-html="item.titleView">
          </div>
          <div class="item-date">
            {{ itemView.date }}
          </div>
        </div>
        <div
          class="text"
          v-else>
          <div class="item-date">
            {{ itemView.date }}
          </div>
          <div
            class="item-title"
            v-html="item.titleView">
          </div>
        </div>
        <div class="btns">
          <button
            class="update"
            @click="fncClickEditBtn">
            수정
          </button>
          <button
            class="remove"
            @click="fncClickRemoveBtn">
            제거
          </button>
        </div>
      </div>
    </template>
    <template v-if="itemView.edit">
      <div
        class="image edit">
        <div class="content">
          <p>이미지 URL</p>
          <Textarea
            :input-text="itemView.imageUrl"
            :target="'imageUrl'"
            :class-name="['image-text']"
            placeholder="변경할 이미지의 url을 입력해주세요."
            @edit="fncEditItemValue" />
        </div> 
      </div>
      <div
        class="like"
        v-if="windowWidth < 1025">
        <span>LIKE:</span>
        <Textarea
          :input-text="itemView.likeCount"
          :target="'likeCount'"
          :class-name="['like-text']"
          placeholder="LIKE"
          @edit="fncEditItemValue" />
      </div>
      <div class="content edit">
        <div
          class="text"
          v-if="windowWidth > 1025">
          <div class="item-like">
            <span>LIKE:</span>
            <Textarea
              :class-name="['item-like-text']"
              :input-text="itemView.likeCount"
              :target="'likeCount'"
              placeholder="변경할 LIKE의 값을 입력해주세요."
              @edit="fncEditItemValue" />
          </div>
          <div class="item-title">
            <Textarea
              :class-name="['item-title-text']"
              :input-text="itemView.title"
              :target="'title'"
              placeholder="변경할 TITLE의 값을 입력해주세요."
              @edit="fncEditItemValue" />
          </div>
          <div class="item-date">
            {{ itemView.date }}
          </div>
        </div>
        <div
          class="text"
          v-else>
          <div class="item-date">
            {{ itemView.date }}
          </div>
          <div class="item-title">
            <Textarea
              :class-name="['item-title-text']"
              :input-text="itemView.title"
              :target="'title'"
              placeholder="변경할 TITLE의 값을 입력해주세요."
              @edit="fncEditItemValue" />
          </div>
        </div>
        <div class="btns">
          <button
            class="update"
            @click="fncClickCancelBtn">
            취소
          </button>
          <button
            class="remove"
            @click="fncClickSaveBtn(itemView.id)">
            저장
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Textarea from './Textarea.vue'
import noImage from '../assets/no-image.png'
export default {
  components:{Textarea},
  created(){
    this.itemView = this.initItem(this.item);
    window.addEventListener('resize',()=>{
      const {innerWidth, innerHeight} = window;
      this.fncSetViewPortSize(innerWidth, innerHeight)
    })
    
  },
  mounted(){
    this.initImage();
  },
  data(){
    return {
      windowWidth : window.innerWidth,
      windowHeight : window.innerHeight,
      itemView : null
    }
  },
  update(){
    this.initImage();
  },
  props:{
    item : {
      type:Object,
      default : () => ({})
    }
  },
  methods : {
    async initImage(){
      try{
        await this.$loadImage(this.itemView.imageUrl);
      } catch(error){
        this.itemView.imageUrl = noImage;
        this.$emit('fnsSetDefaultImage', {id: this.itemView.id, url : this.itemView.imageUrl});
      }
    },
    initItem(item){
        let date = new Date(item.createdAt);
        return {
          id : item.id,
          date : `${date.getFullYear()}. ${date.getMonth()}. ${date.getDay()}.`,
          title : item.title,
          likeCount : item.likeCount,
          imageUrl : item.imageUrl,
          edit : false,
        };
    },
    fncSetViewPortSize(width, height){
      this.windowWidth = width;
      this.windowHeight = height;
    },
    fncClickRemoveBtn(){
      this.$emit('fncRemoveItem',this.item.id);
    },
    fncClickEditBtn(){
      this.itemView.edit = true;
    },
    fncClickCancelBtn(){
      this.itemView.title = this.item.title;
      this.itemView.likeCount = this.item.likeCount;
      this.itemView.imageUrl = this.item.imageUrl;
      this.itemView.edit = false;
    },  
   async fncClickSaveBtn(){
      try{
        await this.$loadImage(this.itemView.imageUrl);
      } catch(error){
        this.itemView.imageUrl = noImage;
      }
      this.itemView.edit = false;
      this.$emit('fncEditItem', this.itemView);
    },
    fncEditItemValue({target, value}){
      this.itemView[target] = value;
    }  
  }
}
</script>

<style lang="scss" scoped>
  .item-row {
    margin-top: 16px;
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    display:flex;
    align-items: center;
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
            padding-left:0;
          }
        }
    }
    .content{
      width:80%;
      box-sizing:border-box;
      padding-left:30px;
      color:grey;
      display: flex;
      .item-like {
          display : flex;
          align-content: center;
        }
      .text{
        width:70%;
        span {
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
          }
          .item-title ::v-deep(.title) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-title ::v-deep(.highlight) {
                padding-left : 0;
                color:red;
                background-color:yellow;
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
      }
    }
  }

  .item-row.hidden {
    display: none;
  }

  @media (max-width: 1024px){
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
              border-radius: 12px;
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
          height:40px;
          display:flex;
          justify-content: center;
          align-items: center;
          box-sizing : border-box;
          >span {
            margin-top:3px;
          }
        }
        >.content{
          position:absolute;
          bottom:0%;
          border-radius: 12px;
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
  @media (max-width: 480px){
    .item-row {
      width:95%; 
    }
  }     
</style>