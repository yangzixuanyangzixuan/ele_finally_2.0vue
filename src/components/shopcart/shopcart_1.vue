<!--底部购物车的实现-->
<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggle">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart highlight"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <!--<div class="pay" :class="{'not-enough': totalPrice<minPrice, enough: totalPrice>=minPrice}">-->
          <div class="pay" :class="totalPrice<minPrice ? 'not-enough' : 'enough'">
            {{payText}}
          </div>
        </div>
      </div>
      <div class="ball-container"></div>

      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in foods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <div class="list-mask" v-show="listShow" @click="toggle"></div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  export default{
   //初始化 接受父组件goods传送过来的数据
    props:{
      minPrice:Number,
      deliveryPrice:Number,
      foods:Array,
      updateFoodCount:Function
    },
    data(){
      return {
        isShow:false
      }
    },
   computed:{
        // 对totalPrice 进行数值的计算
     totalPrice(){
       //对总钱数的一个统计 进行遍历
       return this.foods.reduce((preToal,food)=>{

         return preToal + food.price * food.count
         // 0 就是指配送费的初始值的设置
       },0)

     },
     totalCount(){
       return this.foods.reduce((preTotal,food)=>{
         return preTotal+food.count
       },0)
     },
     /*对总结算的计算*/
     payText(){
       const minPirce = this.minPrice
       //读取这个值时 会自动调取totalPrice()函数
       const totalPrice = this.totalPrice
       if(totalPrice === 0){
         return `￥${minPirce}元起送`
       }else if(minPirce > totalPrice){
         return `还差￥${minPirce-totalPrice}元起送`
       }else {
         return '去结算'

       }

     },
     listShow(){
       //根据购买的总数量进行判断，修改标识符的初始值

       //如果总数量为0 直接返回false
       if(!this.totalCount){
         this.isShow =false;
         return false
       }

      //如果数量不为0 进行下面的执行
       if(this.isShow){
      // 如何只创建一个对象？
         //--1 判断是否已经存在保存的对象，如果不存在，进入2
         // --2 创建对象，将对象保存起来
         this.$nextTick(()=>{
           if(!this.scroll){//不存在滑动效果 进行创建
             this.scroll = new BScroll(this.$refs.listContent,{//第一次显示列表时所创建
               click:true
             })
           }else{
             this.scroll.refresh()//刷新一次滚轮
           }
         })

       }
       return this.isShow
     }


   },
    methods: {
      toggle () {
        console.log('toggle()')
        this.isShow = !this.isShow
      }
    },
    components:{
      cartcontrol
    }

  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
