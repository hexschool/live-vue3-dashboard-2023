<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';
import { useRoute } from 'vue-router';  

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const route = useRoute();

const article = ref({});
const articleId = ref(route.params.articleId);
const isLoading = ref(false);

const getArticle = () => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/article/${articleId.value}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    article.value = response.data.article;
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

getArticle();
</script>

<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/user/articles">部落格列表</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ article.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ article.title }}</h2>
        <p>
          <small class="text-muted">{{ $filters.date(article.create_at) }}</small> -
          <small class="text-muted">作者：{{ article.author }}</small>
        </p>
        <img :src="article.imageUrl" :alt="article.title" class="img-fluid mb-3">
        <div v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>
