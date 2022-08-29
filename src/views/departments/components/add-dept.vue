<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible.sync="dialogVisible" :before-close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submitDept">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // console.log(depts)
      // console.log(value)
      let isRepeat = false
      if (this.formData.id) {
        const list = depts.filter(ele => ele.id !== this.treeNode.id)
        isRepeat = list.some(ele => ele.code === value)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }
      // console.log(isRepeat)
      isRepeat ? callback(new Error(`部门编码${value}已经存在`)) : callback()
    }

    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // console.log(depts)
      // console.log(this.treeNode.id)
      let isRepeat = false
      if (this.formData.id) {
        const list = depts.filter(ele => this.treeNode.id !== ele.id && this.treeNode.pid === ele.pid)
        isRepeat = list.some(ele => ele.name === value)
      } else {
        const list = depts.filter(ele => this.treeNode.id === ele.pid)
        // console.log(list)
        isRepeat = list.some(ele => ele.name === value)
      }

      isRepeat ? callback(new Error(`部门名称在同级部门${value}已经存在`)) : callback()
    }

    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      peoples: [],
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      // 重置表单
      this.$refs.deptForm.resetFields()
      // 复原初始化数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    submitDept() {
      this.$refs.deptForm.validate(async vali => {
        console.log(vali)
        if (vali) {
        // 表单验证通过
        // 新增部门接口
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          this.$message.success('部门新增成功')
          this.$emit('refreshDepts')
          this.handleClose()
        }
      })
    }
  }
}
</script>1

<style>

</style>
