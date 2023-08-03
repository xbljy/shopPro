const removeAlert = (el, delay) => {
  if (!el) return;

  setTimeout(() => {
    el.style.transform = "translateY(-2rem)";
    el.style.opacity = "0";
    setTimeout(() => {
      el.remove();
    }, 500);
  }, delay);
};

export function Alert(type, message, delay = 1000) {
  const alertsDiv = document.getElementById("alerts");
  // 动态创建alert元素并插入html
  const el = document.createElement("div");
  el.classList.add("alert");
  el.classList.add(`alert--${type}`);

  // 添加到alert列表容器中
  alertsDiv.appendChild(el);

  // 根据类型创建不同的alert
  let markup;
  switch (type) {
    case "success": {
      markup = `
        <svg class='alert__icon alert__icon--${type}'>
           <use xlink:href='@/assets/images/sprite.svg#icon-check-circle' />
        </svg>
        <div class='alert__message'>
          ${message}
         </div>

    `;
      break;
    }
    case "warning": {
      markup = `
        <svg class='alert__icon alert__icon--warning'>
            <use xlink:href='@/assets/images/sprite.svg#icon-alert-triangle'/>
        </svg>
        <div class='alert__message'>${message}</div>

    `;
      break;
    }

    case "error": {
      markup = `
        <svg class='alert__icon alert__icon--error'>
            <use xlink:href='@/assets/images/sprite.svg#icon-alert-triangle'/>
        </svg>
        <div class='alert__message'>${message}</div>

    `;
      break;
    }

    default: {
      markup = `
        <svg class='alert__icon alert__icon--info'>
            <use xlink:href='@/assets/images/sprite.svg#icon-alert-triangle'/>
        </svg>
        <div class='alert__message'>${message}</div>
    `;
      break;
    }
  }

  el.innerHTML = markup;

  el.addEventListener("click", () => {
    removeAlert(el, 0);
  });
  removeAlert(el, delay);
}
