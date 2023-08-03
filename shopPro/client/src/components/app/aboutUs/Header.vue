<template>
  <header class="about__header">
    <ul class="dots">
      <li class="dot dot__blue"></li>
      <li class="dot"></li>
    </ul>

    <h1 class="heading--h1 uppercase heading--h1__style--1-phone">
      选好物来这里
    </h1>

    <pre class="text">
      我们的宗旨是质量第一，客户第一
    </pre>

    <base-button
      class="btn--4 btn--locations"
      :innerText="'公司分布'"
      @click="$emit('button-clicked')"
    ></base-button>

    <div class="about__image--div">
      <img src="@/assets/images/man.png" alt="" class="about__image" />
    </div>
  </header>
</template>
