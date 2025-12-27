<template>
  <div class="store-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="门店名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入门店名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增门店</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="storeName" label="门店名称"></el-table-column>
        <el-table-column prop="storeType" label="菜系类型"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="avgPrice" label="人均消费"></el-table-column>
        <el-table-column prop="rating" label="评分"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '营业中' : '已停业' }}
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

    <!-- 新增/编辑门店对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form :model="storeForm" :rules="formRules" ref="storeFormRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="storeForm.storeName" placeholder="请输入门店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜系类型" prop="storeType">
              <el-select v-model="storeForm.storeType" placeholder="请选择菜系类型" style="width: 100%">
                <el-option label="川菜" value="Sichuan"></el-option>
                <el-option label="粤菜" value="Cantonese"></el-option>
                <el-option label="湘菜" value="Hunan"></el-option>
                <el-option label="鲁菜" value="Shandong"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="storeForm.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人均消费" prop="avgPrice">
              <el-input-number v-model="storeForm.avgPrice" :min="0" :precision="0" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="storeForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="storeForm.status">
            <el-radio :value="1">营业中</el-radio>
            <el-radio :value="0">已停业</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
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
const dialogTitle = ref('新增门店')
const submitLoading = ref(false)
const storeFormRef = ref(null)

const storeForm = reactive({
  storeName: '', storeType: '', phone: '', address: '', avgPrice: 0, status: 1
})

const formRules = {
  storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
  storeType: [{ required: true, message: '请选择菜系类型', trigger: 'change' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const loadData = () => {
  request.get('/store/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, keyword: searchForm.keyword }
  }).then(data => {
    tableData.value = data.records
    pagination.total = data.total
  })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { searchForm.keyword = ''; pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleAdd = () => {
  dialogTitle.value = '新增门店'
  Object.assign(storeForm, { id: null, storeName: '', storeType: '', phone: '', address: '', avgPrice: 0, status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑门店'
  Object.assign(storeForm, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该门店吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/store/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

const handleSubmit = () => {
  storeFormRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      const method = storeForm.id ? 'put' : 'post'
      request[method]('/store', storeForm).then(() => {
        ElMessage.success(storeForm.id ? '修改成功' : '新增成功')
        dialogVisible.value = false
        loadData()
      }).finally(() => { submitLoading.value = false })
    }
  })
}

const handleDialogClose = () => { storeFormRef.value?.resetFields() }

onMounted(() => { loadData() })
</script>

<style scoped>
.store-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
</style>
