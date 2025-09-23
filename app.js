const USERS_URL = "https://jsonplaceholder.typicode.com/users";

let users = []

initApp();

async function initApp() {
  users = await fetchData();
  renderUsers(users);

  document.querySelector("#userTable").addEventListener("click", handleClick);

  document.querySelector("#userForm").addEventListener("submit", handleCreateUser);
}

async function fetchData() {
  try {
    const response = await fetch(USERS_URL);

    if (!response.ok) {
      throw new Error("Couldn't fetch users");
    }

    const jsonData = await response.json();

    console.log(jsonData);
    console.log(Array.isArray(jsonData));
    return jsonData;
  } catch (error) {
    console.error(error);
  }
}

function renderUsers(users) {
  const table = document.querySelector("#userTable");
  const keys = Object.keys(users[0]);

  renderTableHead(table, users, keys);
  
  renderTableRows(table, users, keys);
}

function renderTableHead(table, users, keys) {
  const headerRow = document.createElement("tr");
  for (const key of keys) {
    const tableHead = document.createElement("th");
    tableHead.textContent = key;
    headerRow.appendChild(tableHead);
  }
  table.appendChild(headerRow);
}

function renderTableRows(table, users, keys) {
  let id = 1;

  for (const user of users) {
    const tableRow = document.createElement("tr");
    tableRow.id = "data-user-id-" + id++;

    for (const key of keys) {
      const tableData = document.createElement("td");

      if (typeof user[key] === "object" && user[key] !== null) {
        
        tableData.textContent = handleNestedJsonObjects(user, key);

      } else {
        tableData.textContent = user[key];
      }
      tableRow.appendChild(tableData);
    }

    tableRow.appendChild(createButtons(table));

    table.appendChild(tableRow);
    
  }
}

function handleNestedJsonObjects(obj, key){ 
  let nested = []; 
  function iterate(value){ 
    if (typeof value === "object" && value !== null){ 
      for (const nestedKey of Object.keys(value)){
         iterate(value[nestedKey]); 
        } 
      } else { 
        nested.push(String(value)); 
      } 
    } 
    iterate(obj[key]); 
    return nested.join(", "); 
  }

function createButtons(table){
  const buttonTableData = document.createElement("td");
    for(let i = 0; i < 2; i++){
        let buttonName = "Edit";
        if(i == 0){
          buttonName = "Delete"
        }
        const button = document.createElement("button");
        button.textContent = buttonName;
        button.id = buttonName + "Button";
        buttonTableData.appendChild(button);
      }
  return buttonTableData;
}

function handleClick(event){
  const target = event.target;

  if (target.tagName !== "BUTTON") return;

  const row = target.closest("tr");

  if(target.id === "DeleteButton"){
    console.log("Delete clicked");
  }

  if(target.id === "EditButton"){
    console.log("Edit clicked");
  }
}

async function handleCreateUser(event){
  event.preventDefault();
  const form = event.target;

  const formData = new FormData(event.target);
  const jsonObject = Object.fromEntries(formData.entries());

  try{
    const result = await fetch(USERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(jsonObject),
    });

    if(!result.ok){
      throw new Error(`Post failed: ${result.status}`);
    }

    const createdJsonObject = await result.json();

    users.push(createdJsonObject)
    rerenderUsersTable(users);

    form.reset();
  } catch (err){
    console.error(err);
  }

  function rerenderUsersTable(users){
    const table = document.querySelector("#userTable");
    table.textContent ="";
    renderUsers(users);
  }
}