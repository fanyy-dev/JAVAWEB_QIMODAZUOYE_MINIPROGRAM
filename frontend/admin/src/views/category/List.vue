<template>
  <div class="category-list">
    <el-card>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="分类名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增分类</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="categoryName" label="分类名称"></el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="100"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
      ></el-pagination>
    </el-card>

    <el-dialog :title="formData.id ? '编辑分类' : '新增分类'" v-model="dialogVisible" width="500px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="formData.categoryName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="999"></el-input-number>
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

const searchForm = reactive({ keyword: '' })
const tableData = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const dialogVisible = ref(false)
const formRef = ref(null)

const formData = reactive({ id: '', categoryName: '', sortOrder: 0, status: 1 })
const formRules = { categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }] }

const loadData = () => {
  request.get('/dish-category/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, keyword: searchForm.keyword }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total || 0
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { searchForm.keyword = ''; pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleAdd = () => {
  Object.assign(formData, { id: '', categoryName: '', sortOrder: 0, status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(formData, { ...row }); dialogVisible.value = true }

const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const method = formData.id ? 'put' : 'post'
      request[method]('/dish-category', formData).then(() => {
        ElMessage.success(formData.id ? '修改成功' : '新增成功')
        dialogVisible.value = false
        loadData()
      })
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该分类吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/dish-category/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.category-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
</style>
