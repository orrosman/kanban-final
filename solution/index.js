//add new task to top to the relevant section
function addButtonClick(){
    const taskInput = this.parentNode.querySelector("input").value
    if (taskInput && taskInput.trim()){
        const list = this.parentNode.querySelector("ul")
        const task = document.createElement("li")
        task.textContent = taskInput
        task.classList.add("task")
        list.prepend(task)
    }
    else{
        alert("Can't add an empty task")
    }
}

//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)