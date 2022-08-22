<template>
  <!-- tabs标签页 切换栏 -->
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="first">

        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="add"
          >
            新增角色
          </el-button>
        </el-row>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          border
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            prop="address"
            label="操作"
            width="320"
          >
            <template slot-scope="scope">
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            background
            :current-page.sync="page.page"
            :page-size.sync="page.pagesize"
            :page-sizes="[5,10, 20, 30, 40 , 300 , 350]"
            layout="total,prev, pager, next, sizes"
            :total="total"
            @current-change="changePage"
            @size-change="changeSize"
          />
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
          :closable="false"
        />

        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input v-model="formData.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <roleDialog ref="roleDialog" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Hrsaas1Index',
  components: {
    roleDialog
  },

  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: ''
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },

  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        // console.log(res)
        this.list = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    changePage(val) {
      this.getRoleList()
    },
    changeSize() {
      this.getRoleList()
    },
    add() {
      this.dialogVisible = true
    },
    edit(row) {
      console.log('row', row)
      this.dialogVisible = true
      this.$refs.roleDialog.roleForm = { ...row }
    },
    async del(id) {
      // this.$confirm('是否确认删除该角色？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })

      try {
        await this.$confirm('是否确认删除该角色？', '提示', { type: 'warning' })
        console.log('111')
        await deleteRole(id)
        this.$message.success('角色删除成功')
        this.page.page = 1
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
