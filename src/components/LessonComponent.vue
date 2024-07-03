<template>
    <div>
      <div class="container">
        <div>
          <input
            type="text"
            class="form-control"
            v-model="searchTerm"
            placeholder="Search Product..."
            @input="searchLessons"
          />
        </div>
   
        <div>
          <label for="sortAttribute">Sort By:</label>
          <select
            v-model="sortAttribute"
            class="form-select"
            @change="searchLessons"
          >
            <option value="title">Title</option>
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">spaces</option>
          </select>
        </div>
   
        <div>
          <label for="sortOrder">Sort Order:</label>
          <select
            v-model="sortOrder"
            class="form-select mb-3"
            @change="searchLessons"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
   
        <div class="row">
          <div class="col-sm-4" v-for="product in localLessons" :key="product._id">
            <div class="card mb-3 rounded-0 border border-success-subtle">
              <div class="card-header d-flex">
                <div>
                  <p>Subject: {{ product.subject }}</p>
                  <h5>Title: {{ product.title }}</h5>
                </div>
                <i :class="product.icon" class="fs-1 ms-auto"></i>
              </div>
              <div class="card-body">
                <p>
                  Price: {{ product.price }} <i class="fa fa-eur"> per hour</i>
                </p>
                <p>Location: {{ product.location }}</p>
                <p>spaces: {{ product.spaces }}</p>
              </div>
              <div class="card-footer">
                <button
                  @click="addToCart(product)"
                  :disabled="product.spaces === 0"
                >
                  <i class="fa fa-cart-plus"></i>
                </button>
                <button @click="removeProduct(product)">
                  <i class="fa fa-minus-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
   
  <script>
  export default {
    props: ['lessons', 'cart', 'baseURL'],
    data() {
      return {
        searchTerm: "",
        sortOrder: "asc",
        sortAttribute: "subject",
        localLessons: [], // Initialize as an empty array
      };
    },
    watch: {
      lessons: {
        handler(newLessons) {
          this.localLessons = [...newLessons]; // Update localLessons when lessons prop changes
        },
        immediate: true, // Fetch lessons immediately on component mount
        deep: true, // Watch for deep changes in lessons
      },
    },
    methods: {
      async searchLessons() {
        try {
          const query = {
            search: this.searchTerm,
            sort: this.sortAttribute,
            order: this.sortOrder
          }
          
          const res = await fetch(`${this.baseURL}search/collection/lessons/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
          });
          if (!res.ok) {
            throw new Error("Failed to fetch lessons");
          }
          const lessons = await res.json();
          this.localLessons = lessons;
        } catch (error) {
          console.error(error);
        }
      },
      checkItemCount(id) {
        return this.cart.reduce((count, item) => count + (item.lesson._id === id ? item.amount : 0), 0);
      },
      addToCart(product) {
        if (this.canAddToCart(product)) {
          this.$emit('add-to-cart', product); // Emit add-to-cart event with product
        }
      },
      removeProduct(product) {
        this.$emit('remove-from-cart', product); // Emit remove-from-cart event with product
      },
      canAddToCart(product) {
        return product.spaces > this.checkItemCount(product._id); // Check spaces against cart items
      },
    },
    computed: {
      cartSize() {
        return this.cart.reduce((sum, lesson) => sum + lesson.amount, 0);
      },
      cartTotal() {
        return this.cart.reduce(
          (total, item) => total + item.amount * item.lesson.price,
          0
        );
      },
    },
  };
  </script>
   
  <style>
  /* Add your styles here */
  </style>