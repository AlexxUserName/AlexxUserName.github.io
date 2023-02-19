document.addEventListener("DOMContentLoaded", () => {
	const btn = document.querySelector(".main_btn");
	const input = document.querySelector(".main_input");
	const wrapperLi = document.querySelectorAll(".wrapper_li-item");
	const activeItem = document.querySelector(".ul-active");
	const completedItem = document.querySelector(".ul-completed");
	const checkbox = document.querySelector("#checkbox");
	const editBtn = document.createElement("button");
	let arrayTasks = [];

	if (localStorage.getItem("checked") !== null) {
		if (localStorage.getItem("checked") == "true") {
			localStorage.getItem("checked");
			checkbox.checked = true;
			changeTheme();
		} else if (localStorage.getItem("checked") == "false") {
			localStorage.removeItem("checked");
		}
	}

	btn.addEventListener("click", () => {
		const value = input.value;
		if (value.trim() && !arrayTasks.some(task => task.name == value)) {
			arrayTasks.push({
				name: value.substring(0, 36).toLowerCase().trim(),
				active: true,
			});
			localStorage.setItem("tasks", JSON.stringify(arrayTasks));
			if (checkbox.checked) {
				changeBgLiItem(activeItem, addElement(value));
				input.value = "";
			} else {
				addElement(value);
				input.value = "";
			}
		} else {
			input.value = "";
		}
	});
	const parseTasks = JSON.parse(localStorage.getItem("tasks"));
	if (localStorage.getItem("tasks") !== null) {
		arrayTasks = [...parseTasks];
	}
	arrayTasks.sort((a, b) => Number(b.active) - Number(a.active));
	localStorage.setItem("tasks", JSON.stringify(arrayTasks));

	function distributeTasks(block, boolValue, callbackFunction) {
		if (block.childElementCount == 0) {
			let tasks = arrayTasks.filter(item => item.active == boolValue);
			for (let i = 0; i < tasks.length; i++) {
				changeBgLiItem(block, callbackFunction(tasks[i].name));
			}
		}
	}
	distributeTasks(activeItem, true, addElement);
	distributeTasks(completedItem, false, moveElement);
	localStorage.setItem("tasks", JSON.stringify(arrayTasks));

	wrapperLi.forEach(items => {
		items.addEventListener("click", event => {
			const btnTask = event.target;
			const parent = btnTask.parentNode.parentNode.parentNode;

			function moveTask(status) {
				const listTasks = document.querySelectorAll(".list_item");

				for (let i = 0; i < listTasks.length; i++) {
					for (let task of arrayTasks) {
						if (parent.textContent.trim() == task.name) {
							arrayTasks.sort((a, b) => Number(b.active) - Number(a.active));
							task.active = status;
							arrayTasks = arrayTasks.filter(task => task.active !== null);
							parent.remove();
						}
					}
				}

				localStorage.setItem("tasks", JSON.stringify(arrayTasks));
			}

			if (btnTask && btnTask.classList.contains("delete_btn")) {
				moveTask(null);
			}
			if (btnTask && btnTask.classList.contains("done_btn")) {
				if (checkbox.checked) {
					moveTask(false);
					changeBgLiItem(completedItem, moveElement(parent.innerText));
				} else {
					moveTask(false);
					moveElement(parent.innerText);
				}
			}
			if (btnTask && btnTask.classList.contains("return_btn")) {
				if (checkbox.checked) {
					changeBgLiItem(activeItem, removeElement(parent.innerText));
					moveTask(true);
				} else {
					removeElement(parent.innerText);
					moveTask(true);
				}
			}
			if (
				btnTask &&
				btnTask.classList.contains("edit_btn") &&
				parent.parentNode.className == "wrapper_li-item ul-active"
			) {
				const editElement = currentLiElement => {
					const editInput = document.createElement("input");
					const div = document.createElement("div");
					const element = parent.innerText.trim();

					div.append(editInput, editBtn);
					document.querySelector(".wrapper").after(div);
					div.classList.add("change");
					editInput.classList.add("edit_input");
					editInput.placeholder = "Поле для редактирования";
					editInput.value = `${element}`;
					editBtn.textContent = "Редактировать";
					editBtn.classList.add("propertyEdit");

					editBtn.addEventListener("click", () => {
						const value = document.querySelector(".edit_input").value;

						if (value.trim() && !arrayTasks.some(task => task.name == value)) {
							if (checkbox.checked) {
								changeColorBgIcons(edit(currentLiElement, value));
								for (let task of arrayTasks) {
									if (task.name == element) {
										task.name = value;
									}
								}
								localStorage.setItem("tasks", JSON.stringify(arrayTasks));
								div.remove();
							} else {
								for (let task of arrayTasks) {
									if (task.name == element) {
										task.name = value;
									}
								}
								edit(currentLiElement, value);
								localStorage.setItem("tasks", JSON.stringify(arrayTasks));
								div.remove();
							}
						} else {
							div.remove();
						}
					});
				};
				if (!document.querySelector(".edit_input")) {
					editElement(parent);
				}
			}
		});
	});

	function moveElement(value) {
		completedItem.innerHTML += `
  <li class="list_item">
    ${value}
    <div class="wrapper_btn">
  <button class="done_btn btn_light">
    <img class="btn_img return_btn" src="icons/return.svg" alt="" />
  </button>
  <button class="edit_btn btn_light">
    <img class="btn_img edit_btn" src="icons/edit_banned.svg" alt="" />
  </button>
  <button class="delete_btn btn_light">
    <img class="btn_img delete_btn" src="icons/delete.svg" alt="" />
  </button>
</li>
`;
	}

	function addElement(value) {
		activeItem.innerHTML += `
  <li class="list_item">
    ${String(value).substring(0, 36).toLowerCase()}
    <div class="wrapper_btn ">
      <button class="done_btn btn_light">
        <img class="btn_img done_btn" src="icons/done.svg" alt="" />
      </button>
      <button class="edit_btn btn_light">
        <img class="btn_img edit_btn" src="icons/edit.svg" alt="" />
      </button>
      <button class="delete_btn btn_light">
        <img class="btn_img delete_btn" src="icons/delete.svg" alt="" />
      </button>
    </div>
</li>
`;
	}

	const edit = (oldLiElement, value) => {
		oldLiElement.innerHTML = `
  ${value.substring(0, 36).toLowerCase()}
  <div class="wrapper_btn">
<button class="done_btn btn_light">
  <img class="btn_img done_btn" src="icons/done.svg" alt="" />
</button>
<button class="edit_btn btn_light">
  <img class="btn_img edit_btn" src="icons/edit.svg" alt="" />
</button>
<button class="delete_btn btn_light">
  <img class="btn_img delete_btn" src="icons/delete.svg" alt="" />
</button>
</div>
  `;
	};

	const removeElement = value => {
		activeItem.innerHTML += `
  <li class="list_item">
    ${value}
    <div class="wrapper_btn ">
  <button class="done_btn btn_light">
    <img class="btn_img done_btn" src="icons/done.svg" alt="" />
  </button>
  <button class="edit_btn btn_light">
    <img class="btn_img edit_btn" src="icons/edit.svg" alt="" />
  </button>
  <button class="delete_btn btn_light">
    <img class="btn_img delete_btn" src="icons/delete.svg" alt="" />
  </button>
  </div>
</li>
`;
	};

	function changeBgLiItem(block) {
		if (block.childElementCount) {
			for (let item of block.children) {
				if (checkbox.checked) {
					item.classList.add("dark_LiItem");
					changeColorBgIcons();
				} else {
					item.classList.remove("dark_LiItem");
					document.querySelectorAll("button.btn_light").forEach(btn => {
						btn.style.background = "";
					});
				}
			}
		}
	}

	function changeColorBgIcons() {
		document.querySelectorAll("button.btn_light").forEach(btn => {
			btn.style.background = "grey";
		});
	}

	function changeColorBgBtn(btn) {
		if (checkbox.checked) {
			btn.classList.add("dark_btn");
		} else {
			btn.classList.remove("dark_btn");
		}
	}

	function changeTheme() {
		document.querySelector("body").classList.toggle("dark_body");
		document.querySelector(".ball").classList.toggle("ball_dark");

		document.querySelector(".main").classList.toggle("dark_main");
		document.querySelectorAll(".main_block").forEach(block => {
			block.classList.toggle("dark_block");
		});
		document.querySelectorAll(".line").forEach(line => {
			line.classList.toggle("dark_line");
		});

		if (checkbox.checked) {
			localStorage.setItem("checked", "true");
		} else {
			localStorage.setItem("checked", "false");
		}

		changeColorBgBtn(btn);
		changeColorBgBtn(editBtn);
		changeColorBgIcons();
		changeBgLiItem(activeItem);
		changeBgLiItem(completedItem);
	}

	checkbox.addEventListener("change", changeTheme);
});
