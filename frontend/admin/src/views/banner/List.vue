<template>
  <div class="banner-list">
    <el-card>
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-button type="success" @click="handleAdd">新增广告</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="广告标题"></el-table-column>
        <el-table-column label="广告图片" width="150">
          <template #default="scope">
            <el-image :src="scope.row.imageUrl" style="width: 100px; height: 50px" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="linkUrl" label="跳转链接"></el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column label="位置" width="100">
          <template #default="scope">
            <el-tag>{{ getPositionLabel(scope.row.position) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="formData.id ? '编辑广告' : '新增广告'" v-model="dialogVisible" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入广告标题"></el-input>
        </el-form-item>
        <el-form-item label="广告图片" prop="imageUrl">
          <el-input v-model="formData.imageUrl" placeholder="请输入图片URL"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="formData.linkUrl" placeholder="请输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="展示位置" prop="position">
          <el-select v-model="formData.position" placeholder="请选择位置">
            <el-option label="首页轮播" value="HOME_BANNER"></el-option>
            <el-option label="首页活动区" value="HOME_ACTIVITY"></el-option>
            <el-option label="弹窗广告" value="POPUP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

const formData = reactive({ id: '', title: '', imageUrl: '', linkUrl: '', position: 'HOME_BANNER', sort: 0, status: 1 })
const formRules = {
  title: [{ required: true, message: '请输入广告标题', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入图片URL', trigger: 'blur' }],
  position: [{ required: true, message: '请选择位置', trigger: 'change' }]
}

const positionMap = { 'HOME_BANNER': '首页轮播', 'HOME_ACTIVITY': '首页活动区', 'POPUP': '弹窗广告' }
const getPositionLabel = (pos) => positionMap[pos] || pos

const loadData = () => {
  request.get('/banner/list').then(data => {
    tableData.value = data || []
  }).catch(() => { tableData.value = [] })
}

const handleAdd = () => {
  Object.assign(formData, { id: '', title: '', imageUrl: '', linkUrl: '', position: 'HOME_BANNER', sort: 0, status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(formData, { ...row }); dialogVisible.value = true }

const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const method = formData.id ? 'put' : 'post'
      request[method]('/banner', formData).then(() => {
        ElMessage.success(formData.id ? '修改成功' : '新增成功')
        dialogVisible.value = false
        loadData()
      })
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该广告吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/banner/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.banner-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
</style>
