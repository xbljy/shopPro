<template>
  <header class="dashboard_home__header u-margin-bottom-small">
    <div class="dashboard_home__search">
      <input
        id="search"
        type="text"
        class="dashboard_home__input"
        placeholder="搜索"
      />
      <label for="search" class="dashboard_home__label">
        <svg class="dashboard_home__search_icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-search1" />
        </svg>
      </label>
    </div>
    <h1 class="heading--h1 heading--h1__style--2">个人主页</h1>
    <router-link to="/store" class="btn btn--3">逛商城</router-link>
    <div class="dashboard_home__img">
      <img src="@/assets/images/background-dashboard.png" alt="" />
    </div>
  </header>
</template>
