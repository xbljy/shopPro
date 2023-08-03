<template>
  <div class="widget">
    <header class="widget__header">
      <slot name="header">header</slot>
    </header>

    <div class="widget__content">
      <slot name="content">content</slot>
    </div>
  </div>
</template>
