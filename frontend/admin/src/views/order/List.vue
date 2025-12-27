<template>
  <div class="order-list">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option label="待接单" value="PENDING"></el-option>
            <el-option label="已接单" value="ACCEPTED"></el-option>
            <el-option label="制作中" value="PREPARING"></el-option>
            <el-option label="待取餐" value="READY"></el-option>
            <el-option label="已完成" value="COMPLETED"></el-option>
            <el-option label="已取消" value="CANCELLED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column prop="storeName" label="门店"></el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="100">
          <template #default="scope">¥{{ scope.row.actualAmount || scope.row.totalAmount }}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusColor(scope.row.orderStatus)">
              {{ getStatusLabel(scope.row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="success" link size="small" v-if="scope.row.orderStatus === 'PENDING'" @click="handleAccept(scope.row)">接单</el-button>
            <el-button type="danger" link size="small" v-if="!['COMPLETED', 'CANCELLED'].includes(scope.row.orderStatus)" @click="handleCancel(scope.row)">取消</el-button>
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

    <!-- 详情对话框 -->
    <el-dialog title="订单详情" v-model="detailDialogVisible" width="700px">
      <el-descriptions :column="2" border v-if="selectedOrder">
        <el-descriptions-item label="订单号">{{ selectedOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="门店">{{ selectedOrder.storeName }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ getStatusLabel(selectedOrder.orderStatus) }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ selectedOrder.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ selectedOrder.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额" :span="2">¥{{ selectedOrder.actualAmount || selectedOrder.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="下单时间" :span="2">{{ selectedOrder.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const searchForm = reactive({ orderNo: '', orderStatus: '' })
const tableData = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const detailDialogVisible = ref(false)
const selectedOrder = ref(null)

const statusMap = {
  'PENDING': '待接单', 'ACCEPTED': '已接单', 'PREPARING': '制作中',
  'READY': '待取餐', 'COMPLETED': '已完成', 'CANCELLED': '已取消'
}

const getStatusLabel = (status) => statusMap[status] || status
const getStatusColor = (status) => {
  const colorMap = { 'PENDING': 'warning', 'ACCEPTED': 'info', 'PREPARING': 'info', 'READY': 'success', 'COMPLETED': 'success', 'CANCELLED': 'danger' }
  return colorMap[status] || 'info'
}

const loadData = () => {
  request.get('/order/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, orderNo: searchForm.orderNo, orderStatus: searchForm.orderStatus }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { Object.assign(searchForm, { orderNo: '', orderStatus: '' }); pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleView = (row) => { selectedOrder.value = row; detailDialogVisible.value = true }

const handleAccept = (row) => {
  ElMessageBox.confirm('确定要接待该订单吗?', '提示', { type: 'warning' }).then(() => {
    request.patch(`/order/${row.id}/status`, { orderStatus: 'ACCEPTED' }).then(() => {
      ElMessage.success('订单状态更新成功')
      loadData()
    })
  }).catch(() => {})
}

const handleCancel = (row) => {
  ElMessageBox.prompt('请输入取消原因', '取消订单', {
    confirmButtonText: '确定', cancelButtonText: '取消', inputPattern: /.+/, inputErrorMessage: '取消原因不能为空'
  }).then(({ value }) => {
    request.patch(`/order/${row.id}/cancel`, { cancelReason: value }).then(() => {
      ElMessage.success('订单已取消')
      loadData()
    })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.order-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
.search-form :deep(.el-form-item) { margin-bottom: 0; }
</style>
