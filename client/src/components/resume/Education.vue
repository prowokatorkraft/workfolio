<script setup lang="ts"></script>

<template>
  <div class="education-header">
    <h3 class="education-title">
      🎓 Образование
      <span class="education-label-right-block">
        <span class="education-label-right">🏛️ СГАУ, Агроинженерия</span>
        <span class="education-label-right">🇬🇧 Английский A2</span>
      </span>
    </h3>

    <RouterLink to="/education" class="more-btn">
      <span>Подробнее</span>
      <span class="more-arrow">→</span>
    </RouterLink>
  </div>
</template>

<style scoped>
  .education-label-right {
    font-weight: 500;
    color: #666;
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
    margin-left: 10px;
  }

  .education-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e0e0e0;
  }

  .education-title {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
  }

  .more-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #42b983;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: none;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .more-btn:hover {
    background: #e8f5e9;
  }

  @media (min-width: 1025px) and (max-width: 1190px) {
    .education-label-right-block {
      display: block;
    }
  }
  @media (max-width: 830px) {
    .education-label-right-block {
      display: block;
    }
  }
  @media (max-width: 600px) {
    .education-label-right {
      display: block;
      margin-top: 10px;
      width: max-content;
    }
  }

  @media (max-width: 440px) {
    .education-header {
      display: table-column;
    }

    .more-btn {
      padding: 10px 15px;
    }
  }
</style>
