<template>
  <div class="app__container custom-2">
    <div class="wrapper">
      <form class="form rounded__base">
        <div class="heading">
          <div class="heading__text">联系我们</div>
          <img src="@/assets/images/wave.png" alt="" class="heading__wave" />
        </div>

        <div class="form__group">
          <label for="fullName" class="form__label">姓名</label>
          <input
            id="fullName"
            type="text"
            class="form__input"
            placeholder="请输入您的姓名"
          />
        </div>
        <div class="form__group">
          <label for="email" class="form__label">邮箱</label>
          <input
            id="email"
            type="email"
            class="form__input"
            placeholder="请输入您的邮箱"
          />
        </div>

        <div class="form__group">
          <label for="message" class="form__label">留言</label>
          <textarea
            id="message"
            class="form__textarea"
            cols="30"
            rows="10"
            placeholder="请输入您的留言"
          ></textarea>
        </div>

        <div class="form__group">
          <button class="btn btn-small btn-blue" type="button">发送</button>
        </div>
      </form>
    </div>
  </div>
</template>
