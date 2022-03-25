import {shallowMount} from '@vue/test-utils'
import storage from '~/plugins/storage.js'
import {DUMMY} from '~/dummies.js'
import App from '~/App.vue'
describe('App.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App, {
      global: {
        plugins: [
          storage
        ]
      },
    })
  })
  test('App component에 정의된 initItems 함수의 정상동작여부를 테스트 합니다.', () =>{ 
    const initItems = wrapper.vm.initItems(DUMMY);
    initItems.forEach(item => {
      expect(item.titleView).toBe(`<div class=title>${item.title}</div>`);
    })
  })

  test('App component에 정의된 addItem 함수의 정상동작여부를 테스트 합니다.', () => {
    let addItem = {
      id : '',
      title : 'test',
      createdAt : '',
      likeCount : '111',
      imageUrl : 'test.png',
    }
    wrapper.vm.addItem(addItem);
    expect(wrapper.vm.items.pop()).toEqual(addItem);
  })
  test('App component에 정의된 removeItem 함수의 정상동작여부를 테스트 합니다.', () => {
    let addItem = {
      id : '',
      title : 'test',
      createdAt : '',
      likeCount : '111',
      imageUrl : 'test.png',
    }
    wrapper.vm.addItem(addItem);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).toEqual(addItem);
    wrapper.vm.removeItem(addItem.id);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).not.toEqual(addItem);
  })
  test('App component에 정의된 searchItem 함수의 정상동작여부를 테스트 합니다.', () => {
    let addItem = {
      id : '',
      title : 'test',
      createdAt : '',
      likeCount : '111',
      imageUrl : 'test.png',
    }
    wrapper.vm.addItem(addItem);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).toEqual(addItem);
    wrapper.vm.searchItem('제목');
    expect(wrapper.vm.items[0].isHidden).toBe(false);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1].isHidden).toBe(true);
  })
  test('App component에 정의된 matchKeyword 함수의 정상동작여부를 테스트 합니다.', () => {
    let addItem = {
      id : '',
      title : 'test',
      createdAt : '',
      likeCount : '111',
      imageUrl : 'test.png',
    }
    wrapper.vm.addItem(addItem);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).toEqual(addItem);
    wrapper.vm.matchKeyword('제목1');
    expect(wrapper.vm.items[0].titleView).toBe(`<div class="title"><span class="highlight">제목1</span> <span class="highlight">제목1</span> </div>`);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1].titleView).toBe(`<div class="title">${addItem.title}</div>`);
  })
  test('App component에 정의된 editItem 함수의 정상동작여부를 테스트 합니다.', () => {
    let addItem = {
      id : '',
      title : 'test',
      createdAt : '',
      likeCount : '111',
      imageUrl : 'test.png',
    }
    wrapper.vm.addItem(addItem);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).toEqual(addItem);
    let editItem = {
      id : addItem.id,
      title : 'testEdit',
      likeCount : '222',
      imageUrl : 'testEdit.png',
    }
    editItem.title = `<div class="title">${editItem.title}</div>`
    wrapper.vm.editItem(editItem);
    expect(wrapper.vm.items[wrapper.vm.items.length - 1]).not.toEqual(addItem);
    const editAddItem = wrapper.vm.items[wrapper.vm.items.length - 1]
    expect(editAddItem.id).toBe(editItem.id);
    expect(editAddItem.title).toBe(editItem.title);
    expect(editAddItem.likeCount).toBe(editItem.likeCount);
    expect(editAddItem.imageUrl).toBe(editItem.imageUrl);

  })
})