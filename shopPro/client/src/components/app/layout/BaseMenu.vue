<template>
  <div class="menu">
    <heading-sec>
      <template #title>
        <slot name="title"></slot>
      </template>
    </heading-sec>
    <div class="menu__content">
      <slot name="content"></slot>
    </div>
    <div class="controls--div">
      <slot name="controls"></slot>
    </div>
  </div>
</template>
