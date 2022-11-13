<template>
	<div class="mainContainer">
 
        <video name="videoElement" class="centeredVideo" id="videoElement" controls height="500" style="margin-top: -50px;" autoplay></video>
    </div>
</template>
<script>
import flvjs from 'flv.js'
export default{
	name: "ChatVideo",
	props: ['room', 'name'],
	data(){
		return {
			videoElement: null,
			flvPlayer: null
		}
	},
	created(){
		if (flvjs.isSupported()) {this.startVideo()};
	},
    mounted(){
        // start(){
                this.flvPlayer.attachMediaElement(videoElement);
                this.flvPlayer.load();
                this.flvPlayer.play();
                // this.videoElement.addEventListener('click', function(){
                //     alert( '是否支持点播视频：' + flvjs.getFeatureList().mseFlvPlayback + ' 是否支持httpflv直播流：' + flvjs.getFeatureList().mseLiveFlvPlayback )
                // })
        // }
    },
	methods:{
		async startVideo(){
            this.videoElement = document.getElementById('videoElement');
            this.flvPlayer = flvjs.createPlayer({
                type: 'flv',
                enableWorker: true,     //浏览器端开启flv.js的worker,多进程运行flv.js
                isLive: true,           //直播模式
                hasAudio: false,        //关闭音频             
                hasVideo: true,
                stashInitialSize: 128,  
                enableStashBuffer: false, //播放flv时，设置是否启用播放缓存，只在直播起作用。
                url: 'http://10.128.206.152:8088/live?port=1935&app=myapp&stream='+this.room.room+","+this.name.name,
            });
            
        },
		destoryVideo(){
            this.flvPlayer.pause();
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
            this.flvPlayer = null;
        },
		reloadVideo(){
            this.destoryVideo()
            this.startVideo()
        },
        
	}
}
</script>
<style scoped>
.mainContainer {
	display: block;
	/* width: 1024px;
    height: 500px; */
	margin-left: auto;
	margin-right: auto;
}

.urlInput {
	display: block;
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	margin-top: 8px;
	margin-bottom: 8px;
}

.centeredVideo {
	display: block;
	width: 100%;
	height: 576px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: auto;
}

.controls {
	display: block;
	width: 100%;
	text-align: left;
	margin-left: auto;
	margin-right: auto;
	margin-top: 8px;
	margin-bottom: 10px;
}

.logcatBox {
	border-color: #CCCCCC;
	font-size: 11px;
	font-family: Menlo, Consolas, monospace;
	display: block;
	width: 100%;
	text-align: left;
	margin-left: auto;
	margin-right: auto;
}
</style>