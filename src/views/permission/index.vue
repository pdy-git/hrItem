<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools :show-before="false">
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0' , 1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="perList" :loading="loading" row-key="id" :default-expand-all="true">
        <el-table-column label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="left" label="操作">
          <template slot-scope="{row}">
            <el-button
              v-if="row.type*1 === 1"
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="addPermission(row.id , 2)"
            >添加</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" style="color:#f56c6c" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <addPermisssion ref="AddPermission" :dialog-visible.sync="dialogVisible" />
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils/index'
import addPermisssion from './components/add-permission.vue'
export default {
  name: 'Hrsaas1Index',
  components: {
    addPermisssion
  },

  data() {
    return {
      perList: [],
      loading: false,
      dialogVisible: false
    }
  },

  mounted() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      try {
        this.loading = true
        const res = await getPermissionList()
        this.perList = tranListToTreeData(res, '0')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async del(id) {
      try {
        await this.$confirm('确定删除嘛?', '提示', {
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (e) {
        console.log(e)
      }
    },
    addPermission(id, type) {
      this.$refs.AddPermission.formData.pid = id
      this.$refs.AddPermission.formData.type = type
      this.dialogVisible = true
    },
    edit(row) {
      this.$refs.AddPermission.formData = { ...row }
      this.dialogVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
