<template>
  <div class="page">

    <!-- 顶部 -->
    <TopBar v-show="showTipBar" @close="closeBar" @open="openApp"></TopBar>

    <!-- 视频区域 -->
    <div>
        <div class="video-box" v-bind:class="playedTimes>=allowPlayTimes?'spec':''">
            <video v-show="!showPanelTip" id="myVideo" class="video-js video-js-box"  x5-playsinline="" playsinline="true" webkit-playsinline="true">
                <source v-bind:src="videoInfo.videoUrl" type="video/mp4">
            </video>
            <div class="video-box-panel" v-show="playedTimes>=allowPlayTimes"></div>
        </div>
        
        <div class="video-bottom-bar">
          <span @click="openApp()">打开APP，查看完整视频</span>
          <span class="bar-more"></span>
        </div>
    </div>

    <!-- 标题信息 -->
      <div class="title-info">
        <div class="title">{{videoInfo.title}}</div>
        <div class="sub-title margin-top-12">播放次数 {{videoInfo.playNum}}</div>
      </div>

    <!-- 内容区域 -->
    <div class="video-content">
        <div>
          <span class="content-title">视频简介</span>
          <span class="content-action" v-bind:class="upMark?'action-up':''" @click="check()"></span>
        </div>
        <div class="content-htmls" v-show="!upMark">
          <p>{{videoInfo.synopsisStart}}</p>
          <img v-bind:src="videoInfo.synopsisUrl" alt="">
          <p>{{videoInfo.synopsisEnd}}</p>
        </div>
    </div>

    <!-- 蒙版 -->
    <div class="panel-tip" v-show="showPanelTip"><img src="../assets/panel-tip.png" alt=""></div>
</div>

</template>

<script>
import TopBar from "../components/TopBar.vue";
import { setTimeout } from "timers";
export default {
  name: "Detail",
  components: {
    TopBar
  },
  data() {
    return {
      basicUrl: "http://dev-communityv5.tq-service.com", //http://manager_v5.tq-service.com
      videoId: 0, // 视频id
      playedTimes: 0, // 播放时长
      allowPlayTimes: 60000, // 允许播放时长1分钟
      upMark: false, //是否展开内容
      showTipBar: true, // 是否显示打开APP
      timer1: null, // 定时器
      myPlayer: null,
      androidAppUrl: "pgf63h://jkcommunity", // 安卓app地址
      iosAppUrl: "pgf63h://jkcommunity", // iosApp地址
      showPanelTip:false, // 是否显示在浏览器中打开
      videoInfo: {
        videoUrl: "test",
        playNum: 0,
        synopsisStart: "",
        synopsisEnd: "",
        synopsisUrl: "",
        title: ""
      }
    };
  },
  mounted() {
    this.getVideoInfo();
  },
  beforeDestroy() {
    window.clearInterval(this.timer1);
  },
  methods: {
    // 获取视频信息
    getVideoInfo() {
      let _this = this;
      _this.videoId = this.$route.query.id;
      this.$axios({
        method: "post",
        url: _this.basicUrl + "/community_admin/video/videoDetails",
        data: this.qs.stringify({
          videoId: _this.videoId
        })
      })
        .then(response => {
          if (response.data.errcode == 200) {
            _this.videoInfo = response.data.data;
            setTimeout(() => {
              _this.initVideo();
            }, 1000);
          }
        })
        .catch(error => {
          console.log(error); //请求失败返回的数据
        });
    },
    // 初始化视频
    initVideo() {
      //初始化视频方法
      let _this = this;
      _this.myPlayer = _this.$video(myVideo, {
        controls: true,
        autoplay: "muted",
        preload: "auto"
      });

      _this.myPlayer.on("play", function() {
        _this.timer1 = setInterval(function() {
          _this.changePlayedTimes();
        }, 1000);
      });

      _this.myPlayer.on("ended", function() {
        window.clearInterval(_this.timer1);
      });

      _this.myPlayer.on("pause", function() {
        window.clearInterval(_this.timer1);
      });
    },

    // 统计已播放时长
    changePlayedTimes() {
      this.playedTimes += 1000;
      if (this.playedTimes >= this.allowPlayTimes) {
        this.myPlayer.pause();
        window.clearInterval(this.timer1);
      }
    },

    // 控制内容显示
    check() {
      this.upMark = !this.upMark;
    },
    // 关闭bar
    closeBar() {
      this.showTipBar = false;
    },

    // 打开APP
    openApp() {
      var timeout = 3300,
        timer = null,
        mobelType = this.GetMobelType();
      if (mobelType.android) {
        if (mobelType.weixin || mobelType.qq) {
            this.showPanelTip = true;
        } else {
          var startTime = Date.now();
          var ifr = document.createElement("iframe");
          ifr.src = this.androidAppUrl; 
          ifr.style.display = "none";
          document.body.appendChild(ifr);
          timer = setTimeout(function() {
            var endTime = Date.now();
            if (!startTime || endTime - startTime < timeout + 300) {
              document.body.removeChild(ifr);
              window.location.href="http://www.tq-service.com/jkpros/download/index.html";
            }
          }, timeout);
        }
      } else if (mobelType.ios || mobelType.iPhone || mobelType.iPad) {
        window.location.href =
          "https://apps.apple.com/cn/app/%E5%A4%A7%E7%A4%BE%E5%8C%BA-%E7%BE%8E%E5%A5%BD%E9%82%BB%E9%87%8C/id1469761895";

        /*var ifr = document.createElement("iframe");
                ifr.src = myurl;
                ifr.style.display = "none";
            */

        //window.location.href = this.iosAppUrl; //唤起协议，由iOS小哥哥提供  //iOS9 + 不支持iframe唤起app;

        //document.body.appendChild(ifr);
        /* timer = setTimeout(function() {
              window.location.href = "ios下载的链接";
            }, timeout); */
      }
    },

    // 检测浏览器来源
    GetMobelType() {
      let browser = {
        versions: (function() {
          let u = window.navigator.userAgent;
          return {
            trident: u.indexOf("Trident") > -1, //IE内核
            presto: u.indexOf("Presto") > -1, //opera内核
            Alipay: u.indexOf("Alipay") > -1, //支付宝
            webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
            iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者安卓QQ浏览器
            iPad: u.indexOf("iPad") > -1, //是否为iPad
            webApp: u.indexOf("Safari") == -1, //是否为web应用程序，没有头部与底部
            weixin: u.indexOf("MicroMessenger") > -1, //是否为微信浏览器
            qq: u.match(/\sQQ/i) !== null, //是否QQ
            Safari: u.indexOf("Safari") > -1 ///Safari浏览器,
          };
        })()
      };
      return browser.versions;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.video-box {
  width: 100%;
  height: 2.1rem;
  background: #0f0e0d;
  position: relative;
}

.video-box video {
  object-fit: fill;
  width: 100%;
  height: 100%;
  z-index: 0 !important;
}

.video-box-panel {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999 !important;
}

.video-js-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1 !important;
}

.video-bottom-bar {
  height: 0.43rem;
  background: #6bc208;
  color: #fff;
  font-size: 0.15rem;
  letter-spacing: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar-more {
  display: inline-block;
  width: 0.1rem;
  height: 0.11rem;
  background: url(../assets/icon-arrrow-right.png) no-repeat 0;
  background-size: 100%;
  margin-left: 0.12rem;
  margin-top: 0.02rem;
}

.title-info {
  margin: 0.12rem 0.15rem 0.45rem 0.15rem;
}

.video-content {
  margin: 0 0.15rem 0.3rem 0.15rem;
}

.content-title {
  font-size: 0.24rem;
  color: #1b0f10;
  letter-spacing: 0.6px;
}

.content-action {
  display: block;
  width: 0.47rem;
  height: 0.28rem;
  background: url(../assets/icon-down.png) no-repeat center;
  background-size: 100%;
  float: right;
}

.action-up {
  background: url(../assets/icon-up.png) no-repeat center;
  background-size: 100%;
}

.content-htmls {
  font-size: 0.16rem;
  color: #555555;
  letter-spacing: 0;
  line-height: 0.3rem;
}

.content-htmls img {
  width: 100%;
}

@media screen and (min-width: 319px) {
  .video-box {
    height: 1.8rem !important;
  }
}

@media screen and (min-width: 359px) {
  .video-box {
    height: 2rem !important;
  }
}

@media screen and (min-width: 374px) {
  .video-box {
    height: 2.1rem !important;
  }
}

@media screen and (min-width: 413px) {
  .video-box {
    height: 2.5rem !important;
  }
}

@media screen and (min-width: 767px) {
  .video-box {
    height: 4rem !important;
  }
}

@media screen and (min-width: 1023px) {
  .video-box {
    height: 6rem !important;
  }
}
</style>
<style>
.video-js {
  z-index: 0 !important;
}
.video-js .vjs-big-play-button {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.spec .video-js .vjs-big-play-button {
  display: block !important;
}

.panel-tip{
    width:100%;
    height: 100%;
    background:rgba(0,0,0,0.78);
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 99999!important;
}

.panel-tip img{
    width:50%;
    position: absolute;
    right: 8%;
    top:1.5%;
}
</style>

