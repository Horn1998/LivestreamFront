<template>
	<div id="frame" style="margin-top:-30px;">
		<div id="chat" ref="chatbox" style="scrollbar-width: none; -ms-overflow-style: none;">
			<el-card class="card-header" style="position: absolute; width:15%; background-color:skyblue; text-align: center; font-family:楷体; font-weight: bold; font-size:20px"><span>欢迎来到{{this.user.userName}}的直播间</span></el-card> 
			<div style="margin-top:80px;">
				<Message v-for="message in messages" :key="message.id" :name="message.name" :time="message.time" :content="message.content"
				:type="message.type"></Message>
			</div>
		</div>
		<div id="danmu-frame" ref="danmuref">
			<div style="position: relative;z-index: 12;">
				<Danmu v-for="dan in danmus" :key="dan.id" :id="dan.id" :content="dan.content" :color="dan.color" :bold="dan.bold"
				:position="dan.position" :size="dan.size" :italic="dan.italic" :width="dan.width" :height="dan.height" :type="dan.type"
				@deletedan='deleteDanmu'></Danmu>
			</div>
			<div style="position: relative; z-index: 11;">
				<ChatVideo :room="{room}" :name="{name}"></ChatVideo>
			</div>
			<div class="input">
				<div style="width: 100%;">
					<form action="" style="display: flex; justify-content: space-around;font-size: 17px;">
						<div>
							<span>字体大小：</span>
							<select v-model="message.size">
								<option value="30" checked="checked">小</option>
								<option value="50">中</option>
								<option value="80">大</option>
							</select>
						</div>
						
						<div>
							<span>字体颜色：</span>
							<select v-model="message.color">
								<option value="#000" checked="checked">黑</option>
								<option value="red">红</option>
								<option value="yellow">黄</option>
								<option value="blue">蓝</option>
								<option value="green">绿</option>
							</select>
						</div>
						
						<div>
							<span>弹幕位置：</span>
							<select v-model="message.position">
								<option value="0" checked="checked">随机</option>
								<option value="1">顶端</option>
								<option value="2">底部</option>
							</select>
						</div>
						
						<div>
							<span>昵称：</span>
							<input class="form-input" readonly="true" style="width:80px; background-color: transparent; font-weight: bold; font-family: 楷体;" @keyup.enter="send()" v-model="message.name" type="text" maxlength="6" />
						</div>
						
						<div>
							<span>内容：</span>
							<input class="form-input" @keyup.enter="send()" v-model="message.content" type="text" maxlength="32" />
						</div>
						<!-- v-model="chatPopover" -->
						<div
							ref="popover5"
							placement="top-start"
							width="200"
							hidden="true"
						>
							<p>
							<ChatEmoji
								v-on:selectEmoji="selectEmoji"
								:inpMessage="message"
								style="position:fixed; margin-left:40px;"
							/>
							</p>
						</div>
						<div
							style = "v-popover:popover5"
							class="chatRoom_input_emoji"
							@click="showEmojiHandle"
						>
							<img :src="require('@/assets/img/smile.png')" style="width:20px; height:20px" />
						</div>
						<div>
							<el-button style="height:25px; padding-top:5px" @click="send()" type="primary" required="required" > 发送</el-button>
						</div>
						<div>
							<el-button style="height:25px; padding-top:5px" @click="sign()" type="primary" required="required" >{{this.signer.status}}</el-button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var socket;
	var time = new Date()
	import Message from './Components/Message.vue'
	import Danmu from './Components/Danmu.vue'
	import ChatVideo from './Components/ChatVideo.vue'
	import {getStore} from '@/utils/storage.js'
	import ChatEmoji from './Components/Emoji.vue'
	import {doSign, pubSign, getRole, stopSign} from '@/api/index'
	const uuid = require('uuid')
	//websocket服务器的地址  ws://ip:端口/netty_context_path
	// const ip = "10.128.206.152"      		//后端ip地址
	const ip = "127.0.0.1"
	const netty_port = 7000      		//和后端保持一致
	// const server_port = 8888  		//和服务器保持一致
	const server_port = 8088            //本地测试
	const context_path = "/groupchat"   //和后端保持一致

	export default {
		name: "Room",
		components: {
			Message, 
			Danmu,
			ChatVideo,
			ChatEmoji
		},
		data() {
			return {
				message: {
					'content': "",
					'size': '30',
					'color': '#000',
					'bold': false,
					'italic': false,
					'position': 0,
					'ip': '127.0.0.1',
					'name': "",
					'time': '',
					'available': 1,
					'room': 0,
					'signer': '签到'
				},
				sendnum: 0,
				messages: [],	//评论区信息
				danmus: [], //弹幕信息
				user: null, //用户信息
				emoji: '', //表情信息
				signer: {status: "签到"}, //签到状态
				role : 0 //用户状态
			}
		},
		created() {
			this.user = JSON.parse(getStore("user"));
			var _self = this;
			this.room = this.$route.params.id;
			this.name = this.user.userName;
			//确定当前用户角色
			this.verifyRole();

			var history = this.$route.params.key;
			if(history != null)
			for(var i=0; i<history.length; ++i){
				if(history[i].name == this.user.userName) _self.addMessage(history[i], 1);
				else _self.addMessage(history[i], 0);
				// this.addDanmu(history[i], 0);
				// _self.addDanmu(JSON.parse(history[i]));
			}
			//判断当前的浏览器是否支持 websocket
			if (window.WebSocket) {
				//go on
				socket = new WebSocket("ws://"+ip+":"+netty_port+context_path)
			
				//相当于channelRead0，ev收到服务器端回送的消息
				socket.onmessage = function(ev) {
					var data = JSON.parse(ev.data)
					_self.addMessage(data, 0)
					_self.addDanmu(data, 0)
				}
				//相当于连接开启
				socket.onopen = function() {
					console.log("连接开启了...");
					//rt.value = "连接开启了..."
				}

				//感知到连接关闭
				socket.onclose = function() {
					console.log("连接关闭了...");
					// rt.value = rt.value + "\n" + "连接关闭了..."
				}
			} else {
				alert("当前的浏览器不支持websocket");
			};
			this.message.name = this.user.userName;
		},
		methods: {
			//消息框滑轮触底
			scrollToBottom() {
				var _self = this
				window.setTimeout(function() {
					_self.$refs.chatbox.scrollTop = 100000000
				}, 100);
			},
			send() {
				this.message.room = this.$route.params.id;
				// var _self = this
				if (socket.readyState == WebSocket.OPEN) {
					this.message.content = this.message.content.replace(/^\s*|\s*$/g,"");  //内容去首尾空格
					this.message.name = this.message.name.replace(/^\s*|\s*$/g,"");    //昵称去首尾空格
					if (this.message.content != '' && this.message.name !='') {
						this.message.time = this.getTime()
						//后端springboot存储弹幕接口地址
						// this.$axios.post("http://"+ip+":"+server_port+"/message/save", this.message).then(() => {
						// 	this.message.content = ""
						// });
						
						this.addMessage(this.message, 1)
						this.addDanmu(this.message, 1)
						//通过socket 发送消息
						socket.send(JSON.stringify(this.message))
						this.message.content = "";
					}
				} else {
					alert("连接没有开启")
				}
			},
			//添加消息
			async addMessage(message, type) {
				var msg = new Object();
				msg.id = uuid.v4()
				msg.name = message.name;
				msg.content = message.content
				msg.time = message.time
				msg.type = type
				this.messages.push(msg)
				this.scrollToBottom()
			},
			sign(){
				var user = {
					user:this.user.userName,
					room: this.room
				}
				if(this.role == 1){
					pubSign(user).then(res=>{
							this.$set(this.signer, "status", "结束签到");
							this.role = 2;
							alert("签到发起成功");
						}
					)
				}
				if(this.role == 0){
					doSign(user).then(res=>{
						if(res.code == 200){
							alert(res.message);
						}
					})
				}
				if(this.role == 2){
					stopSign(user).then(res=>{
						//...
						this.role = 1;
					})
					this.$set(this.signer, "status", "发布签到");
				}
				// sign(user).then(res=>{
				// 	alert(res.message);
				// })
			},
			async verifyRole(){
				var user = JSON.parse(getStore("user"));
				var data = {
					room:this.room,
					name:user.userName
				}
				await getRole(data).then(res=>{
					if(res.message == "1"){
						this.$set(this.signer, "status", "发布签到")
						this.role = 1
					}else if(res.message == "2"){
						this.$set(this.signer, "status", "结束签到")
						this.role = 2
					}else{
						this.$set(this.signer, "status", "签到")
						this.role = 0
					}
				})
			},
			//添加弹幕
			addDanmu(data, type) {
				var danmu = new Object();
				danmu.id = uuid.v4()
				danmu.content = data.content;
				danmu.color = data.color;
				danmu.position = data.position
				danmu.size = data.size
				danmu.type = type
				// console.log(this.$refs.danmuref)
				danmu.width = this.$refs.danmuref.offsetWidth
				danmu.height = this.$refs.danmuref.offsetHeight
				if (data.bold) danmu.bold = 'bolder'
				else danmu.bold = 'normal'
				if (data.italic) danmu.italic = 'italic'
				else danmu.italic = 'normal'
				this.danmus.push(danmu)
			},
			//删除弹幕
			deleteDanmu(ids) {
				this.danmus = this.danmus.filter(danmu => danmu.id != ids)
			},
			//时间格式
			getTime() {
				var t = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() +
					" " + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
				return t;
			},
			showEmojiHandle(){
				this.$refs.popover5.hidden = !this.$refs.popover5.hidden
			},
			selectEmoji(emoji){
				console.log(emoji)
				this.$refs.popover5.hidden = !this.$refs.popover5.hidden
				this.message.content += emoji;
			}
		}
	}
</script>
<style scoped>
	::-webkit-scrollbar {

	display: none; /* Chrome Safari */

	}
	#frame {
		width: 100%;
		height: 75%;
		margin: 0 auto;
		position: absolute;
	}

	#chat {
		float: left;
		width: 15%;
		height: 100%;
		background-image: url("~@/assets/img/bg1.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		overflow-y: scroll;
	}

	#danmu-frame {
		float: left;
		width: 65%;
		height: 100%;
		background-color: #FFF;
		overflow: hidden;
		background-image: url("~@/assets/img/bg2.jpg");
		background-repeat: no-repeat;
		background-size: cover;
	}

	.head {
		width: 15%;
		height: 50px;
		overflow: hidden;
		border-bottom: 1px solid #000000;
		background-color: #FAFAD2;
		position: absolute;
	}

	.head-text {
		position: sticky;
	}

	.input {
		position: absolute;
		width: 65%;
		height: auto;
		min-height: 50px;
		bottom: 0;
		background-color: pink;
		overflow: hidden;
		padding: 1%;
		z-index: 20;
	}
	

	/* .message-body {
		padding-top: 20%;
	} */
</style>
