<template>
        <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="status"
      width="30%"
      @close="closeDialog"
    >
      <!--内容主体区域-->
      <el-form :model="userForm" label-width="70px">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="userForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="userForm.sex" label="男">男</el-radio>
          <el-radio v-model="userForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import {userAdd} from "@/api/index"
import {Encrypt} from '@/utils/Secret.js'
export default {
    name: "AddDialog",
    props:["open"],
    data(){
      return {
        userForm: {
                //用户
                loginName: "",
                userName: "",
                password: "",
                sex: "",
                email: "",
                address: "",
        },
        status: this.open,
      }
    },
    watch:{
      open(val){
        this.status = val;
      }
    },
    methods:{
        //   // 监听 添加用户对话框的关闭事件
        // addDialogClosed() {
        //     // 表单内容重置为空
        //     this.$refs.addFormRef.resetFields();
        // },
         //添加用户
        addUser() {
            this.userForm.password = Encrypt(this.userForm.password);
            userAdd(this.userForm)
                .then((res) => {
                if (res.code === 200) {
                    this.addDialogVisible = false;
                    this.userForm= {
                            //用户
                            loginName: "",
                            userName: "",
                            password: "",
                            sex: "",
                            email: "",
                            address: "",
                    },
                    this.$message({
                    message: "添加用户成功",
                    type: "success",
                    });
                } else {
                    this.$message.error("添加用户失败");
                }
                })
                .catch((err) => {
                this.$message.error("添加用户异常");
                // console.log(err);
                });
        },
        closeDialog(){
          // 表单内容重置为空
          this.userForm =  {
                //用户
                loginName: "",
                userName: "",
                password: "",
                sex: "",
                email: "",
                address: "",
          },
          this.$emit("status", false);
        }
    }
}
</script>
