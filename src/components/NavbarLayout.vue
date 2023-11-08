<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">香菇園</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink to="/admin/products" class="nav-link">產品</RouterLink>
          <RouterLink to="/admin/orders" class="nav-link">訂單</RouterLink>
          <RouterLink to="/admin/coupons" class="nav-link">優惠券</RouterLink>
          <RouterLink to="/admin/article" class="nav-link">貼文</RouterLink>
          <a href="#" @click.prevent="logout" class="nav-link">登出</a>
        </div>
        <div class="navbar-nav ms-auto">
          <RouterLink to="/user/articles" class="nav-link">Blog</RouterLink>
          <RouterLink to="/user/cart" class="nav-link">購物車</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  inject: ['emitter'],
  methods: {
    logout() {
      const api = `${import.meta.env.VITE_API}/logout`;
      this.$http.post(api)
        .then((response) => {
          this.$httpMessageState(response, '登出');
          if (response.data.success) {
            this.$router.push('/');
          }
        }).catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        });
    },
  },
};
</script>
