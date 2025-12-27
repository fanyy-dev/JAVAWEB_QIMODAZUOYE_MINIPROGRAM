<template>
  <div class="review-list">
    <el-card>
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="评分">
          <el-select v-model="searchForm.rating" placeholder="请选择" clearable>
            <el-option label="5星" :value="5"></el-option>
            <el-option label="4星" :value="4"></el-option>
            <el-option label="3星" :value="3"></el-option>
            <el-option label="2星" :value="2"></el-option>
            <el-option label="1星" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column prop="username" label="用户" width="120"></el-table-column>
        <el-table-column prop="storeName" label="门店" width="150"></el-table-column>
        <el-table-column label="评分" width="150">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容"></el-table-column>
        <el-table-column label="评价图片" width="200">
          <template #default="scope">
            <el-image v-for="(img, idx) in (scope.row.images || '').split(',').filter(i => i)" :key="idx"
              :src="img" style="width: 40px; height: 40px; margin-right: 5px" fit="cover" :preview-src-list="(scope.row.images || '').split(',')"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" width="180"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.pageNum" :page-sizes="[10, 20, 50]" :page-size="pagination.pageSize"
        :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"></el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const searchForm = reactive({ orderNo: '', rating: '' })
const tableData = ref([])
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })

const loadData = () => {
  request.get('/review/list', {
    params: { pageNum: pagination.pageNum, pageSize: pagination.pageSize, orderNo: searchForm.orderNo, rating: searchForm.rating }
  }).then(data => {
    tableData.value = data.records || []
    pagination.total = data.total || 0
  }).catch(() => { tableData.value = [] })
}

const handleSearch = () => { pagination.pageNum = 1; loadData() }
const handleReset = () => { Object.assign(searchForm, { orderNo: '', rating: '' }); pagination.pageNum = 1; loadData() }
const handleSizeChange = (val) => { pagination.pageSize = val; loadData() }
const handleCurrentChange = (val) => { pagination.pageNum = val; loadData() }

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该评价吗?', '提示', { type: 'warning' }).then(() => {
    request.delete(`/review/${row.id}`).then(() => { ElMessage.success('删除成功'); loadData() })
  }).catch(() => {})
}

onMounted(() => { loadData() })
</script>

<style scoped>
.review-list { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.search-form { margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 8px 8px 0 0; }
</style>
