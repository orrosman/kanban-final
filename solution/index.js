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
    newTask.addEventListener("mouseenter", handleMultiKeyPress)
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


function moveTask(category, task) {
    const categoryElement = document.querySelector(`.${category}`)
    categoryElement.prepend(task)
}

function handleMultiKeyPress(){

    let keys = {
        alt: false,
        one: false,
        two: false,
        three: false
    };

    addEventListener("keydown", (event) => {
        switch (event.key) {
            case "Alt":
                keys.alt = true;
                break;
            case "1":
                keys.one = true;
                break;
            case "2":
                keys.two = true;
                break;
            case "3":
                keys.three = true;
                break;
        }
        if (keys.alt && keys.one) {
            moveTask("to-do-tasks",this)
        }
        else if(keys.alt && keys.two){
            moveTask("in-progress-tasks",this)
        }
        else if(keys.alt && keys.three){
            moveTask("done-tasks",this)
        }

    });

    addEventListener("keyup", (event) => {
        switch (event.key) {
            case "Alt":
                keys.alt = false;
                break;
            case "1":
                keys.one = false;
                break;
            case "2":
                keys.two = false;
                break;
            case "3":
                keys.three = false;
                break;
        }
    });
}

//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)

//On load functions
buildLocalStorage()
localStorageTasksToDom()