<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
        <!--星星组件-->
          <star :score="seller.score" :size="36"></star>
          <span class="text">{{seller.sellCount}}</span>
          <span class="text">月售单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <!--主要是把 已收藏 的字体颜色变成红色  -->
          <span class="icon-favorite" :class="{active: favorite}"></span>
          <span class="text">已收藏</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="supports">
          <li class="support-item border-1px" v-for="support in seller.supports">
            <span class="icon" :class="supportClasses[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
       <split></split>

      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picsUl">
            <li class="pic-item" v-for="pic in seller.pics">
              <img width="120" height="90" :src="pic">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import BScroll from 'better-scroll'
  export default {
    props: ['seller'],
    data(){
      return {
        favorite:localStorage.getItem('favorite')==='true',
        supportClasses: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      }
    },
    created(){
      this.supportClasses =['decrease', 'discount', 'special', 'invoice', 'guarantee']

     if(this.seller.name){
        //seller是个带数据的对象(切换路由过来)
       this.showSeller()
     }

    },

    methods:{
      showSeller(){
          //如果picsScroll对象存在scroll 就不用再创建scroll对象
          if(this.picsScroll){
            return
          }
      //编译是在created之后 所以要用一个$nextTick()函数对象
          this.$nextTick(()=>{
            // 此时seller可能是一个空对象(在当前路由上刷新), 也可能是个带数据的对象(切换路由过来)
            this.scroll = new BScroll(this.$refs.seller,{
              click:true
            })
            //对于图片水平方向的滑动 的设置
            //统计ul所需的宽度
            //要结合实际图片的大小进行设置 120 和 6
            const picWidth= 120;
            const space =6
            const imgCount= this.seller.pics.length
            //给ul设置样式的宽度
            this.$refs.picsUl.style.width=imgCount*(picWidth+space)-space+'px'

            //创建水平滚动
            this.picsScroll = new BScroll(this.$refs.picWrapper,{
              click:true,
              scrollX:true
            })

          })
        },

      toggleFavorite(){
        this.favorite = !this.favorite
        //保存到本地
        localStorage.setItem('favorite',this.favorite)
      },
    },

    //在数据更新之后 seller变得有值
    updated(){
      this.showSeller();
    },

    components:{
      star,
      split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styuls/mixin.styl"

  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .stars
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border-none()
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
