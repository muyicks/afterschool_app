<template>
  <div id="app">
    <div class="d-flex">
      <button class="btn btn-dark fs-3 p-3 ms-auto mb-3" @click="toggleCartView">
        <i class="fa fa-cart-plus"></i>
        <span class="badge bg-danger">{{ cartSize }}</span>
      </button>
    </div>
 
    <component
      :is="activeComponent"
      :lessons="lessons"
      :cart="cart"
      :baseURL="baseURL"
      @remove-from-cart="removeProduct"
      @add-to-cart="addToCart"
      @order-submitted="resetCart"
    ></component>
  </div>
</template>
 
<script>
import LessonComponent from "./components/LessonComponent.vue";
import CheckoutComponent from "./components/CheckoutComponent.vue";
 
export default {
  name: 'App',
  data() {
    return {
      lessons: [],
      cart: [],
      baseURL: "https://afterskoolbackend.vercel.app/",
      activeComponent: 'LessonComponent'
    };
  },
  methods: {
    async getLessons() {
      var res = await fetch(`${this.baseURL}collection/lessons`);
      this.lessons = await res.json();
    },
    removeProduct(lesson) {
      const index = this.cart.findIndex((i) => i.lesson._id === lesson._id);
      if (index !== -1) {
        this.cart[index].amount--;
        lesson.spaces += 1;
        if (this.cart[index].amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    },
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces--;
        var cartIndex = this.cart.findIndex((i) => i.lesson._id === lesson._id);
        if (cartIndex > -1) {
          this.cart[cartIndex].amount++;
        } else {
          this.cart.push({
            lesson: lesson,
            amount: 1,
          });
        }
      }
    },
    toggleCartView() {
      this.activeComponent = this.activeComponent === 'LessonComponent' ? 'CheckoutComponent' : 'LessonComponent';
    },
    resetCart() {
      this.cart = [];
    }
  },
  computed: {
    cartSize() {
      return this.cart.reduce((sum, lesson) => sum + lesson.amount, 0);
    }
  },
  components: {
    LessonComponent,
    CheckoutComponent
  },
  mounted() {
    this.getLessons();
  }
};
</script>
 
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
 