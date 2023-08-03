<template>
  <footer class="footer">
    <p class="copyright">&copy; 版权所有</p>
    <ul class="footer__link--list">
      <li class="footer__link--item">
        <router-link to="/contact" class="footer__link">联系我们</router-link>
      </li>

      <li class="footer__link--item">
        <router-link to="/about-us" class="footer__link">关于我们</router-link>
      </li>

      <li class="footer__link--item">
        <router-link to="/policey" class="footer__link">隐私政策</router-link>
      </li>

      <li class="footer__link--item">
        <router-link to="/terms_and_conditions" class="footer__link"
          >条款</router-link
        >
      </li>

      <li class="footer__link--item">
        <router-link to="/app" class="footer__link">下载app</router-link>
      </li>
    </ul>
  </footer>
</template>
