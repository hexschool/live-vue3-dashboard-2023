<template>
  <NavbarLayout />
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages />
    <RouterView v-if="status" />
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useToastMessageStore } from "@/stores/toastMessage";

import ToastMessages from '@/components/ToastMessages.vue';
import NavbarLayout from '@/components/NavbarLayout.vue';

export default {
  components: { NavbarLayout, ToastMessages },
  data() {
    return {
      status: false,
    };
  },
  methods:{
    ...mapActions(useToastMessageStore, ['pushMessage']),
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = `${token}`;
    const api = `${import.meta.env.VITE_API}/api/user/check`;
    this.$http.post(api)
      .then((response) => {
        this.pushMessage({
          style: 'success',
          title: '成功登入',
          content: response.data.message
        })
        this.status = true;
      }).catch((error) => {
        this.pushMessage({
          style: 'danger',
          title: '錯誤訊息',
          content: error.response.data.message
        })
        this.$router.push('/');
      });
  },
};
</script>
