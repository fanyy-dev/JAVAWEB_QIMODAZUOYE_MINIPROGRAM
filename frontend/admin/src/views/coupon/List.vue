<template>
  <div class="coupon-list">
    <el-card>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.couponType" placeholder="请选择" clearable>
            <el-option label="满减券" value="FULL_REDUCE"></el-option>
            <el-option label="折扣券" value="DISCOUNT"></el-option>
            <el-option label="现金券" value="CASH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增优惠券</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag>{{ getTypeLabel(scope.row.couponType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠内容" width="150">
          <template #default="scope">
            <span v-if="scope.row.couponType === 'FULL_REDUCE'">满{{ scope.row.minAmount }}减{{ scope.row.discountValue }}</span>
            <span v-else-if="scope.row.couponType === 'DISCOUNT'">{{ scope.row.discountValue }}折</span>
            <span v-else>减{{ scope.row.discountValue }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="发放数量" width="100"></el-table-column>
        <el-table-column prop="receivedCount" label="已领取" width="100"></el-table-column>
        <el-table-column label="有效期" width="200">
          <template #default="scope">{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</template>
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

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.pageNum" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
        :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"></el-pagination>
    </el-card>

    <el-dialog :title="formData.id ? '编辑优惠券' : '新增优惠券'" v-model="dialogVisible" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="formData.couponName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="couponType">
          <el-select v-model="formData.couponType" placeholder="请选择类型">
            <el-option label="满减券" value="FULL_REDUCE"></el-option>
            <el-option label="折扣券" value="DISCOUNT"></el-option>
            <el-option label="现金券" value="CASH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低消费" prop="minAmount" v-if="formData.couponType === 'FULL_REDUCE'">
          <el-input-number v-model="formData.minAmount" :min="0" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="优惠值" prop="discountValue">
          <el-input-number v-model="formData.discountValue" :min="0" :precision="2"></el-input-number>
          <span style="margin-left: 10px">{{ formData.couponType === 'DISCOUNT' ? '折' : '元' }}</span>
        </el-form-item>
        <el-form-item label="发放数量" prop="totalCount">
          <el-input-number v-model="formData.totalCount" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"></el-date-picker>
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

const searchForm = reactive({ keyword: '', couponType: '' })
const tableData = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const dialogVisible = ref(false)
const formRef = ref(null)

const formData = reactive({
  id: '', couponName: '', couponType: 'FULL_REDUCE', minAmount: 0, discountValue: 0,
  totalCount: 100, dateRange: [], status: 1
})
const formRules = {
  couponName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  couponType: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const typeMap = { 'FULL_REDUCE': '满减券', 'DISCOUNT': '折扣券', 'CASH': '代金券' }
const getTypeLabel = (type) => typeMap[type] || type

const loadData = () => {
  request.get('/coupon/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, keyword: searchForm.keyword, couponType: searchForm.couponType }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total || 0
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { Object.assign(searchForm, { keyword: '', couponType: '' }); pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleAdd = () => {
  Object.assign(formData, { id: '', couponName: '', couponType: 'FULL_REDUCE', minAmount: 0, discountValue: 0, totalCount: 100, dateRange: [], status: 1 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(formData, { ...row, dateRange: [row.startTime, row.endTime] })
  dialogVisible.value = true
}

const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const submitData = { ...formData }
      if (formData.dateRange && formData.dateRange.length === 2) {
        submitData.startTime = formData.dateRange[0]
        submitData.endTime = formData.dateRange[1]
      }
      delete submitData.dateRange
      const method = formData.id ? 'put' : 'post'
      request[method]('/coupon', submitData).then(() => {
        ElMessage.success(formData.id ? '修改成功' : '新增成功')
        dialogVisible.value = false
        loadData()
      })
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该优惠券吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/coupon/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.coupon-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
</style>
