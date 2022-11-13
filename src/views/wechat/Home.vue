<template>
  <div>
    <el-input v-model="search" placeholder="Please input" style="width:200px"/>
    <el-button type="primary" @click="searchChatRoom()">查询房间</el-button>
    <el-button type="primary" @click="addChatRoom()">创建房间</el-button>
    <el-row style="margin-top:50px">
      <el-col
        v-for="img in imgs"
        :key="img.id"
        :span="4"
        :offset="1"
        style="margin-top:20px"
      >
        <el-button style="float:right;" type="danger" circle @click="deleteRoom(img.id)">x</el-button>
        <el-card :body-style="{ padding: '0px' }">
          <img
            :src="img.url"
            class="image"
          />
          <div style="padding: 14px">
            <span>{{img.id}}号直播间</span>
            <div class="bottom">
              <time class="time">{{ img.date }}</time>
              <el-button type="primary" @click="enterChatRoom(img.id)">进入房间</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {createRoom, insertRoom, getRooms, deleteRoomAPI} from "@/api/index"
import {getStore} from '@/utils/storage.js'
export default {
  name: "Room",
  inject: ['reload'],
  data() {
    return {
      date: "",
      imgs: [],
      count: 0,
      search: "",
      alive: null,
    }
  },
  created() {
    this.alive = new Set();
    this.user = JSON.parse(getStore("user"));
    this.searchRooms();
  },
  methods:{
    async addChatRoom(){
      if(this.alive.size == 10){
        alert("创建房间超过上限了，请等待...");
        return;
      }
      var nowDate = new Date();
      var img = {
        url: "",
        id:0,
        name: "",
        date: nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate(),
        creator:"admin"
      }
      //获取用户名
      var room = {
        room:0,
        name:this.user.userName
      }
      await createRoom(room).then(res=>{
        if(res.code == 200){
          img.id = res.data;
          img.name = res.data+"号房间";
          img.url = "https://picsum.photos/id/"+img.id+"/400/300"
        }else{
          console.log("创建失败");
        }
      })
      this.imgs.push(img);
      this.alive.add(img.id);
    },
    async enterChatRoom(index){
      var room = {
        room: index
      }
      await insertRoom(room).then(res=>{
        if(res.code == 200){
          this.$router.push({
            name:"Wechat",
            params:{key: res.data, id: index}
          })
        }else{
        }
        return;
      })
    },
    async searchChatRoom(){
      if(!this.alive.has(this.search)){
        this.$message({
          message: '没有这个房间',
          type: 'warning'
        });
      }else{
        var room = {room: this.search}
        await insertRoom(room).then(res=>{
          if(res.code == 200){
            this.$router.push({
              name:"Wechat",
              params:{key: res.data, id: this.search}
            })
          }else{
            console.log("进入失败");
          }
          return;
        })
      }
      
    },
    async searchRooms(){
      var nowDate = new Date();
      this.imgs = [];
      await getRooms("").then(res=>{
        if(res.code == 200){
          for(var i=0; i<res.data.length; ++i){
            var now = {
              url:"https://picsum.photos/id/"+res.data[i].room+"/400/300",
              id: res.data[i].room,
              name: res.data[i].name,
              date: nowDate.getFullYear()+"/"+(nowDate.getMonth()+1)+"/"+nowDate.getDate(),
              creator: res.data[i].name,
            }
            this.imgs.push(now); this.alive.add(res.data[i].room);
          }

        }else{
          console.log("请求失败");
        }
      })
    },
    deleteRoom(room){
      var data = {
        room: room,
        name: this.user.userName
      }
      deleteRoomAPI(data).then(res=>{
        if(res.code == 200){
          if(res.message == "yes"){
            alert("删除成功"); this.alive.delete(room);
            this.reload()
          }
          if(res.message == "no") alert("没有删除权限") 
        }else{
          alert("没有删除权限") 
        }
      })
    }
  }
}
</script>
  
  <style>
  .time {
    font-size: 12px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .button {
    padding: 0;
    min-height: auto;
  }
  
  .image {
    width: 100%;
    display: block;
  }
  </style>
  