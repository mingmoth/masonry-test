<template>
    <div class="loading"></div>
</template>

<style lang="scss" scoped>
@keyframes shine {
  to {
    background-position-x: -200%;
  }
}

.loading {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    animation: 1.5s shine linear infinite;
}
</style>
