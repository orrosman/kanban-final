//add new task to top to the relevant section
function addButtonClick(){
    const taskInput = this.parentNode.querySelector("input").value
    if (taskInput && taskInput.trim()){
        const list = this.parentNode.querySelector("ul")
        const task = createTaskElement(taskInput)
        list.prepend(task)
        saveToLocalStorage(taskInput)
    }
    else{
        alert("Can't add an empty task")
    }
}

//create task element
function createTaskElement(taskInput){
    let newTask = document.createElement("li")
    newTask.classList.add("task")
    newTask.innerText = taskInput
    return newTask
}

//Builds an empty object of tasks to LocalStorage
function buildLocalStorage(){
    if(!localStorage.getItem("tasks")){
        const tasks = {
            "todo": [],
            "in-progress": [],
            "done": []
        }
        localStorage.setItem("tasks",JSON.stringify(tasks))
    }
}

//Saves tasks from DOM to LocalStorage
function saveToLocalStorage(taskInput) {
    const localStorageData = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = localStorageData[event.currentTarget.parentNode.id]
    appropriateTasksList.unshift(taskInput)
    localStorageData[event.currentTarget.parentNode.id] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(localStorageData))
}

//Build task elements from tasks saved to LocalStorage
function localStorageTasksToDom(){
    const tasks = JSON.parse(localStorage.getItem("tasks"))

    for(let [category, tasksList] of Object.entries(tasks)){
        let categoryElement = document.querySelector(`#${category}`).querySelector("ul")
        for (let task of tasksList){
            categoryElement.appendChild(createTaskElement(task))
        }       
    }
}

//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)

//On load functions
buildLocalStorage()
localStorageTasksToDom()