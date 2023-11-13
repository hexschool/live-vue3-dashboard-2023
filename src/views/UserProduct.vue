<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const router = useRouter();
const route = useRoute();

const id = ref(route.params.productId);
const product = ref({});
const isLoading = ref(false);

const getProduct = () => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/product/${id.value}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    product.value = response.data.product;
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

const addToCart = (id, qty = 1) => {
  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/cart`;
  const cart = {
    product_id: id,
    qty,
  };
  isLoading.value = true;
  axios.post(url, { data: cart }).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '加入購物車',
      content: response.data.message,
    })
    router.push('/user/cart');
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '加入購物車',
      content: error.response.data.message,
    })
  });
};

getProduct();
</script>


<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/user/cart">購物車</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img :src="product.imageUrl" class="img-fluid mb-3" :alt="product.title">
      </article>
      <div class="col-4">
        <div class="h5" v-if="!product.price">{{ product.origin_price }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
        <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
        <hr>
        <button
          type="button"
          class="btn btn-outline-danger"
          @click="addToCart(product.id)"
        >
          加到購物車
        </button>
      </div>
    </div>
  </div>
</template>
