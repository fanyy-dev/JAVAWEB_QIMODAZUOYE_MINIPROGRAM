<template>
  <div class="dish-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="菜品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入菜品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属门店">
          <el-select v-model="searchForm.storeId" placeholder="请选择门店" clearable>
            <el-option v-for="store in storeList" :key="store.id" :label="store.storeName" :value="store.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增菜品</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="dishName" label="菜品名称"></el-table-column>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column prop="categoryName" label="分类"></el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">¥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handleToggleStatus(scope.row)">{{ scope.row.status === 1 ? '下架' : '上架' }}</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
      ></el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog :title="formData.id ? '编辑菜品' : '新增菜品'" v-model="dialogVisible" width="600px">
      <el-form :model="formData" label-width="100px" ref="formRef">
        <el-form-item label="菜品名称" prop="dishName">
          <el-input v-model="formData.dishName" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="所属门店" prop="storeId">
          <el-select v-model="formData.storeId" placeholder="请选择门店">
            <el-option v-for="store in storeList" :key="store.id" :label="store.storeName" :value="store.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input v-model.number="formData.price" placeholder="请输入价格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="菜品描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入描述" type="textarea" rows="3"></el-input>
        </el-form-item>
        <el-form-item label="上架状态">
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

const searchForm = reactive({ keyword: '', storeId: '', categoryId: '' })
const tableData = ref([])
const storeList = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const dialogVisible = ref(false)
const formRef = ref(null)

const formData = reactive({
  id: '', dishName: '', storeId: '', categoryId: '', price: '', description: '', status: 1
})

const loadStores = () => {
  request.get('/store/list', { params: { pageSize: 999 } }).then(data => { storeList.value = data.records || [] })
}

const loadData = () => {
  request.get('/dish/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, keyword: searchForm.keyword, storeId: searchForm.storeId }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { Object.assign(searchForm, { keyword: '', storeId: '', categoryId: '' }); pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleAdd = () => {
  Object.assign(formData, { id: '', dishName: '', storeId: '', categoryId: '', price: '', description: '', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(formData, { ...row }); dialogVisible.value = true }

const handleSave = () => {
  if (!formData.dishName) { ElMessage.error('菜品名称不能为空'); return }
  const url = formData.id ? `/dish/${formData.id}` : '/dish'
  const method = formData.id ? 'put' : 'post'
  request[method](url, formData).then(() => {
    ElMessage.success(formData.id ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  })
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  request.patch(`/dish/${row.id}/status`, { status: newStatus }).then(() => {
    ElMessage.success('状态更新成功')
    loadData()
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该菜品吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/dish/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadStores(); loadData() })
</script>

<style scoped>
.dish-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
</style>
