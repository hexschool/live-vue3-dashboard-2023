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

<script>
import { mapActions } from 'pinia'
import { useToastMessageStore } from "@/stores/toastMessage";

export default {
  data() {
    return {
      articles: [],
      isLoading: false,
      isNew: false,
      tempArticle: {},
    };
  },
  methods: {
    ...mapActions(useToastMessageStore, ['pushMessage']),
    getArticles(page = 1) {
      const api = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/articles?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((response) => {
        this.articles = response.data.articles;
        this.pagination = response.data.pagination;
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
    this.getArticles();
  },
};
</script>
