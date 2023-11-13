<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const articles = ref([]);
const isLoading = ref(false);
const pagination = ref({});

const getArticles = (page = 1) => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/articles?page=${page}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    articles.value = response.data.articles;
    pagination.value = response.data.pagination;
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

getArticles();
</script>

<template>
  <VueLoading :active="isLoading" :z-index="1060" />
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <template v-for="article in articles" :key="article.id">
        <div class="col" v-if="article.isPublic">
          <div class="card">
            <img :src="article.imageUrl" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <div v-html="article.description"></div>
            </div>
            <div class="card-footer">
              <RouterLink
                :to="`/user/article/${article.id}`"
                v-if="article.isPublic"
                class="btn btn-outline-primary"
              >
                文章頁面
              </RouterLink>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
