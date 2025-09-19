
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

initApp();

async function initApp(){
    const data = await fetchData();
    renderUsers(data);
}

async function fetchData(){
    try{
        const response = await fetch(USERS_URL);

        if(!response.ok){
            throw new Error("Couldn't fetch users");
        }

        const jsonData = await response.json();

        console.log(jsonData);
        console.log(Array.isArray(jsonData));
        return jsonData;
    } catch(error){
        console.error(error);
    }
}

function renderUsers(users){
    const table = document.querySelector("#usersTable");
    const headerRow = document.createElement("tr");
    const keys = Object.keys(users[0]);
    for (const key of keys) {
        const tableHead = document.createElement("th");
        tableHead.textContent = key;
        headerRow.appendChild(tableHead);
    }
    table.appendChild(headerRow);

    var id = 1;
    for (const user of users) {
        const tableRow = document.createElement("tr");
        
        tableRow.id = "data-user-id-" + id++; 
        for (const key of keys) {
            const tableData = document.createElement("td");

            if(typeof user[key] === "object" && user[key] !== null){
            let nested = [];

            for (const nestedKey of Object.keys(user[key])) {
                const value = user[key][nestedKey]
                if (typeof value !== "object" || value === null) {
          nested.push(`${nestedKey}: ${value}`);
        }
            }
            tableData.textContent = nested.join(", ")
            } else{
                  tableData.textContent = user[key];                   
            }
            tableRow.appendChild(tableData); 
        }
        table.appendChild(tableRow);
    }
}

function renderTableHead(users){

}

function checkIfNestedObject(key, user){
    
}