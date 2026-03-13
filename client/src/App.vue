<template>
  {{data}}
</template>

<script setup>
import {onMounted, ref} from "vue";

/*export default {
  name: 'App',
  components: {
    HelloWorld
  }
}*/

const data = ref('dd');
const loading = ref(true);
const error = ref('');

const fetchData = async () => {
  try {
    const baseUrl = window.location.origin;
    const response = await fetch(baseUrl + '/api/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data.value = await response.text();
  } catch (err) {
    error.value = `Ошибка загрузки: ${err.message}`;
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchData();
});
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
