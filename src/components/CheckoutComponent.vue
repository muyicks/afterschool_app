<template>
    <div>
      <div class="container mt-4">
        <div class="row">
          <div class="col-sm-8 border rounded-3">
            <!-- Cart items display -->
            <div v-for="item in cart" :key="item.lesson._id" class="border-bottom">
              <div class="col-sm-12 mb-4 p-3">
                <div class="row">
                  <div class="col-sm-4">
                    <i :class="item.lesson.icon" class="display-1 ms-auto"></i>
                  </div>
                  <div class="col-sm-4">
                    <p>Title: {{ item.lesson.title }}</p>
                    <p>Quantity: {{ item.amount }}</p>
                    <p>
                      <button @click="$emit('remove-from-cart', item.lesson)">
                        <i class="fa fa-minus-circle"></i>
                      </button>
                    </p>
                  </div>
                  <div class="col-sm-4">
                    <p>Price: {{ item.lesson.price }} <i class="fa fa-eur"> per hour</i></p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Total price -->
            <div class="col-sm-12">
              <p>Total Price: {{ cartTotal }} <i class="fa fa-eur"></i></p>
            </div>
          </div>
          <div class="col-sm-4 mt-4">
            <!-- Order details form -->
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-12">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Details</h5>
                      <form @submit.prevent="submitOrder">
                        <!-- Username input -->
                        <div class="mb-3">
                          <label for="username" class="form-label">Name</label>
                          <input type="text" v-model="username" class="form-control" id="username" name="username" placeholder="Name" required>
                        </div>
                        <!-- Phone number input -->
                        <div class="mb-3">
                          <label for="phone" class="form-label">Number</label>
                          <input type="tel" v-model="phone" class="form-control" id="phone" name="phone" placeholder="Number" required>
                        </div>
                        <!-- Submit button -->
                        <button type="submit" class="btn btn-primary" :disabled="!completeOrder">Submit</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
   
  <script>
  export default {
    props: ['cart', 'baseURL'],
    data() {
      return {
        username: '',
        phone: ''
      };
    },
    methods: {
      async submitOrder() {
        try {
          const order = {
            cart: [...this.cart],
            username: this.username,
            phone: this.phone
          };
          const res = await fetch(`${this.baseURL}collection/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
          });
         
          this.cart.forEach(item => {
            fetch(`${this.baseURL}collection/lessons/${item.lesson._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({spaces: item.lesson.spaces})
          });
          });

          const text = await res.text();  // Get the response text
          console.log('Response Text:', text);  // Log the response text
          try {
            const data = JSON.parse(text);  // Try to parse it as JSON
            if (!res.ok) {
              throw new Error(data.message || 'Failed to submit order');
            }
            alert('Order submitted successfully!');
            this.$emit('order-submitted');
          } catch (e) {
            // If parsing fails, it's likely an HTML response
            throw new Error(`Unexpected response format: ${text}`);
          }
        } catch (error) {
          console.error('Error:', error.message);
          alert(`There was an error submitting your order: ${error.message}`);
        }
      }
    },
    computed: {
      completeOrder() {
        return /^[a-zA-Z]+$/.test(this.username) && /^\d+$/.test(this.phone);
      },
      cartTotal() {
        return this.cart.reduce((total, item) => total + item.amount * item.lesson.price, 0);
      }
    }
  };
  </script>
   
  <style>
  /* Add your styles here */
  </style>  