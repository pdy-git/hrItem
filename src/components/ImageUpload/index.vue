<template>
  <div>
    <el-upload
      v-loading="loading"
      action="#"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      list-type="picture-card"
      :on-change="change"
      :file-list="fileList"
      :http-request=" oRequest"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="limit"
      :before-upload="beforeUpload"
      :class="`${fileList.length === limit ? 'hideCard' : ''}`"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
    >
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDBBxUWMyKTO5XjgPuAYgaGhsoVyCTXNyK',
  SecretKey: 'C9rKXVEoBLIVTCh3B4gNq30iBlCPO9et'
})
console.log(cos)

export default {
  name: 'ImageUpload',
  props: {
    limit: {
      type: Number,
      default: 1
    }
    // 'beforeUploadCheck': Function
  },
  data() {
    return {
      loading: false,
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewImgDialogVisible: false, // 控制显示弹层
      imgUrl: '' // 图片地址
    }
  },
  methods: {
    change(file, fileList) {
      this.fileList = fileList
    },
    // action 放接口id
    oRequest(data) {
      this.loading = true

      cos.putObject({
        Bucket: 'pdy-harss-32-1313544769', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        console.log('123456', err, data)
        this.loading = false
        if (err || data.statusCode !== 200) {
          return this.$message.error('图片上传有误， 请重新尝试')
        }
        this.$emit('onSuccess', {
          url: 'https://' + data.Location
        })
      })
    },
    onRemove(fileList) {
      // file 当前被删除的文件
      // 剩余的文件列表
      this.fileList = fileList
    },
    onPreview(file) {
      // 图片预览
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      // if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
      //   return false
      // }
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error(`请选择以下${types.join(',')}图片格式`)
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    }
  }
}
</script>

<style lang='scss'>
.hideCard{
  .el-upload--picture-card{
    display: none;
  }
}

</style>
