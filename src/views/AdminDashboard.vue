<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ToastMessages from '@/components/ToastMessages.vue';
import NavbarLayout from '@/components/NavbarLayout.vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const router = useRouter();

const status = ref(false);

const init = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  axios.defaults.headers.common.Authorization = token;
  const api = `${import.meta.env.VITE_API}/api/user/check`;
  axios.post(api)
    .then(() => {
      pushMessage({
        style: 'success',
        title: '登入訊息',
        content: '已成功登入'
      })
      status.value = true;
    }).catch((error) => {
      pushMessage({
        style: 'danger',
        title: '登入訊息',
        content: error.response.data.message,
      })
      router.push('/');
    });
}

init();
</script>

<template>
  <NavbarLayout />
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages />
    <RouterView v-if="status" />
  </div>
</template>
