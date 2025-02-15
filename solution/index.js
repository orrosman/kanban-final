//add new task to top to the relevant section
function addButtonClick(){
    const taskInput = this.parentElement.querySelector("input").value
    if (taskInput && taskInput.trim()){
        const category = event.currentTarget.parentNode.id
        const list = this.parentNode.querySelector("ul")
        const task = createTaskElement(taskInput)
        list.prepend(task)
        saveToLocalStorage(taskInput, category)
        this.parentElement.querySelector("input").value = ""
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
    newTask.addEventListener("dblclick",editTask)

    //Add event handlers for drag & drop
    newTask.draggable = true
    newTask.addEventListener("dragstart", handleDragStart)
    newTask.addEventListener("dragend", handleDragEnd)

    const removeTaskButton = document.createElement("img")
    removeTaskButton.setAttribute("class", "remove-button")
    removeTaskButton.setAttribute("src","./assets/Remove-Task-Icon.ico")
    removeTaskButton.addEventListener("click", removeTask)
    newTask.appendChild(removeTaskButton)

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
function saveToLocalStorage(taskInput, category) {
    const localStorageData = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = localStorageData[category]
    appropriateTasksList.unshift(taskInput)
    localStorageData[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(localStorageData))
}

//remove task from older category on LocalStorage
function removeFromLocalStorage(taskInput, category) {
    const localStorageData = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = localStorageData[category]
    appropriateTasksList.splice(appropriateTasksList.indexOf(taskInput),1)
    localStorageData[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(localStorageData))
    
}

//Replace old task with a new one on LocalStorage
function replaceInLocalStorage(newTask, category, taskIndex){
    const localStorageData = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = localStorageData[category]
    appropriateTasksList.splice(taskIndex, 1, newTask)
    localStorageData[category] = appropriateTasksList
    localStorage.setItem("tasks", JSON.stringify(localStorageData))
}

//Return the position in LocalStorage of a given task
function getPlaceInLocalStorage(task, category){
    const localStorageData = JSON.parse(localStorage.getItem("tasks"))
    const appropriateTasksList = localStorageData[category]
    return appropriateTasksList.indexOf(task)
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

//Move task to new category
function moveTask(category, task) {
    const categoryElement = document.querySelector(`.${category}`)
    const oldCategory = task.parentElement.parentElement.id
    categoryElement.prepend(task)
    const newCategory = categoryElement.parentElement.id
    saveToLocalStorage(task.innerText, newCategory)

    removeFromLocalStorage(task.innerText, oldCategory)
}

//Detect multiple key presses
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

//Let a task be editable and replaces the existing text
function editTask() {
    this.contentEditable = true
    const category = this.parentElement.parentElement.id
    const currentIndex = getPlaceInLocalStorage(this.innerText, category)
    this.addEventListener("blur",() =>{
        if (this.innerText == "") {
            removeFromLocalStorage(this,category)
            this.remove()
        }
        else{
            replaceInLocalStorage(this.innerText, category, currentIndex)
            this.contentEditable = false
        }
    })
}

//Search for tasks on page
function searchTasks() {
    const query = document.querySelector("#search").value.toLowerCase()
    const tasksCategories = [document.querySelector(".to-do-tasks"), 
                        document.querySelector(".in-progress-tasks"),
                        document.querySelector(".done-tasks")]
                        
    //Iterate over all tasks and compare to search query
    for (let category of tasksCategories){
        const tasksList = category.querySelectorAll("li")
        for (let task of tasksList){
            if (task.innerText.toLowerCase().indexOf(query) >(-1)){
                task.style.display = ""
            }
            else{
                task.style.display = "none"
            }
        }
    }
}

//Save tasks to remote bin
function saveToBin(){
    const tasksCategories = [document.querySelector(".to-do-tasks"),
                             document.querySelector(".in-progress-tasks"),
                             document.querySelector(".done-tasks")]
    const tasks = {"todo":[], "in-progress":[], "done": []}

    //Iterate over all tasks and save them to an object
    for(const category of tasksCategories){
        const categoryId = category.parentElement.id
        const tasksList = category.querySelectorAll("li")
        for (const task of tasksList) {
            tasks[categoryId].push(task.innerText)
        }
    }

    const data = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({tasks})
    }
    fetch("https://json-bins.herokuapp.com/bin/614dbbc41f7bafed863ed88f/",data)
    
    //Display a message the tasks were saved
    let saveDiv = document.querySelector(".save-load")
    let message = document.createElement("div")
    message.innerText = "Saved to remote bin 😁"
    message.setAttribute("class", "message")
    saveDiv.appendChild(message)
    setTimeout(() => {
        saveDiv.removeChild(document.querySelector(".message"))
    }, 2000)
}

//Load tasks from remote bin
async function loadFromBin() {
    const data = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }
    //Get data from remote bin
    const previousLocalStorage = localStorage.getItem("tasks")
    const response = await fetch("https://json-bins.herokuapp.com/bin/614dbbc41f7bafed863ed88f", data)
    if (response.ok){
        const tasks = await response.json() //convert json file response to object
            .then(dataObject => { return dataObject.tasks })        //get "tasks" object
        return tasks
    }
    else{
        alert("Something happened😥, Please try again later...")
        localStorage.setItem("tasks", previousLocalStorage) // prevent lose of tasks on failure
        previousLocalStorage = null
    }
}

// update LocalStorage and DOM from remote bin
async function updateTasksFromBin(){
    const binTasksObject = await loadFromBin()
    let binTasksJsonString = JSON.stringify(binTasksObject)
    if (binTasksJsonString != localStorage.tasks){
        localStorage.setItem("tasks", binTasksJsonString)
        for (const category of categories) {
            while (category.firstChild) {
                category.firstChild.remove()
            }
        }
        localStorageTasksToDom()
    }
}

//Drag & Drop functions
let dragElement = null; //track current dragging task

function handleDragStart(event) {
    dragElement = this
    event.dataTransfer.effectAllowed = "move";

    this.classList.add("draggingElement");  //highlight current dragging task
}

function handleDragEnd(event) {
    dragElement = null;
    this.classList.remove("draggingElement")    //remove highlight from current dragging task
}

function handleDragEnter(task) {
    task.preventDefault();  //enable dropping an element into another
    this.classList.add("over")
    console.log("enter");
}

function handleDragLeave() {
    console.log("leave");
    this.classList.remove("over");
}

function handleDragOver(event) {
    event.preventDefault()  //enable dropping an element into another
    event.dataTransfer.dropEffect = "move";
    this.classList.add("over");
}

function handleDrop(event) {
    this.appendChild(dragElement)
    this.classList.remove("over");

}

//Create loader indicator element
function loader() {
    const boardDiv = document.querySelector(".save-load")
    const loaderElement = document.createElement("div")
    loaderElement.classList.add("loader")
    boardDiv.prepend(loaderElement)
}

function handleLoadClick() {
    const boardDiv = document.querySelector(".save-load")

    loader(updateTasksFromBin())
    setTimeout(() => {
        boardDiv.removeChild(document.querySelector(".loader"))
    }, 300)
    updateTasksFromBin()
}

// remove task
function removeTask() {
    removeFromLocalStorage(this.parentElement.innerText, this.parentElement.parentElement.parentElement.id);
    this.parentElement.remove()
}

//Add event handlers for drag & drop for all lists
const categories = document.getElementsByTagName("ul")
for (const category of categories) {
    category.addEventListener("dragover",handleDragOver)
    category.addEventListener("drop",handleDrop)
    category.addEventListener("dragenter",handleDragEnter)
    category.addEventListener("dragleave",handleDragLeave)
}

//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)

//Event handler for search field
document.getElementById("search").addEventListener("input",searchTasks)

//Event handlers to save and load tasks from remote bin
document.getElementById("save-btn").addEventListener("click", saveToBin)
document.getElementById("load-btn").addEventListener("click", handleLoadClick)

//On load functions
buildLocalStorage()
localStorageTasksToDom()