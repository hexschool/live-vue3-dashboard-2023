<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';

import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const props = defineProps({
  config: Object,
});

const couponModalRef = ref(null);
const delModalRef = ref(null);

const coupons = ref({});
const tempCoupon = ref({
  title: '',
  is_enabled: 0,
  percent: 100,
  code: '',
});
const isNew = ref(false);
const isLoading = ref(false);

const openCouponModal = (status, item) => {
  isNew.value = status;
  if (isNew.value) {
    tempCoupon.value = {
      due_date: new Date().getTime() / 1000,
    };
  } else {
    tempCoupon.value = { ...item };
  }
  couponModalRef.value.openModal();
};

const openDelCouponModal = (item) => {
  tempCoupon.value = { ...item };
  delModalRef.value.openModal();
};

const getCoupons = () => {
  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupons`;
  isLoading.value = true;
  axios.get(url).then((response) => {
    coupons.value = response.data.coupons;
    isLoading.value = false;
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const updateCoupon = (tempCoupon) => {
  isLoading.value = true;
  let url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon`;
  let httpMethos = 'post';
  let data = tempCoupon;

  if (!isNew.value) {
    url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon/${tempCoupon.id}`;
    httpMethos = 'put';
    data = tempCoupon;
  }

  axios[httpMethos](url, { data }).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '新增優惠券',
      content: response.data.message,
    })
    getCoupons();
    couponModalRef.value.hideModal();
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const delCoupon = () => {
  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/coupon/${tempCoupon.value.id}`;
  isLoading.value = true;
  axios.delete(url).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '刪除優惠券',
      content: response.data.message,
    })
    const delComponent = delModalRef.value;
    delComponent.hideModal();
    getCoupons();
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '刪除優惠券',
      content: error.response.data.message,
    })
  });
};

getCoupons();
</script>

<template>
  <div>
    <VueLoading :active="isLoading" :z-index="1060" />
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key) in coupons" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.percent }}%</td>
        <td>{{ $filters.date(item.due_date) }}</td>
        <td>
          <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
          <span v-else class="text-muted">未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button type="button" class="btn btn-outline-primary btn-sm"
                    @click="openCouponModal(false, item)"
            >編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm"
                    @click="openDelCouponModal(item)"
            >刪除</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <CouponModal :coupon="tempCoupon" :is-new="isNew" ref="couponModalRef"
    @update-coupon="updateCoupon"/>
    <DelModal :item="tempCoupon" ref="delModalRef" @del-item="delCoupon"/>
  </div>
</template>

