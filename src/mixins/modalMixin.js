import BsModal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new BsModal(this.$refs.modal);
  },
};
