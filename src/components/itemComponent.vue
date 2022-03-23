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

<script>
export default {
  data(){
    return {
      windowWidth : window.innerWidth,
      windowHeight : window.innerHeight
    }
  },
  props:{
    item : {
      type:Object,
      default : () => ({})
    }
  }
}
</script>

<style>

</style>