<template>
  <section class="widget--style-2 u-margin-bottom-meduim">
    <div class="widget--style-2__heading">
      <h6 class="heading--h6">任务列表</h6>
      <button
        class="btn btn-red btn-small"
        @click="deleteTodos"
        :disabled="Object.entries(selectedTodoObj).length < 1"
      >
        <svg class="btn__icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-trash-2" />
        </svg>
        删除
      </button>
    </div>

    <ul class="todo__list" v-if="todoList.length > 0">
      <li
        class="todo__item"
        v-for="todo in todoList"
        :key="todo.id"
        :class="{ todo__finished: todo.status }"
      >
        <div class="todo__group">
          <input
            :id="'checkbox' + todo.id"
            type="checkbox"
            class="todo__checkbox"
            @change="toggleTodo(todo)"
          />
          <label :for="'checkbox' + todo.id" class="todo__label"></label>
        </div>
        <p class="todo__content">{{ todo.text }}</p>

        <div class="todo__tick--div" @click="toggleTodoStatus(todo)">
          <svg class="todo__tick">
            <use
              :xlink:href="
                todo.status
                  ? '@/assets/images/sprite.svg#icon-cross'
                  : '@/assets/images/sprite.svg#icon-checkmark'
              "
            />
          </svg>
        </div>
      </li>
    </ul>

    <p class="todo__no_content" v-else>添加任务</p>

    <form class="todo__form" @submit.prevent="submit($event)">
      <input
        placeholder="输入任务"
        type="text"
        class="todo__input"
        v-model="newTodo"
      />
      <button class="btn btn-gradient_blue todo__submit" :disabled="!newTodo">
        确认
      </button>
    </form>
  </section>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const todoList = ref([]);
    const newTodo = ref(null);

    const submit = () => {
      if (!newTodo.value) return;
      todoList.value.push({
        text: newTodo.value,
        id: Math.floor(Math.random() * 1000 + Date.now()),
        status: false,
      });
      newTodo.value = "";
    };

    let selectedTodoObj = ref({});
    const toggleTodo = (todo) => {
      if (selectedTodoObj.value[todo.id]) {
        delete selectedTodoObj.value[todo.id];
      } else {
        selectedTodoObj.value[todo.id] = { ...todo };
      }
    };

    const toggleTodoStatus = (todo) => {
      todo.status = !todo.status;
      console.log(todoList.value);
    };

    const deleteTodos = () => {
      todoList.value = todoList.value.filter(
        (todo) => !selectedTodoObj.value[todo.id]
      );
      selectedTodoObj.value = {};
    };

    return {
      submit,
      newTodo,
      todoList,
      toggleTodo,
      deleteTodos,
      toggleTodoStatus,
      selectedTodoObj,
    };
  },
};
</script>
