<template>
    <div style="margin-left:200px">
        <video autoplay controls width="800" height="500" id="videoElement"></video>
            
        <div width="800" style="margin-top:50px; margin-left:100px">
            <el-tag effect="dark">查找视频</el-tag>
            <el-select v-model="open" clearable placeholder="请选择" @change="searchFile">
                <el-option v-for="(item, index) in filelist" :key="index" :label="item.id" :value="item.date">
                </el-option>
            </el-select>
                <el-tag type="danger" effect="dark" style="margin-left:50px">删除视频</el-tag>

            <el-select v-model="del" clearable placeholder="请选择" @change="deleteFile">
                <el-option v-for="(item, index) in filelist" :key="index" :label="item.id" :value="item.date">
                </el-option>
            </el-select>
        </div>
    </div>
</template>
<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>
<script>
    import flvjs from 'flv.js'
    import {videoList, deleteVideo} from "@/api/index"
    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data(){
            return {
                filelist:[],
                nowVideo: '',
                url:'',
                open: '',
                del: '',
            }
        },
        mounted() {
            this.getList()
            // this.$nextTick(() => {
            //     this.createVideo()
            // })
        },
        methods: {
            createVideo() {
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('videoElement');
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: this.url, //你的url地址
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                }
            },
            async getList(){
                await videoList().then(res=>{
                    if(res.code === 200){
                        // console.log(res.data);
                        this.filelist = res.data;

                    }else{
                        console.log("获取加密数据失败");
                    }
                })
            },
            searchFile(name){
                this.url = 'http://10.128.206.152:8088/'+name;
                this.createVideo();
            },
            deleteFile(name){
                var param = {
                    fileName: name
                }
                deleteVideo(param).then(res=>{
                    if(res.code === 200){
                        console.log(res.message);
                    }else{
                        console.log(res.message);
                    }
                })
            }
            
        }
    }
</script>
