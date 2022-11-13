import http from './public'
import request from '@/utils/request.js'

/**************************登陆注册************************* */
// 注册账号
export function register (params) {
    return http.fetchPost('/register', params)
}
//登陆
export function userLogin(params) {
    return http.fetchPost('/login', params)
}
// 退出登陆
export function loginOut(params) {
    return http.fetchGet('/loginOut', params)
}

/**************************用户操作************************* */
//获取用户列表
export function userList(params) {
    return http.fetchPost('/user/list', params)
}
//添加用户
export function userAdd(params){
    return http.fetchPost('/user/add', params)
}
//修改用户
export function userUpdate(params){
    return http.fetchPost('/user/update', params);
}
//删除用户
export function userDelete(params){
    return http.fetchPost('/user/delete', params);
}
//从后端获取加密信息
export function userEncrypt(params){
    return http.fetchPost('/user/getKey', params);
}
//获取缓存视频列表
export function videoList(data){
    return http.fetchGet('/filelist', data);
}
//开启摄像头
export function videoOpen(data){
    return http.fetchGet('/openVideo', data);
}
//删除文件
export function deleteVideo(data){
    return http.fetchPost('/deleteVideo', data);
}
// //请求直播流
// export function findVideo(data){
//     return http.fetchGet('/findVideo', data);
// }
//批量删除用户
export function userBatchDelete(data) {
    return request({
        url: '/user/deleteBatch',
        method: 'post',
        data
    })
}

/*************用户聊天*********************** */
//创建房间
export function createRoom(data){
    return http.fetchPost('/message/create', data);
}
//进入房间
export function insertRoom(data){
    return http.fetchPost('/message/insert', data);
}
//获取所有房间
export function getRooms(data){
    return http.fetchGet('/message/findAll', data);
}
//删除房间
export function deleteRoomAPI(data){
    return http.fetchPost('/message/deleteRoom', data);
}
//用户签到
export function doSign(data){
    return http.fetchPost('/message/doSign', data);
}
//确定用户是否为签到发起者
export function pubSign(data){
    return http.fetchPost('/message/pubSign', data);
}
//确定当前用户身份
export function getRole(data){
    return http.fetchPost('/message/getRole', data);
}
//停止本次签到
export function stopSign(data){
    return http.fetchPost('/message/stopSign', data);
}