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
            @click="clickEditBtn">
            수정
          </button>
          <button
            class="remove"
            @click="clickRemoveBtn">
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
            @edit="editItemValue" />
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
          @edit="editItemValue" />
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
              @edit="editItemValue" />
          </div>
          <div class="item-title">
            <Textarea
              :class-name="['item-title-text']"
              :input-text="itemView.title"
              :target="'title'"
              placeholder="변경할 TITLE의 값을 입력해주세요."
              @edit="editItemValue" />
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
              @edit="editItemValue" />
          </div>
        </div>
        <div class="btns">
          <button
            class="update"
            @click="clickCancelBtn">
            취소
          </button>
          <button
            class="remove"
            @click="clickSaveBtn(itemView.id)">
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
    this.addResizeEvent();
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
  props:{
    item : {
      type:Object,
      default : () => ({})
    }
  },
  emits: ['remove-item','edit-item','set-default-image'],
  methods : {
    //반응형 컴포넌트를 위해 뷰포트 크기를 받아오는 이벤트를 추가합니다.
    addResizeEvent(){
      window.addEventListener('resize',()=>{
        const {innerWidth, innerHeight} = window;
        this.setViewPortSize(innerWidth, innerHeight)
      })
    },
    //컴포넌트 생성시 이미지를 로드하고 이미지를 불러오지 못할경우 default-image로 변환합니다.
    async initImage(){
      try{
        await this.$loadImage(this.itemView.imageUrl);
      } catch(error){
        this.itemView.imageUrl = noImage;
        this.$emit('set-default-image', {id: this.itemView.id, url : this.itemView.imageUrl});
      }
    },
    //화면/수정용 itemView 객체를 생성합니다.
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
    //viewport의 크기를 저장합니다.
    setViewPortSize(width, height){
      this.windowWidth = width;
      this.windowHeight = height;
    },
    //삭제버튼 클릭시 상위 컴포넌트의 removeItem을 실행합니다.
    clickRemoveBtn(){
      this.$emit('remove-item',this.item.id);
    },
    //수정버튼 클릭시 수정화면으로 전환합니다.
    clickEditBtn(){
      this.itemView.edit = true;
    },
    //취소버튼 클릭시 기존화면으로 전환합니다.
    clickCancelBtn(){
      this.itemView.title = this.item.title;
      this.itemView.likeCount = this.item.likeCount;
      this.itemView.imageUrl = this.item.imageUrl;
      this.itemView.edit = false;
    },  
   //저장버튼 클릭시 이미지를 로드하고 상위 컴포넌트의 editItem를 실행합니다.
   async clickSaveBtn(){
      try{
        await this.$loadImage(this.itemView.imageUrl);
      } catch(error){
        this.itemView.imageUrl = noImage;
      }
      this.itemView.edit = false;
      this.$emit('edit-item', this.itemView);
    },
    //TextArea 컴포넌트에서 전달 받은 값을 set 합니다.
    editItemValue({target, value}){
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