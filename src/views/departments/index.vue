<template>
  <div class="departments-container">
    <el-card>
      <!-- <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <span>江苏传智播客教育科技股份有限公司</span>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="end" align="middle">
            <el-col>
              负责人
            </el-col>
            <el-col>
              <el-dropdown>
                <span>
                  操作<i class="el-icon-arrow-down" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row> -->
      <tree-tools :tree-node="company" :is-root="false" @addDept="addDept" />
    </el-card>

    <el-tree
      :data="departs"
      :default-expand-all="true"
      :props="defaultProps"
    >
      <tree-tools
        slot-scope="{data}"
        :tree-node="data"
        @addDept="addDept"
        @editDept="editDept"
        @refreshDepts="getDepartments"
      />
    </el-tree>
    <add-dept
      ref="addDept"
      :dialog-visible.sync="dialogVisible"
      :tree-node="currentNode"
      @refreshDepts="getDepartments"
    />

  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import addDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Hrsaas1Index',
  components: {
    treeTools,
    addDept
  },

  data() {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name'
      },
      dialogVisible: false,
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' }

    }
  },

  mounted() {

  },
  created() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
    },
    addDept(node) {
      this.currentNode = node // 保存当前节点
      this.dialogVisible = true // 弹窗显示出来
    },
    editDept(node) {
      this.currentNode = node
      this.dialogVisible = true
      console.log(node)
      console.log(this.$refs.addDept)
      this.$refs.addDept.formData = { ...node }
    }
  }
}

</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree-node__content{
  padding-right: 20px;
}
}

</style>
