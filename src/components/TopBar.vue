<template>
    <!-- 顶部 -->
    <div class="video-top-bar">
      <div class="top-bar-close" @click="closeTip()"></div>
      <div class="top-bar-left">
        <div class="logo">
          <img src="../assets/logo.png" alt="大社区">
        </div>
        <div class="text">
          <span>大社区</span>
          <span>美好你的生活</span>
        </div>
      </div>
      <div class="top-bar-btn">
        <span @click="openApp()">打开APP</span>
      </div>
    </div>
</template>

<script>
export default {
  name: "TopBar",
  data() {
    return {

    };
  },
  methods:{
    closeTip(){
      this.$emit('close');
    },
    openApp(){
      this.$emit('open');
    }
  }
};
</script>

<style scoped>
/* 顶部bar样式 */

.video-top-bar {
  width: 100%;
  height: 0.56rem;
  opacity: 0.93;
  background: rgba(255, 255, 255, 0.93);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999!important;
}

.top-bar-close {
  position: absolute;
  right: 0.1rem;
  top: 0.1rem;
  width: 0.12rem;
  height: 0.12rem;
  background: url(../assets/icon-close.png) no-repeat 0;
  background-size: 100%;
}

.top-bar-left {
  width: 50%;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
}

.top-bar-left .logo {
  width: 0.38rem;
  height: 0.38rem;
  background: #6bc208;
  border-radius: 50%;
  margin: 0 0.11rem 0 0.25rem;
}

.top-bar-left .logo img{
  width: 100%;
  border-radius: 50%;
}

.top-bar-left .text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  letter-spacing: 0;
}

.top-bar-left .text span:nth-of-type(1) {
  font-size: 0.14rem;
  color: #1b0f10;
}

.top-bar-left .text span:nth-of-type(2) {
  font-size: 0.12rem;
  color: #999999;
}

.top-bar-btn {
  width: 50%;
  height: 100%;
  float: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.top-bar-btn span {
  width: 0.92rem;
  height: 0.34rem;
  background: #ffffff;
  border-radius: 0.34rem;
  font-size: 0.15rem;
  color: #1b0f10;
  letter-spacing: 0;
  text-align: center;
  line-height: 0.34rem;
  display: block;
  margin-right: 0.3rem;
}
</style>

