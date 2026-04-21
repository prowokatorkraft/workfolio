<script setup lang="ts">
  import Contacts from './Contacts.vue';
  import Location from './Location.vue';
  import { useUserStore } from '../../stores/User.ts';
  import { EventEnum } from '../../types/Event-enum-type.ts';
  import { useEventStore } from '../../stores/Event.ts';
  import DownloadPDF from '../DownloadPDF.vue';
  import { computed, ref } from 'vue';
  import type { ToastToggler } from '../../types/ToastToggler.ts';
  import Toaster from '../Toaster.vue';

  const props = defineProps<{
    currentRoute: string;
  }>();

  const user = useUserStore().user;
  const events = useEventStore();

  const showCV = computed(() => props.currentRoute === 'Resume');
  const toggleToaster = ref<ToastToggler>(() => {});
</script>

<template>
  <aside class="sidebar">
    <div :class="showCV ? 'photo-container' : 'photo-container end'">
      <DownloadPDF
        v-show="showCV"
        class="photo-cv"
        @click="events.handleClick(EventEnum.resume_cv_pdf_download)"
        @closed="
          toggleToaster(
            'Если файл не выгружается или поврежден, попробуйте другой браузер',
            'ⓘ',
            5000
          )
        "
      />
      <div
        class="photo-placeholder"
        @mouseover="events.handleFocus(EventEnum.user_info_image_focus)"
        @mouseleave="events.handleBlur(EventEnum.user_info_image_focus)"
      >
        <img src="/PersonaPhoto.jpg" alt="Фото" class="photo" />
      </div>
    </div>

    <div class="user-info">
      <h1 class="user-name">
        {{ user.name }}
      </h1>
      <p class="user-title">
        {{ user.position }}
      </p>
      <p class="user-comment">
        {{ user.comment }}
      </p>
      <Location />
      <Contacts />
    </div>
  </aside>
  <Toaster @toggle="(value: ToastToggler) => (toggleToaster = value)" />
</template>

<style scoped>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .photo-container {
    display: flex;
    justify-content: space-between;
  }

  .photo-container.end {
    justify-content: end;
  }

  .photo-cv {
    z-index: 50;
    height: max-content;
    align-self: center;
    margin-bottom: -30px;
  }

  .photo-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
    box-shadow: 0 10px 25px rgba(66, 185, 131, 0.3);
    transition: transform 0.3s ease;
    z-index: 10;
  }

  .photo-placeholder:hover {
    transform: scale(1.05);
  }

  .photo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    background: white;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    text-align: left;
    margin-top: -65px;
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

  .user-comment {
    color: #666;
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    .sidebar {
      order: -1;
      gap: 0;
    }

    .photo-container {
      justify-content: flex-end;
      gap: 20px;
    }

    .photo-cv {
      margin-bottom: 0;
    }

    .user-info {
      margin-top: -100px;
    }
  }

  @media (max-width: 500px) {
    .photo-placeholder {
      width: 150px;
      height: 150px;
      font-size: 2rem;
    }

    .photo-container {
      gap: 10px;
    }

    .photo-cv {
      margin-top: -53px;
    }

    .user-info {
      margin-top: -100px;
    }
  }

  @media (max-width: 440px) {
    .photo-container {
      justify-content: center;
    }

    .photo-container.end {
      justify-content: center;
    }

    .photo-cv {
      align-self: flex-start;
      margin-top: 0;
      position: absolute;
      left: 25px;
    }

    .user-info {
      margin-top: -34px;
    }
  }

  @media print {
    .user-info {
      margin-top: -250px;
      max-width: 450px;
      padding: 0 25px;
    }
  }
</style>
