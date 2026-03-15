<script setup lang="ts">
  import Contacts from './Contacts.vue';
  import Location from './Location.vue';
  import { useUserStore } from '../../stores/User.ts';

  const user = useUserStore().user;
</script>

<template>
  <aside class="sidebar">
    <div class="photo-container">
      <div class="photo-placeholder">
        <span class="photo-icon">📷</span>
      </div>
      <!--      <div class="photo-placeholder">
        <img src="/path/to/your/photo.jpg" alt="Фото" class="photo" />
      </div>-->
    </div>

    <div class="user-info">
      <h1 class="user-name">
        {{ user.name }}
      </h1>
      <p class="user-title">
        {{ user.position }}
      </p>
      <p class="user-location">
        {{ user.comment }}
      </p>
      <Location />
      <Contacts />
    </div>
  </aside>
</template>

<style scoped>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .photo-container {
    display: flex;
    justify-content: flex-end;
  }

  .photo-placeholder {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
    box-shadow: 0 10px 25px rgba(66, 185, 131, 0.3);
    transition: transform 0.3s ease;
  }

  .photo-placeholder:hover {
    transform: scale(1.05);
  }

  .photo-icon {
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
  }

  .user-info {
    background: white;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    text-align: left;
    margin-top: -50px;
  }

  .user-name {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  .user-title {
    color: #42b983;
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .user-location {
    color: #666;
    font-size: 0.9rem;
  }

  .photo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    .sidebar {
      order: -1;
    }

    .photo-container {
      justify-content: center;
    }

    .user-info {
      margin-top: 0;
    }
  }

  @media (max-width: 768px) {
    .photo-placeholder {
      width: 150px;
      height: 150px;
      font-size: 2rem;
    }
  }
</style>
