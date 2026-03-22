<script setup lang="ts">
  import { useUserStore } from '../../stores/User.ts';
  import PhoneIcon from '../icons/PhoneIcon.vue';
  import VkIcon from '../icons/VkIcon.vue';
  import EmailIcon from '../icons/EmailIcon.vue';
  import TelegramIcon from '../icons/TelegramIcon.vue';
  import MaxIcon from '../icons/MaxIcon.vue';

  const contacts = useUserStore().user.contacts;
</script>

<template>
  <div class="contacts-row">
    <a :href="'tel:' + contacts.phone" class="contact-badge phone">
      <PhoneIcon class="icon" />
      <span class="contact-name">{{ contacts.phoneInfo }}</span>
    </a>

    <a :href="contacts.vk" target="_blank" rel="noopener noreferrer" class="contact-badge vk">
      <VkIcon class="icon" />
      <span class="contact-name">ВКонтакте</span>
    </a>

    <a :href="'mailto:' + contacts.mail" class="contact-badge email">
      <EmailIcon class="icon" />
      <span class="contact-name">{{ contacts.mail }}</span>
    </a>

    <a
      :href="contacts.telegram"
      target="_blank"
      rel="noopener noreferrer"
      class="contact-badge telegram"
    >
      <TelegramIcon class="icon" />
      <span class="contact-name">{{ contacts.telegramInfo }}</span>
    </a>

    <a :href="contacts.max" target="_blank" rel="noopener noreferrer" class="contact-badge max">
      <MaxIcon class="icon" />
      <span class="contact-name">Max</span>
    </a>
  </div>
</template>

<style scoped>
  .contacts-row {
    display: flex;
    gap: 6px;
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

  .contact-badge.max:hover {
    background: #1e58d0;
    color: white;
  }

  @media (max-width: 690px) {
    .contact-name {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .contact-badge {
      width: fit-content;
      justify-content: center;
    }
  }
</style>
