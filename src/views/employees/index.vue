<template>
  <div class="app-container">
    <PageTools :show-before="true">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="图像">
          <template slot-scope="{row}">
            <img
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px;"
              alt=""
              @click="showErCodeDialog(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
          :formatter="formatterFn"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState" />
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          v-if="total>0"
          background
          layout="total ,prev, pager, next , sizes"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,20,30]"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <AddDemployee
      :visible-dialog.sync="visibleDialog"
      @refresh="getEmployeeList"
    />
    <!-- 二维码 -->
    <el-dialog
      title="二维码"
      :visible.sync="ercodeDialog"
      custom-class="canvaseq"
    >
      <canvas id="canvas" />
    </el-dialog>
    <!-- 放置分配组件 -->
    <assignRole ref="AssignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import AddDemployee from './components/add-employee.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/directives/filters'
import QrCode from 'qrcode'
import assignRole from './components/assign-role.vue'
export default {

  name: 'Hrsaas1Index',
  components: {
    AddDemployee,
    assignRole
  },

  data() {
    return {

      page: {
        page: 1, // 当前页码
        size: 10
      },
      loading: false,
      list: [],
      total: 0, // 总数
      visibleDialog: false,
      ercodeDialog: false,
      showRoleDialog: false, // 弹出层
      userId: null
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        if (total !== 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    formatterFn(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(ele => ele.id === cellValue * 1)
      return obj ? obj.value : '非正式'
    },
    add() {
      this.visibleDialog = true
    },
    async del(id) {
      try {
        await this.$confirm('确定删除吗', '提示', {
          type: 'warning'
        })
        await delEmployee(id)
        this.getEmployeeList()
        console.log('删除成功')
      } catch (e) {
        console.log(e)
      }
    },
    async exportData() {
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)

      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      Object.keys(headers)
      Object.values(headers)

      // console.log(this.fromJsom(headers, rows))
      const data = this.fromJsom(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader: [['姓名', '主要信息', '', '', '', '', '']],
          merges: ['A1:A2', 'B1:G1']

        })
      })
    },
    fromJsom(headers, rows) {
      return rows.map(ele => {
        return Object.values(headers).map(
          key => {
            if (key === 'timeOfEntry' || key === 'correctionTime') {
              return formatDate(ele[key])
            } else if (key === 'formOfEmployment') {
              const obj = EmployeeEnum.hireType.find(ele1 => ele1.id === +ele[key])
              return obj ? obj.value : '非正式'
            }
            return ele[key]
          }
        )
      })
    },
    async showErCodeDialog(staffPhoto) {
      console.log(111)
      console.log(staffPhoto)
      // url存在的情况下 才弹出层
      if (!staffPhoto) return this.$message.error('为设计图像')
      this.ercodeDialog = true
      await this.$nextTick()
      const dom = document.querySelector('#canvas')
      QrCode.toCanvas(dom, staffPhoto)
    },
    editRole(id) {
      this.userId = id
      this.showRoleDialog = true
      this.$refs.AssignRole.getUserDetailById(id)
    }

  }
}
</script>

<style lang="scss">
.canvaseq .el-dialog__body {
  text-align: center;
}
</style>

