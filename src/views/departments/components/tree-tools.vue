<template>
  <el-row type="flex" justify="space-between" align="middle" style="width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end" align="middle">
        <el-col>
          {{ treeNode.manager }}
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'Hrsaas1TreeTools',
  props: {
    treeNode: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      console.log('handleCommand', type)
      if (type === 'add') {
        // 传递当前节点
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 编辑部门
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除功能
        this.$confirm('确认删除部门吗', '提示', { type: 'warning' })
          .then(res => {
            // await delDepartments(this.treeNode.id)
            // this.$emit('refreshDepts')
            // this.$message.success('删除成功')

            return delDepartments(this.treeNode.id)
          }).then(res => {
            this.$emit('refreshDepts')
            this.$message.success('删除成功')
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
