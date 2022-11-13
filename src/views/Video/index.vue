    <template>
    <div id="app">
      <div class="app-main">
        <div class="video-wrap">
          <div class="video-inner">
            <video id="video" autoplay controls muted preload="none"></video>
          </div>
        </div>

        <div class="setting-wrap">
          <div class="title">实时直播功能测试</div>
          <div class="form-item">
            <span>flv.js选项：</span>
            <label><input type="checkbox" v-model="flvSettings.withCredentials" />withCredentials</label>
            <label><input type="checkbox" v-model="flvSettings.hasAudio" />hasAudio</label>
          </div>
          <div class="form-item">
            <span>Extend功能：</span>
            <label><input type="checkbox" v-model="extendSettings.frameTracking" />追帧</label>
            <label><input type="checkbox" v-model="extendSettings.reconnect" />断流重连</label>
            <label><input type="checkbox" v-model="extendSettings.updateOnStart"/>点击播放后实时更新</label>
            <label><input type="checkbox" v-model="extendSettings.updateOnFocus"/>回到前台后实时更新</label>
          </div>
          <div class="form-item">
            <span>流地址：</span>
            <input class="stream-url" v-model="url" placeholder="请输入直播流地址" />
          </div>

          <div class="action-list" >
            <button class="btn btn-load" @click="loadFlv">加载视频</button>
            <button class="btn btn-load" @click="openVideo">开启直播</button>
      
          </div>
            <el-select v-model="targetVideo" clearable placeholder="请选择需要观看的直播" style="margin-top:30px; margin-bottom:30px" @change="searchVideo">
                  <el-option v-for="item in options" :label="item.label" :value="item.label" :key="item.label"></el-option>
                </el-select>
            <div class="video-stats">
            <p>播放统计信息：</p>
            <div class="video-stats-info">
              <pre>{{stats}}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
@import '../../assets/style/demo.css';
</style>

<script>
import "@/utils/flvExtend.js";
import {userEncrypt, videoOpen} from "@/api/index"
import {getStore} from '@/utils/storage.js'

export default{
    data(){
        return {
            url: 'http://10.128.206.152:8088/live?port=1935&app=myapp&stream=mystream',
            flvSettings: {
            withCredentials: false,
            hasAudio: true,
            },
            extendSettings: {
            frameTracking: true,
            updateOnStart: true,
            updateOnFocus: true,
            reconnect: true,
            },
            stats: '',  //直播统计信息
            key: '',    //直播鉴权需要
            stream: 'mystream', //直播流信息
            targetVideo: '',
            options: [{
              value: '选项1',
              label: 'mystream'
            }, {
              value: '选项2',
              label: 'test'
            }, {
              value: '选项3',
              label: '123'
            }, {
              value: '选项4',
              label: 'horn'
            }, {
              value: '选项5',
              label: '直播'
            }]
        }
    },
    mounted() {
        this.getOptions()
        this.loadFlv()
    },

    methods: {
        async loadFlv() {
            if (!this.url) return
            //获取登录用户所有信息
            let user = JSON.parse(getStore('userId'));
            var params = {
              loginName:user.loginName,
              userName:user.userName,
              password:user.password,
              sex:user.sex,
              email:user.email,
              address:user.address
            }
            //从后端获取加密密钥
            await userEncrypt(params).then(res=>{
                if(res.code === 200){
                    this.key = res.data;
                    //this.url = 'http://101.34.3.60:8080/live?port=1935&app=myapp&stream=mystream&key='+this.key;
                    this.url = 'http://10.128.206.152:8088/live?port=1935&app=myapp&stream='+this.stream+'&key='+this.key;
                    // console.log(this.url);
                }else{
                  console.log('加密失败'); return;
                }
            })
            this.saveOptions()

            if (this.flv) {
                this.flv.destroy()
            }

            var video = document.getElementById('video')

            this.flv = new FlvExtend({
                element: video,
                frameTracking: this.extendSettings.frameTracking, // 追帧设置
                frameTrackingDelta: 2, // 延迟容忍度，即缓冲区末尾时间与当前播放时间的差值，大于该值会触发追帧
                updateOnStart: this.extendSettings.updateOnStart, // 点击播放按钮后实时更新视频
                updateOnFocus: this.extendSettings.updateOnFocus, // 回到前台后实时更新
                reconnect: this.extendSettings.reconnect, // 断流后重连
                reconnectInterval: 5000 // 重连间隔(ms)
            })

            this.player = this.flv.init(
                {
                    type: 'flv',
                    url: this.url,
                    isLive: true,
                    hasAudio: this.flvSettings.hasAudio,
                    withCredentials: this.flvSettings.withCredentials,
                    
                },
                {
                    enableStashBuffer: false, // 是否启用IO隐藏缓冲区。如果您需要实时（最小延迟）来进行实时流播放，则设置为false
                    lazyLoadMaxDuration: 3 * 60
                }
            )

            this.player.play()

            this.player.onstats = (e) => {
                this.stats = JSON.stringify(e, null, 2)
            }
        },

        async getOptions() {
            var flvSettings = localStorage.getItem('flvExtendDemo_flv')
            var extendSettings = localStorage.getItem('flvExtendDemo_extend')
            var url = localStorage.getItem('flvExtendDemo_url')

            if (flvSettings) {
                this.flvSettings = JSON.parse(flvSettings)
            }
            if (extendSettings) {
                this.extendSettings = JSON.parse(extendSettings)
            }
            if (url) {
                this.url = url
            }
        },

        saveOptions() {
            localStorage.setItem('flvExtendDemo_flv', JSON.stringify(this.flvSettings))
            localStorage.setItem('flvExtendDemo_extend', JSON.stringify(this.extendSettings))
            localStorage.setItem('flvExtendDemo_url', this.url)
        },

        openVideo(){
           videoOpen("").then(res=>{
                if(res.code === 200){
                   console.log("摄像头开启成功");
           
                }else{
                  console.log('摄像头开启失败');
                }
            })
        },

        searchVideo(stream){
          this.stream = stream;
          // console.log(this.stream);
          this.loadFlv();
        }
    }
}
    
</script>
