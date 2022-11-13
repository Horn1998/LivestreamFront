<template>
   <div>
    <add-dialog :open="addDialogVisible" v-on:status="closeDialog"></add-dialog>
    <update-dialog :open="updateDialogVisible" :row="row" v-on:status="closeDialog"></update-dialog>
    <el-row class="mb-4">
        <!--搜索区域-->
        <el-input
            placeholder="请输入内容"
            v-model="queryInfo.keyword"
            style="width:500px; margin-right:30px"
            clearable
            @clear="getUserList"
        >
            <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
            ></el-button>
        </el-input>
        <el-button type="primary" @click="openAddUser()">添加用户</el-button>
        <el-button type="primary" @click="batchDeleteUser()">批量删除</el-button>
    </el-row>
    <!--表格-->
    <el-table
        :data="userList"
        border
        style="margin-top:30px"
        stripe
        @selection-change="handleSelectionChange"
    >   
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="loginName" label="登录名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作">
             <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                style="width:40%"
                @click="showEditDialog(scope.row)"
              ></el-button>
               <!--删除按钮-->
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                style="width:40%"
                @click="removeUserById(scope.row)"
              ></el-button>
            </template>
        </el-table-column>
              <!--分页区域-->
   
    </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:30px"
      >
      </el-pagination>
    </div>
</template>
<script>
import {userList, userDelete, userBatchDelete} from "@/api/index.js";
import {AddDialog, UpdateDialog} from "./components/";
export default {
    data() {
        return {
            userList: [], // 用户列表
            total: 0, // 用户总数
            row:0,    //修改操作使用
            // 获取用户列表的参数对象
            queryInfo: {
                keyword: "", // 查询参数
                pageNo: 1, // 当前页码
                pageSize: 5, // 每页显示条数
            },
            addDialogVisible: false, // 控制添加用户对话框是否显示
            updateDialogVisible: false,
            multipleSelection: [],
            ids: []
        }
    },
    components:{AddDialog, UpdateDialog},
    created(){ // 生命周期函数
        this.getUserList();
    },
    methods: {
        openAddUser(){
            this.addDialogVisible = true;
        },
        getUserList() {
            userList(this.queryInfo)
                .then((res) => {
                if (res.code === 200) {
                    //用户列表
                    this.userList = res.data.records;
                    this.total = res.data.total;
                } else {
                    this.$message.error(res.data.message);
                }
                })
                .catch((err) => {
                    // console.log(err);
                });
        },
         // 监听 pageSize 改变的事件
        handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pageSize = newSize;
        // 重新发起请求用户列表
        this.getUserList();
        },
        // 监听 当前页码值 改变的事件
        handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pageNo = newPage;
        // 重新发起请求用户列表
        this.getUserList();
        },
        closeDialog(e){
            this.getUserList();
            this.addDialogVisible=e;
            this.updateDialogVisible=e;
        },
        showEditDialog(row){
            this.row = row;
            this.updateDialogVisible = true;
        },
            // 根据ID删除对应的用户信息
        async removeUserById(row) {
            // 弹框 询问用户是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除该用户, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }
            ).catch((err) => err);
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if (confirmResult == "confirm") {
                //删除用户
                userDelete(row)
                .then((res) => {
                    if (res.code === 200) {
                    this.getUserList();
                    this.$message({
                        message: "删除用户成功",
                        type: "success",
                    });
                    } else {
                    this.$message.error("删除用户失败");
                    }
                })
                .catch((err) => {
                    this.$message.error("删除用户异常");
                    // console.loge(err);
                });
            }
        },
        handleSelectionChange(val) {
             this.multipleSelection = val;
             this.ids = []
            //向被删除的ids赋值
            this.multipleSelection.forEach((item) => {
                this.ids.push(item.id);
                
            });
        },
        //批量删除用户
        async batchDeleteUser(){
            // 弹框 询问用户是否删除
            const confirmResult = await this.$confirm(
                "此操作将永久删除用户, 是否继续?",
                "提示",
                {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }
            ).catch((err) => err);
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            if (confirmResult == "confirm") {
                //批量删除用户
                userBatchDelete(this.ids)
                .then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: "批量删除用户成功",
                            type: "success",
                        });
                        this.getUserList();
                    } else {
                    this.$message.error("批量删除用户失败");
                    }
                })
                .catch((err) => {
                    this.$message.error("批量删除用户异常");
                    // console.log(err);
                });
            }
        },
    },
}
</script>
