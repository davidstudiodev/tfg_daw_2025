<template>
  <section class="skills-showcase">
    <div class="skills-bg"></div>
    <div class="skills-content">
      <div class="skills-left">
        <h1>Conecta con tus <span class="highlight">skills</span></h1>
      </div>
      <div class="skills-right">
        <div class="skills-list">
          <span
            v-for="(skill, i) in skills"
            :key="i"
            class="skill-badge"
            :class="{ featured: skill.featured }"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const skills = [
  { name: 'HTML' },
  { name: 'CSS' },
  { name: 'JavaScript' },
  { name: 'Vue' },
  { name: 'Angular'},
  { name: 'React' },
  { name: 'Node' },
  { name: 'Express' },
  { name: 'Python' },
  { name: 'Django' },
  { name: 'Flask' },
  { name: 'Docker' },
  { name: 'Kubernetes' },
  { name: 'AWS' },
  { name: 'Astro' },
  { name: 'Tailwind CSS' },
  { name: 'Bootstrap' },
  { name: 'REST API' },
  { name: 'SQL' },
  { name: 'NoSQL' },
  { name: 'Git' },
  { name: 'TypeScript'},
  { name: 'Next.js'}
]
</script>

<style scoped>
.skills-showcase {
  width: 100%;
  min-height: 400px;
  background: var(--white);
  border-top-left-radius: 60px;
  border-top-right-radius: 61px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.skills-bg {
  position: absolute;
  inset: 0;
  background: var(--white);
  border-top-left-radius: 60px;
  border-top-right-radius: 61px;
  z-index: 0;
}

.skills-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem;
}

.skills-left {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.skills-left h1 {
  font-size: 3rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 500;
  color: var(--black);
  line-height: 0.9;
  margin: 0;
  text-align: left;
  width: 70%;
}

.skills-left .highlight {
  color: var(--green-light);
}

.skills-right {
  flex: 1 1 60%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem 1.5rem;
  justify-content: center;
}

.skill-badge {
  min-width: 105px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  border: 0.5px solid var(--black);
  background: transparent;
  color: var(--black);
  font-size: 1rem;
  font-family: 'Red Hat Text', sans-serif;
  font-weight: 400;
  transition: background 0.2s, color 0.2s;
  text-align: center;
  padding: 0 1.5rem;
  cursor: pointer;
}

.skill-badge.featured,
.skill-badge:hover {
  background: var(--green-light);
  color: var(--black);
  border-color: var(--black);
}

@media (max-width: 900px) {
  .skills-content {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .skills-left h1 {
    font-size: 2.2rem;
    width: 100%;
    text-align: center;
  }
  .skills-list {
    justify-content: center;
    gap: 0.8rem 1rem;
  }
  .skills-right {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .skills-showcase {
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .skills-left h1 {
    font-size: 2rem;
    line-height: 1;
    text-align: center;
    width: 100%;
  }
  .skills-list {
    gap: 0.5rem 0.5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .skill-badge {
    min-width: 80px;
    font-size: 0.9rem;
    padding: 0 1rem;
    height: 28px;
  }
}
</style>