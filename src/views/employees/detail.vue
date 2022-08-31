<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form ref="infoForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input v-model="userInfo.password2" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <!-- 放置个人详情 -->
          <component :is="userComponent" ref="userInfoRef" />
          <!-- <user-info /> -->
        </el-tab-pane>

        <el-tab-pane label="岗位详情">
          <!-- 放置岗位详情 -->
          <component :is="JobInfo" />

        </el-tab-pane>
      </el-tabs></el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info.vue'
import jobInfo from './components/job-info.vue'
export default {

  data() {
    return {
      userComponent: userInfo,
      JobInfo: jobInfo,
      userInfo: {
        //   专门存放基本信息
        username: '',
        password: '',
        password2: ''

      },
      components: {
        userInfo,
        jobInfo
      },
      rules: {
        username: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        password2: [{ required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
      this.$refs.userInfoRef.userInfo = { ...this.userInfo }
      this.$refs.userInfoRef.setImageUrl(this.userInfo.staffPhoto)
    },
    async updateInfo() {
      try {
        await this.$refs.infoForm.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style>

</style>
