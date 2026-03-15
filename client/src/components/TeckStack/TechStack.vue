<script setup lang="ts">
  import GroupSkills from "./GroupSkills.vue";

  const techStacks = {
    frontend: [
      { name: 'Vue.js', level: 90 },
      { name: 'React', level: 75 },
      { name: 'TypeScript', level: 85 },
      { name: 'JavaScript', level: 95 },
      { name: 'HTML/CSS', level: 100 },
      { name: 'Tailwind', level: 3 }
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 15 },
      { name: 'NestJS', level: 75 },
      { name: 'Express', level: 80 }
    ],
    database: [
      { name: 'PostgreSQL', level: 75 },
      { name: 'MongoDB', level: 5 },
      { name: 'Redis', level: 45 }
    ],
    other: [
      { name: 'Docker', level: 60 },
      { name: 'Git', level: 85 },
      { name: 'Figma', level: 70 },
      { name: 'Jest', level: 65 }
    ]
  };
</script>

<template>
  <div class="skills-container">
    <div class="skills-header">
      <h2 class="skills-title">
        <span class="title-icon">⚙️</span>
        Стек технологий
      </h2>
    </div>

    <div class="skills-minimal">
      <GroupSkills
        label="Backend"
        :skills="techStacks.backend"
      />
      <GroupSkills
        label="Frontend"
        :skills="techStacks.frontend"
      />
      <GroupSkills
        label="Database"
        :skills="techStacks.database"
      />
      <GroupSkills
        label="Tools"
        :skills="techStacks.other"
      />
    </div>
  </div>
</template>

<style scoped>
  .skills-container {
    width: 100%;
  }

  .skills-header {
    margin-bottom: 15px;
  }

  .skills-title {
    font-size: 1.5rem;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .skills-minimal {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .skills-title {
      font-size: 1.3rem;
    }
  }
</style>
