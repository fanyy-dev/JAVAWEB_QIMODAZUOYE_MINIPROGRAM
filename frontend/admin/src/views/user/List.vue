<template>
  <div class="user-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="searchForm.userType" placeholder="请选择用户类型" clearable>
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="普通用户" value="USER"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
        <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="180"></el-table-column>
        <el-table-column label="用户类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.userType === 'ADMIN' ? 'danger' : 'info'">
              {{ scope.row.userType === 'ADMIN' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handleToggleStatus(scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
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
    <el-dialog :title="formData.id ? '编辑用户' : '新增用户'" v-model="dialogVisible" width="600px">
      <el-form :model="formData" label-width="100px" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="!!formData.id"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!formData.id">
          <el-input v-model="formData.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="formData.userType" placeholder="请选择用户类型">
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="普通用户" value="USER"></el-option>
          </el-select>
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

const searchForm = reactive({ username: '', userType: '' })
const tableData = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const dialogVisible = ref(false)
const formRef = ref(null)

const formData = reactive({
  id: '', username: '', password: '', nickname: '', phone: '', email: '', userType: 'USER', status: 1
})

const loadData = () => {
  request.get('/user/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, username: searchForm.username, userType: searchForm.userType }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { Object.assign(searchForm, { username: '', userType: '' }); pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleAdd = () => {
  Object.assign(formData, { id: '', username: '', password: '', nickname: '', phone: '', email: '', userType: 'USER', status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => { Object.assign(formData, { ...row }); dialogVisible.value = true }

const handleSave = () => {
  if (!formData.username) { ElMessage.error('用户名不能为空'); return }
  const url = formData.id ? `/user/${formData.id}` : '/user'
  const method = formData.id ? 'put' : 'post'
  request[method](url, formData).then(() => {
    ElMessage.success(formData.id ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    loadData()
  })
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  request.patch(`/user/${row.id}/status`, { status: newStatus }).then(() => {
    ElMessage.success('状态更新成功')
    loadData()
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/user/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.user-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
</style>
