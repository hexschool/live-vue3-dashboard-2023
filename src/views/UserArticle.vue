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

<script>
import { mapActions } from 'pinia'
import { useToastMessageStore } from "@/stores/toastMessage";

export default {
  data() {
    return {
      article: {},
      id: '',
    };
  },
  methods: {
    ...mapActions(useToastMessageStore, ['pushMessage']),
    getArticle() {
      const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/article/${this.id}`;
      this.isLoading = true;
      this.$http.get(api).then((response) => {
        this.article = response.data.article;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        this.pushMessage({
          style: 'danger',
          title: '取得文章資訊失敗',
          content: error.response.data.message,
        })
      });
    },
  },
  created() {
    this.id = this.$route.params.articleId;
    this.getArticle();
  },
};
</script>
