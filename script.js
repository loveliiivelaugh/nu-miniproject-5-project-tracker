const time = document.getElementById("time");
const form = document.querySelector("form");
const projectName = document.getElementById("project-name")
const projectType = document.getElementById("multi-select")
const hourlyWage = document.getElementById("hourly-wage")
const date = document.getElementById("datepicker")
const tableBody = document.querySelector("tbody");


const updateClock = () => {
  time.innerHTML = `<h4>${moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}</h4>`;
  setTimeout(updateClock, 1000);
};
updateClock();


const handleLocalStorage = (action, storageName, data) => {
  let storage = [];
  switch (action) {
    case "initialize":
      storage = localStorage.getItem(storageName) ? JSON.parse(localStorage.getItem(storageName)) : []
      return storage;
    case "set":
      localStorage.setItem(storageName, JSON.stringify(data));
      break;
    case "get":
      storage = JSON.parse(localStorage.getItem(storageName))
      return storage;
    case "clear":
      localStorage.clear(storageName)
      break;
    default:
      null;
  }
}

const updateStorage = () => { projectStorage = handleLocalStorage("get", "projectStorage"); }

//updateStorage()
let projectStorage = handleLocalStorage("initialize", "projectStorage");

$( function() {
  $( "#datepicker" ).datepicker();
} );

const handleDelete = (index) => {
  projectStorage.splice(index, 1)
  handleLocalStorage("set", "projectStorage", projectStorage)
  setProjectData();
}

//moment.js function to calculate how many days a date is from now
const calculateDaysUntilDue = (date) => { return moment(date).fromNow(true); }

//moment.js functio to calculate the difference in time and can pass in a type to format it by ie. "days"
const calculateEstTotal = (hourly, date) => { return hourly * (moment(date).diff(moment(), 'days') * 8); }

const setProjectData = () => {

  tableBody.innerHTML = `
  ${projectStorage.slice(0, 5).map((project, index) => `
    <tr key=${index} id=${project.projectName}>
      <th scope="row">${project.projectName}</th>
      <td>${project.projectType}</td>
      <td>${project.hourly}</td>
      <td>${project.date}</td>
      <td>${calculateDaysUntilDue(project.date) || "*calculations*"}</td>
      <td>${calculateEstTotal(project.hourly, project.date) || "*calculations*"}</td>
      <td><button onclick="handleDelete(${index})" class="btn btn-danger">X</button></td>
    </tr>
    `).join("")}
  `
}

projectStorage.length > 0 && setProjectData();

const handleFormSubmit = (event) => {
  event.preventDefault();
  const projectData = {
    projectName: projectName.value,
    projectType: projectType.value,
    hourly: hourlyWage.value,
    date: date.value
  };
  projectStorage.push(projectData);
  handleLocalStorage("set", "projectStorage", projectStorage);

  updateStorage();

  setProjectData();

  const clearValues = () => {
    projectName.value = '';
    projectType.value = '';
    hourlyWage.value = '';
    date.value = '';
  };
  clearValues();

};

document.querySelector("#form-submit").addEventListener("click", function(event){
  event.preventDefault();
  handleFormSubmit(event);
});