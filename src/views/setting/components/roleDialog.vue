<template>
  <el-dialog :title="`${roleForm.id ? '修改' : '新增'}角色`" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true,message:'角色必填', trigger: 'blur'}]"
      >
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
// 完善新增角色的组件的功能
// dialogVisible字段是通过 父组件传递进来
// 如何实现这个dialogVisible 在组件上的双向绑定呢

// 表单数据的绑定和验证
// 角色必填
import { addRole, updateRole } from '@/api/setting'
export default {
  name: 'Hrsaas1RoleDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      roleForm: {
        name: '',
        description: ''

      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      // console.log(111)
      // this.dialogVisible = false
      this.$emit('update:dialogVisible', false)
      // resetFields 重置整个表单
      this.$refs.roleDialogForm.resetFields()

      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submitRole() {
      try {
        this.loading = true
        this.roleForm.id ? await updateRole(this.roleForm)
          : await this.$refs.roleDialogForm.validate()
        // 新增接口
        await addRole(this.roleForm)
        // 调用父组件获取角色列表的方法
        this.$parent.getRoleList()
        // 提示新增成功
        this.$message.success(`角色${this.roleForm.id ? '修改' : '新增'}成功`)
        // 弹窗关闭
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
  // 实现角色新增
  // 新增角色接口写好，引入
  // 点击确定按钮 调用新增接口
  // 新增成功提示数据，刷新角色列表
}
</script>
