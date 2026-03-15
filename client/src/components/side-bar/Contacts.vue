<script setup lang="ts">
  import { useUserStore } from '../../stores/User.ts';

  const contacts = useUserStore().user.contacts;
</script>

<template>
  <div class="contacts-row">
    <a :href="'tel:' + contacts.phone" class="contact-badge phone">
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ contacts.phoneInfo }}</span>
    </a>

    <a :href="contacts.vk" target="_blank" rel="noopener noreferrer" class="contact-badge vk">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4a76a8" />
            <stop offset="50%" stop-color="#6d8fb2" />
            <stop offset="100%" stop-color="#2a4d7a" />
          </linearGradient>
        </defs>
        <path
          fill="url(#vkGradient)"
          d="M12.9 17.5C7.3 17.5 4.1 13.6 3.9 8.5H5.7C5.9 12.4 8.1 14.6 11.5 15.1V8.5H13.3V12.4C16.6 12.1 19.1 9.8 19.8 8.5H21.6C21.1 10.4 19.2 13.1 16.8 14.6C19.2 16.1 21.5 18.2 22.2 20.5H20.3C19.7 18.8 18.1 16.8 15.7 15.6C13.3 17 11.5 17.5 11.5 17.5H12.9Z"
        />
      </svg>
      <span>ВКонтакте</span>
    </a>

    <a :href="'mailto:' + contacts.mail" class="contact-badge email">
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22 6L12 13L2 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ contacts.mail }}</span>
    </a>

    <a
      :href="contacts.telegram"
      target="_blank"
      rel="noopener noreferrer"
      class="contact-badge telegram"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.5 4.5L3.5 10.5L9.5 13.5M21.5 4.5L15.5 19.5L9.5 13.5M21.5 4.5L9.5 13.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.5 13.5L12.5 17.5L15.5 13.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ contacts.telegramInfo }}</span>
    </a>
  </div>
</template>

<style scoped>
  .contacts-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .contact-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: #f8f9fa;
    border-radius: 30px;
    color: #2c3e50;
    text-decoration: none;
    font-size: 0.64rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .contact-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border-color: transparent;
  }

  /* Цвета для конкретных сервисов */
  .contact-badge.email:hover {
    background: #ea4335;
    color: white;
  }

  .contact-badge.phone:hover {
    background: #34a853;
    color: white;
  }

  .contact-badge.telegram:hover {
    background: #0088cc;
    color: white;
  }

  .contact-badge.vk:hover {
    background: #4a76a8;
    color: white;
  }

  @media (max-width: 480px) {
    .contact-badge {
      width: 100%;
      justify-content: center;
    }
  }
</style>
