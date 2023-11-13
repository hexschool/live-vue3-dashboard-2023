<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";

import { ref } from 'vue';

import ArticleModal from '@/components/ArticleModal.vue';
import DelModal from '@/components/DelModal.vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const articleModalRef = ref(null);
const delModalRef = ref(null);

const articles = ref([]);
const tempArticle = ref({});
const isNew = ref(false);
const isLoading = ref(false);
const pagination = ref({});

const openModal = (status, item) => {
  if (status) {
    tempArticle.value = {};
    isNew.value = true;
  } else {
    tempArticle.value = { ...item };
    isNew.value = false;
  }

  articleModalRef.value.openModal();
};

const getArticles = (currentPage = 1) => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/articles?page=${currentPage}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    articles.value = response.data.articles;
    pagination.value = response.data.pagination;

    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: '成功取得文章資訊',
      content: '已成功取得文章資訊',
    })
  }).catch((error) => {
    console.log(error)
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const getArticle = (id) => {
  const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/article/${id}`;
  isLoading.value = true;
  axios.get(api).then((response) => {
    tempArticle.value = response.data.article;
    openModal(false, tempArticle.value);
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

const openDelArticleModal = (item) => {
  tempArticle.value = { ...item };
  delModalRef.value.openModal();
};

const updateArticle = (item) => {
  tempArticle.value = item;
  let api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/article`;
  isLoading.value = true;
  let httpMethod = 'post';
  let status = '新增文章';
  if (!isNew.value) {
    api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/article/${tempArticle.value.id}`;
    httpMethod = 'put';
    status = '更新文章';
  }
  articleModalRef.value.hideModal();
  axios[httpMethod](api, { data: tempArticle.value }).then((response) => {
    isLoading.value = false;
    pushMessage({
      style: 'success',
      title: status,
      content: response.data.message,
    })
    getArticles();
  }).catch((error) => {
    isLoading.value = false;
    pushMessage({
      style: 'danger',
      title: '錯誤訊息',
      content: error.response.data.message,
    })
  });
};

const delArticle = () => {
  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/article/${tempArticle.value.id}`;
  isLoading.value = true;
  axios.delete(url).then(() => {
    isLoading.value = false;
    delModalRef.value.hideModal();
    getArticles();
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
  <div>
    <VueLoading :active="isLoading" :z-index="1060" />
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的頁面
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th style="width: 200px">標題</th>
          <th style="width: 200px">作者</th>
          <th>描述</th>
          <th style="width: 100px">建立時間</th>
          <th style="width: 100px">是否公開</th>
          <th style="width: 120px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ $filters.date(article.create_at) }}</td>
          <td>
            <span v-if="article.isPublic">已上架</span>
            <span v-else>未上架</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="getArticle(article.id)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelArticleModal(article)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ArticleModal
      ref="articleModalRef"
      :article="tempArticle"
      :is-new="isNew"
      @update-article="updateArticle"
    ></ArticleModal>
    <DelModal :item="tempArticle" ref="delModalRef" @del-item="delArticle" />
  </div>
</template>

