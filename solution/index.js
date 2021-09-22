function addButtonClick(){
    const taskInput = this.parentNode.querySelector("input").value
    const list = this.parentNode.querySelector("ul")
    const task = document.createElement("li")
    task.textContent = taskInput
    list.prepend(task)

}

//Event handlers for adding buttons
document.getElementById("submit-add-to-do").addEventListener("click", addButtonClick)
document.getElementById("submit-add-in-progress").addEventListener("click", addButtonClick)
document.getElementById("submit-add-done").addEventListener("click", addButtonClick)