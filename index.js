//Create a new item object from submitted form
function CreateItem() {
  //Create item object
  let item = {
    id: Date.now(),
    description: document.getElementById("descriptionForm").value,
    deadline: document.getElementById("deadlineForm").value,
    completed: false,
  };
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  //if object exists add new item, otherwise create object array and add new item
  if (items) {
    items.push(item);
  } else {
    items = [];
    items.push(item);
  }
  //Set modified object array into sessionStorage
  sessionStorage.setItem("items", JSON.stringify(items));
}
//Load items object array from sessionStorage. Used on page load
function LoadItems() {
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  //If object array exists, display item object array
  if (items) {
    FilterItems();
    CreateItemCards();
    CheckCheckboxes();
  }
}
//Change item object property - completed
function ItemCheck(id) {
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  //Change object property - completed from false to true and vice versa
  items.map((item) => {
    if (item.id == id) {
      if (item.completed == true) {
        item.completed = false;
      } else {
        item.completed = true;
      }
    }
  });
  //Set modified object array to sessionStorage
  sessionStorage.setItem("items", JSON.stringify(items));
  //Reload page
  location.reload();
}
//Delete item object
function DeleteItem(id) {
  //Confirm the delete action
  if (confirm("Are you sure you want to delete this?")) {
    //Get items object array
    let items = JSON.parse(sessionStorage.getItem("items"));
    //Delete object based on item index
    items.map((item) => {
      if (item.id == id) {
        const index = items.indexOf(item);
        items.splice(index, 1);
      }
    });
    //Set modified object array to sessionStorage
    sessionStorage.setItem("items", JSON.stringify(items));
  }
  //Reload items
  location.reload();
}
//Filter items object array based on deadline and completed properties
function FilterItems() {
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  //Sort object array based on deadline date, the closest date to today first.
  items.sort(function (a, b) {
    if (a.deadline && b.deadline)
      return new Date(a.deadline) - new Date(b.deadline);
    else if (a.deadline) return -1;
    else if (b.deadline) return 1;
    else return 0;
  });
  //Sort object array based on completed property (boolean), "false" first, "true" last
  items.sort(function (a, b) {
    return a.completed - b.completed;
  });
  //Set modified object array to sessionStorage
  sessionStorage.setItem("items", JSON.stringify(items));
}
//Check all items checkboxes in HTML based on item property - completed (Required for page reload)
function CheckCheckboxes() {
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  //Select item checkbox and check it in HTML
  items.map((item) => {
    if (item.completed == true) {
      // !!! querySelector does not work on older browsers
      document.querySelector(`[id='${item.id}'] #checkbox`).checked = true;
    }
  });
}

function CreateItemCards() {
  //Get items object array
  let items = JSON.parse(sessionStorage.getItem("items"));
  items.map((item) => {
    //Create a new itemCard
    let itemCard = document.createElement("div");
    itemCard.className = "itemCard";
    itemCard.id = item.id;
    //Create description
    let description = document.createElement("p");
    description.innerText = `Description: ${item.description}`;
    //Create deadline
    let deadline = document.createElement("p");
    if (item.deadline) {
      item.deadline = `${item.deadline.split("T")[0]} ${
        item.deadline.split("T")[1]
      }`;
    }
    deadline.innerText = `Deadline: ${item.deadline}`;
    //Create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkBox";
    checkbox.onclick = function () {
      ItemCheck(item.id);
    };
    checkbox.id = "checkbox";
    let checkboxLabel = document.createElement("label");
    checkboxLabel.className = "checkboxLabel";
    checkboxLabel.htmlFor = "checkbox";
    checkboxLabel.innerText = "Completed: ";
    let checkboxDiv = document.createElement("div");
    checkboxDiv.className = "checkboxDiv";
    checkboxDiv.appendChild(checkboxLabel);
    checkboxDiv.appendChild(checkbox);
    //Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
      DeleteItem(item.id);
    };
    //Add all new elements to itemCard as children
    itemCard.appendChild(description);
    itemCard.appendChild(deadline);
    itemCard.appendChild(checkboxDiv);
    itemCard.appendChild(deleteButton);
    let itemList = document.getElementById("itemList");
    // Add itemCard to ItemList as a child
    itemList.appendChild(itemCard);
  });
}
//Display new item form and hide the button
function ChangeFormDisplay() {
  if (!document.getElementById("newItemForm").style.display) {
    document.getElementById("newItemForm").style.display = "flex";
    document.getElementById("newItemButton").style.display = "none";
  } else {
    document.getElementById("newItemForm").style.display = "none";
  }
}
