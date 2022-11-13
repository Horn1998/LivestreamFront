<template>
        <!--修改用户的对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="closeDialog" width="30%">
      <!--内容主体区域-->
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="sex">
          <el-input v-model="editForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import {userUpdate} from "@/api/index.js";

export default {
    props:["open", "row"],
    data(){
        return {
            editDialogVisible: this.open, // 控制修改用户信息对话框是否显示
            editForm: {
                id: "",
                loginName: "",
                userName: "",
                password: "",
                sex: "",
                email: "",
                address: "",
            },
        }
    },
    watch:{
        open(val){
            this.editDialogVisible = val;
        },
        row(val){
            this.editForm.id = val.id;
            this.editForm.loginName = val.loginName;
            this.editForm.sex = val.sex;
            this.editForm.userName = val.userName;
            this.editForm.email = val.email;
            this.editForm.address = val.address;
        }
    },
    methods:{
        //修改用户
        editUser() {
            userUpdate(this.editForm)
                .then((res) => {
                if (res.code === 200) {
                    this.editDialogVisible = false;
                     this.editForm = {
                        id: "",
                        loginName: "",
                        userName: "",
                        password: "",
                        sex: "",
                        email: "",
                        address: "",
                    }
                    this.$message({
                    message: "修改用户成功",
                    type: "success",
                    });
                    
                } else {
                    this.$message.error("修改用户失败");
                }
                })
                .catch((err) => {
                this.$message.error("修改用户异常");
                // console.loge(err);
                });
        },
        closeDialog(){
            // 表单内容重置为空
            this.userForm = {
                id: "",
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
