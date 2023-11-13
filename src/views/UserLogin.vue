<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ToastMessages from '@/components/ToastMessages.vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const router = useRouter();

const user = ref({
  username: '',
  password: '',
});

const isLoading = ref(false);

const signIn = () => {
  const api = `${import.meta.env.VITE_API}/admin/signin`;
  isLoading.value = true;
  axios.post(api, user.value).then((response) => {
    const { token, expired } = response.data;
    document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
    isLoading.value = false;
    router.push('/admin/products');
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '登入訊息',
      content: error.response.data.message,
    })
  });
};
</script>


<template>
  <div class="container mt-5">
    <VueLoading :active="isLoading" :z-index="1060" />
    <ToastMessages />
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            v-model="user.username"
            required
            autofocus
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            v-model="user.password"
            placeholder="Password"
            required
          />
        </div>
        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">
            登入
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
