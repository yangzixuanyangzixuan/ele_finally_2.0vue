<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current-->
          <li class="menu-item" v-for="(good, index) in goods"
              :class="{current: index===currIndex}" @click="clickMenuItem(index, $event)">
            <span class="text border-1px">
              <span class="icon" v-if="good.type>=0" :class="supportClasses[good.type]"></span>
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper"  ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="good in goods">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="food in good.foods" @click="clickFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :min-price="seller.minPrice" :delivery-price="seller.deliveryPrice"
                :foods="selectFoods" :update-food-count="updateFoodCount"
                @clearSelectFoods="clearSelectFoods"></shopcart>
    </div>
    <!--food组件-->
    <!--ref= 是父组件要调用子组件的方法-->
    <food :food="food" :update-food-count="updateFoodCount" ref="food"></food>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import shopcart from '../shopcart/shopcart.vue'
  import food from '../food/food.vue'

  const OK = 0
  export default {
    props: {
      seller: Object
    },

    data () {
      return {
        goods: [],
        supportClasses: ["decrease", "discount", "guarantee", "invoice", "special"],
        tops: [],
        scrollY: 0,
        food: {}
      }
    },

    created () {
      axios.get('/api2/goods')
        .then(response => {
          const result = response.data
          if (result.code === OK) {
            this.goods = result.data
            // 延迟到界面更新后执行
            /*setTimeout(() => {
             this._initScroll()
             }, 300)*/
            this.$nextTick(() => {
              this._initScroll()
              this._initTops()
            })
          }
        })
    },

    methods: {
      _initScroll () {
        // 创建menu的scroll
        new BScroll(this.$refs.menuWrapper, {
          click: true // 响应点击事件
        })
        // 创建foods的scroll
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3, // 让scroll的回调函数被调用
          click: true // 响应点击事件
        })

        // 监视foods的滚动
        this.foodsScroll.on('scroll', (pos) => {
          // console.log(pos.y)
          this.scrollY = Math.abs(pos.y)
        })
      },
      _initTops () {
        const tops = []
        let top = 0
        tops.push(top)
        // 找到所有对应的lis
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        for (var i = 0; i < lis.length; i++) {
          var li = lis[i]
          top += li.clientHeight
          tops.push(top)
        }
        this.tops = tops
        console.log(tops)
      },

      clickMenuItem (index, event) {
        // console.log(index, event)
        // 过滤原生事件的回调 即是在pc端会点击一次 会打印出两次的结果
        if(!event._constructed) {
          return
        }
        // alert(index)
        // 找到对应的li
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        const li = lis[index]
        // 平滑滑动到li
        this.foodsScroll.scrollToElement(li, 300)
      },
      //更新
      updateFoodCount (food, isAdd, event) {
        if(!event._constructed) {
          return
        }
        console.log('updateFoodCount()')
        if(isAdd) { // 增加1 数量添加 注意一定要设置 click：true
          if(!food.count) { // 第一次
            // 添加新的属性count(没有数据绑定)
            // food.count = 1
            this.$set(food, 'count', 1) // 有数据绑定, 会更新界面
          } else { // 不是一次
            food.count++
          }
        } else { // 减少1
          if(food.count) {
            food.count--
          }
        }
      },
    //清空购物列表
      clearSelectFoods () {
        this.selectFoods.forEach(food => {
          food.count = 0
        })
      },
//是当主组件内部发生事件变化时 this.$refs.food得到food对象来调用show()调用
      clickFood (food) {
        // 设定food
        this.food = food
        // 显示food
        this.$refs.food.show()
      }
    },

    computed: {
      currIndex () {  // 被选中的menu item的下标
        const {tops, scrollY} = this
        return tops.findIndex((top, index) => {
          // 条件: scrollY大于或等于当前top, 且小于下一个top
          return scrollY>=top && scrollY<tops[index+1]
        })
      },
      selectFoods () {
        const foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if(food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },

    components: {
      cartcontrol,
      shopcart,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
