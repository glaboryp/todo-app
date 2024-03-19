const tasksList = document.querySelector('#tasks-list')
const newTaskInput = document.querySelector('#new-task-input')
const addTaskButton = document.querySelector('#add-task-button')
const allTask = document.querySelector('#all-task-span')
const pendingTask = document.querySelector('#pending-task-span')
const completedTask = document.querySelector('#completed-task-span')

const tasks = []

const app = {
  tasks,
  tasksList,
  newTaskInput
}

window.onload = function () {
  const savedTasks = JSON.parse(window.localStorage.getItem('tasks')) || []
  app.tasks = savedTasks.map((task) => {
    return createTask(task.title, task.isCompleted)
  })
  app.tasks.forEach((task, index) => {
    return addTaskToList(task, app.tasksList, index)
  })
}

function saveTasksToLocalStorage (tasks) {
  window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

function createTask (title, isCompleted = false) {
  return {
    id: Date.now(),
    title,
    isCompleted
  }
}

function addTaskToList (task, taskList, id) {
  const taskElement = createTaskElement(task, id)
  taskList.appendChild(taskElement)
}

function addTask (app) {
  const newTaskTitle = app.newTaskInput.value
  const newTask = createTask(newTaskTitle)
  app.tasks.push(newTask)

  addTaskToList(newTask, app.tasksList, 0)
  saveTasksToLocalStorage(app.tasks)
  app.newTaskInput.value = ''
}

function createTaskElement (task, id) {
  const taskElement = document.createElement('li')
  const span1 = document.createElement('span')
  const span2 = document.createElement('span')

  const taskCheckbox = document.createElement('input')
  taskCheckbox.type = 'checkbox'
  const idTask = id > 0 ? id : app.tasks.length
  taskCheckbox.id = 'checkbox' + idTask
  taskCheckbox.className = 'checkboxTask'
  taskCheckbox.checked = task.isCompleted
  taskCheckbox.addEventListener('change', () => {
    task.isCompleted = taskCheckbox.checked
    taskText.classList.toggle('completed', task.isCompleted)
    saveTasksToLocalStorage(app.tasks)
  })

  const taskText = document.createElement('label')
  taskText.textContent = task.title
  taskText.setAttribute('for', 'checkbox' + idTask)
  taskText.classList.toggle('completed', task.isCompleted)

  const taskDeleteButton = document.createElement('input')
  taskDeleteButton.type = 'image'
  taskDeleteButton.src = 'assets/button-delete.svg'
  taskDeleteButton.className = 'deleteButton'
  taskDeleteButton.addEventListener('click', () => {
    taskElement.classList.add('deleted')
    setTimeout(() => {
      taskElement.remove()

      const taskIndex = app.tasks.indexOf(task)
      if (taskIndex > -1) {
        app.tasks.splice(taskIndex, 1)
      }
      saveTasksToLocalStorage(app.tasks)
    }, 1000)
  })

  span1.appendChild(taskCheckbox)
  span1.appendChild(taskText)
  span2.appendChild(taskDeleteButton)

  taskElement.appendChild(span1)
  taskElement.appendChild(span2)

  return taskElement
}

addTaskButton.addEventListener('click', () => {
  if (newTaskInput.value) {
    addTask(app)
  }
})

newTaskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && newTaskInput.value) {
    addTask(app)
  }
})

allTask.addEventListener('click', () => {
  allTask.classList.add('active')
  pendingTask.classList.remove('active')
  completedTask.classList.remove('active')
})

pendingTask.addEventListener('click', () => {
  pendingTask.classList.add('active')
  allTask.classList.remove('active')
  completedTask.classList.remove('active')

  app.tasks.forEach((task, index) => {
    if (!task.isCompleted) {
      task.classList.add('hide')
    }
  })
})

completedTask.addEventListener('click', () => {
  completedTask.classList.add('active')
  pendingTask.classList.remove('active')
  allTask.classList.remove('active')
})
