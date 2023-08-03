<template>
  <div class="error_page">
    <div class="error_page__oops">对不起</div>

    <p class="error_page__text">
      您访问的页面不存在
      <router-link class="error_page__link" to="/home">返回首页</router-link>
    </p>

    <span>404</span>

    <img src="@/assets/images/cong.png" alt="robot" class="error_page__robot" />
    <img
      src="@/assets/images/white_wave.png"
      alt="white_wave"
      class="error_page__wave"
    />
  </div>
</template>
