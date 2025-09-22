const USERS_URL = "https://jsonplaceholder.typicode.com/users";

initApp();

async function initApp() {
  const data = await fetchData();
  renderUsers(data);
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

function handleNestedJsonObjects(user, key){
    let nested = [];

        for (const nestedKey of Object.keys(user[key])) {
          const value = user[key][nestedKey];
          if (typeof value !== "object" || value === null) {
            nested.push(`${value}`);
          }
        }
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
        buttonTableData.appendChild(button);
      }
  return buttonTableData;
}