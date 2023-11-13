<script setup>
import axios from 'axios';

import { useToastMessageStore } from "@/stores/toastMessage";
import useModal from "@/hooks/useModal";

import { ref, watch } from 'vue';

const toastMessageStore = useToastMessageStore()
const { pushMessage }  = toastMessageStore

const { openModal, hideModal, modalRef } = useModal()

const props = defineProps({
  product: Object,
  isNew: Boolean,
});

const emits = defineEmits(['update-product']);

const fileInputRef = ref(null);

const tempProduct = ref({});
const status = ref({
  fileUploading: false,
});

watch(() => props.product, (value) => {
  tempProduct.value = value;
  if (!tempProduct.value.imagesUrl) {
    tempProduct.value.imagesUrl = [];
  }
  if (!tempProduct.value.imageUrl) {
    tempProduct.value.imageUrl = '';
  }
});

const uploadFile = () => {
  const uploadedFile = fileInputRef.value.files[0];
  const formData = new FormData();
  formData.append('file-to-upload', uploadedFile);

  const url = `${import.meta.env.VITE_API}/api/${import.meta.env.VITE_PATH}/admin/upload`;
  status.value.fileUploading = true;

  axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((response) => {
    status.value.fileUploading = false;
    tempProduct.value.imageUrl = response.data.imageUrl;
    fileInputRef.value.value = '';
    pushMessage({
      style: 'success',
      title: '圖片上傳結果',
      content: response.data.message,
    })
  }).catch((error) => {
    status.value.fileUploading = false;
    pushMessage({
      style: 'danger',
      title: '圖片上傳結果',
      content: error.response.data.message,
    })
  });
}

defineExpose({
  openModal,
  hideModal,
})
</script>


<template>
  <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結" />
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                  <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                </label>
                <input type="file" id="customFile" class="form-control" ref="fileInputRef" @change="uploadFile" />
              </div>
              <img class="img-fluid" :src="tempProduct.imageUrl" />
              <!-- 延伸技巧，多圖 -->
              <div class="mt-5" v-if="tempProduct.imagesUrl">
                <div v-for="(image, key) in tempProduct.imagesUrl" class="mb-3" :key="key">
                  <input type="url" class="form-control form-control" v-model="tempProduct.imagesUrl[key]"
                    placeholder="請輸入連結" />
                  <div>
                    <img class="img-fluid" :src="image" />
                  </div>
                  <button type="button" class="btn btn-outline-danger" @click="tempProduct.imagesUrl.splice(key, 1)">
                    移除
                  </button>
                </div>
                <div v-if="tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] ||
                  !tempProduct.imagesUrl.length
                  ">
                  <button type="button" class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')">
                    新增圖片
                  </button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題" />
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input type="text" class="form-control" id="category" v-model="tempProduct.category"
                    placeholder="請輸入分類" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input type="text" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位" />
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input type="number" class="form-control" id="origin_price" min="0"
                    v-model.number="tempProduct.origin_price" placeholder="請輸入原價" />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input type="number" class="form-control" id="price" v-model.number="tempProduct.price" min="0"
                    placeholder="請輸入售價" />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea type="text" class="form-control" id="description" v-model="tempProduct.description"
                  placeholder="請輸入產品描述"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea type="text" class="form-control" id="content" v-model="tempProduct.content"
                  placeholder="請輸入產品說明內容"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled" :true-value="1"
                    :false-value="0" id="is_enabled" />
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="emits('update-product', tempProduct)">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

