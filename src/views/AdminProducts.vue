<script setup>
import axios from 'axios';

import { ref } from 'vue';

import { useToastMessageStore } from "@/stores/toastMessage";

import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
import ProductModal from '@/components/ProductModal.vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const products = ref([]);
const pagination = ref({});
const tempProduct = ref({});
const isNew = ref(false);
const isLoading = ref(false);

const productModalRef = ref(null);
const delModalRef = ref(null);

const getProducts = (page = 1) => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/products?page=${page}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    products.value = response.data.products;
    pagination.value = response.data.pagination;

    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '成功取得產品資訊',
      content: '已成功取得產品資訊',
    })
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const openModal = (status, item) => {
  if (status) {
    tempProduct.value = {};
    isNew.value = true;
  } else {
    tempProduct.value = { ...item };
    isNew.value = false;
  }

  productModalRef.value.openModal();
};

const updateProduct = (item) => {
  tempProduct.value = item;
  let api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/product`;
  isLoading.value = true;
  let httpMethod = 'post';
  let status = '新增產品';
  if (!isNew.value) {
    api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/product/${tempProduct.value.id}`;
    httpMethod = 'put';
    status = '更新產品';
  }
  productModalRef.value.hideModal();
  axios[httpMethod](api, { data: tempProduct.value }).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: status,
      content: response.data.message,
    })
    getProducts();
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const openDelProductModal = (item) => {
  tempProduct.value = { ...item };
  delModalRef.value.openModal();
};

const delProduct = () => {
  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/product/${tempProduct.value.id}`;
  isLoading.value = true;
  axios.delete(url).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '刪除產品',
      content: response.data.message,
    })
    delModalRef.value.hideModal();
    getProducts();
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

getProducts();

</script>

<template>
  <div>
    <VueLoading :active="isLoading" :z-index="1060" />
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ $filters.currency(item.origin_price) }}
          </td>
          <td class="text-right">
            {{ $filters.currency(item.price) }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="openModal(false, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelProductModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getProducts" />
    <!-- ProductModal -->
    <ProductModal
      @update-product="updateProduct"
      :product="tempProduct"
      :isNew="isNew"
      ref="productModalRef"
    />
    <!-- DelModal -->
    <DelModal :item="tempProduct" ref="delModalRef" @del-item="delProduct" />
  </div>
</template>
