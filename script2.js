// ---------- GLOBAL VARIABLES ----------
let companies = JSON.parse(localStorage.getItem("companies")) || [];
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editingCompanyId = null;
let editingEmployeeId = null;
let currentCompanyId = null;

// ---------- SKILLS OPTIONS ----------
const skillOptions = [
  "Java",
  "Angular",
  "CSS",
  "HTML",
  "JavaScript",
  "UI",
  "SQL",
  "React",
  "PHP",
  "GIT",
  "AWS",
  "Python",
  "Django",
  "C",
  "C++",
  "C#",
  "Unity",
  "R",
  "AI",
  "NLP",
  "Photoshop",
  "Node.js",
];

// ---------- PAGE NAVIGATION ----------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  document.getElementById(pageId).style.display = "block";
}

// ---------- MESSAGE ----------
function showMessage(elementId, msg) {
  const div = document.getElementById(elementId);
  div.innerText = msg;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 3000);
}

// ---------- COMPANY FUNCTIONS ----------
function saveCompany(company) {
  if (editingCompanyId) {
    companies = companies.map((c) =>
      c.id === editingCompanyId ? { ...c, ...company } : c
    );
    showMessage(
      "companyFormMessage",
      `Company "${company.name}" updated successfully!`
    );
    editingCompanyId = null;
  } else {
    company.id = Date.now();
    company.createdAt = new Date().toLocaleString();
    companies.push(company);
    showMessage(
      "companyFormMessage",
      `Company "${company.name}" added successfully!`
    );
  }
  localStorage.setItem("companies", JSON.stringify(companies));
  displayCompanies();
}

function displayCompanies() {
  const tbody = document.querySelector("#companyTable tbody");
  tbody.innerHTML = "";
  companies.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>
                <i class="fa fa-edit icon-btn" onclick='editCompany(${c.id})'></i>
                <i class="fa fa-trash icon-btn" onclick='deleteCompany(${c.id})'></i>
                <i class="fa fa-users icon-btn" onclick='viewEmployees(${c.id})'></i>
            </td>`;
    tbody.appendChild(tr);
  });
}

function editCompany(id) {
  const c = companies.find((c) => c.id === id);
  const form = document.getElementById("formCompany");
  form.name.value = c.name;
  form.address.value = c.address;
  form.email.value = c.email;
  form.phone.value = c.phone;
  editingCompanyId = id;
  showPage("companyForm");
}

function deleteCompany(id) {
  const c = companies.find((c) => c.id === id);
  if (!confirm(`Are you sure you want to delete "${c.name}"?`)) return;
  companies = companies.filter((c) => c.id !== id);
  employees = employees.filter((e) => e.companyId !== id);
  localStorage.setItem("companies", JSON.stringify(companies));
  localStorage.setItem("employees", JSON.stringify(employees));
  displayCompanies();
  showMessage("companyMessage", `Company "${c.name}" deleted successfully!`);
}

// ---------- EMPLOYEE FUNCTIONS ----------
function saveEmployee(emp) {
  // collect skills
  const skillDivs = document.querySelectorAll("#skillsContainer .skill-block");
  emp.skills = Array.from(skillDivs).map((div) => ({
    name: div.querySelector(".skillName").value,
    rating: div.querySelector(".skillRating").value,
  }));

  // collect education
  const eduDivs = document.querySelectorAll(
    "#educationContainer .education-block"
  );
  emp.education = Array.from(eduDivs).map((div) => ({
    school: div.querySelector(".eduSchool").value,
    course: div.querySelector(".eduCourse").value,
    completed: div.querySelector(".eduCompleted").value,
  }));

  if (editingEmployeeId) {
    employees = employees.map((e) =>
      e.id === editingEmployeeId ? { ...e, ...emp } : e
    );
    showMessage(
      "employeeFormMessage",
      `Employee "${emp.name}" updated successfully!`
    );
    editingEmployeeId = null;
  } else {
    emp.id = Date.now();
    emp.createdAt = new Date().toLocaleString();
    employees.push(emp);
    showMessage(
      "employeeFormMessage",
      `Employee "${emp.name}" added successfully!`
    );
  }
  localStorage.setItem("employees", JSON.stringify(employees));
  viewEmployees(emp.companyId);
}

function displayEmployees(companyId) {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  const list = employees.filter((e) => e.companyId === companyId);

  list.forEach((e) => {
    const skillList =
      e.skills?.map((s) => `${s.name}(${s.rating})`).join(", ") || "-";
    const eduList =
      e.education
        ?.map((ed) => `${ed.course} @ ${ed.school} (${ed.completed})`)
        .join("; ") || "-";

    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${e.name}</td>
            <td>${e.designation}</td>
            <td>${e.email}</td>
            <td>${e.phone}</td>
            <td>${skillList}</td>
            <td>${eduList}</td>
            <td>
                <i class="fa fa-edit icon-btn" onclick='editEmployee(${e.id})'></i>
                <i class="fa fa-trash icon-btn" onclick='deleteEmployee(${e.id})'></i>
            </td>`;
    tbody.appendChild(tr);
  });
}

function viewEmployees(companyId) {
  currentCompanyId = companyId;
  const company = companies.find((c) => c.id === companyId);
  document.getElementById("employeeCompanyName").innerText = company.name;
  showPage("employeeList");
  displayEmployees(companyId);
}

function editEmployee(id) {
  const e = employees.find((emp) => emp.id === id);
  const form = document.getElementById("formEmployee");
  form.name.value = e.name;
  form.designation.value = e.designation;
  form.join_date.value = e.join_date;
  form.email.value = e.email;
  form.phone.value = e.phone;

  // Clear previous skill/edu blocks
  document.getElementById("skillsContainer").innerHTML = "";
  document.getElementById("educationContainer").innerHTML = "";

  // Load saved skills & education
  e.skills?.forEach((s) => addSkill(s));
  e.education?.forEach((ed) => addEducation(ed));

  editingEmployeeId = id;
  showPage("employeeForm");
}

function deleteEmployee(id) {
  const e = employees.find((emp) => emp.id === id);
  if (!confirm(`Are you sure you want to delete "${e.name}"?`)) return;
  employees = employees.filter((emp) => emp.id !== id);
  localStorage.setItem("employees", JSON.stringify(employees));
  displayEmployees(e.companyId);
  showMessage("employeeMessage", `Employee "${e.name}" deleted successfully!`);
}

// ---------- SKILLS & EDUCATION BLOCKS ----------
function addSkill(skill = { name: "", rating: 1 }) {
  const container = document.getElementById("skillsContainer");
  const div = document.createElement("div");
  div.className = "skill-block";
  div.innerHTML = `
        <select class="skillName" required>
            ${skillOptions
              .map(
                (s) =>
                  `<option value="${s}" ${
                    s === skill.name ? "selected" : ""
                  }>${s}</option>`
              )
              .join("")}
        </select>
        <input type="number" class="skillRating" min="1" max="5" value="${
          skill.rating
        }" required/>
        <button type="button" onclick="this.parentElement.remove()">X</button>
    `;
  container.appendChild(div);
}

function addEducation(edu = { school: "", course: "", completed: "" }) {
  const container = document.getElementById("educationContainer");
  const div = document.createElement("div");
  div.className = "education-block";
  div.innerHTML = `
        <input type="text" class="eduSchool" placeholder="School/College" value="${edu.school}" required maxlength="50"/>
        <input type="text" class="eduCourse" placeholder="Course" value="${edu.course}" required maxlength="25"/>
        <input type="text" class="eduCompleted" placeholder="Completed (e.g., Mar 2021)" value="${edu.completed}" required/>
        <button type="button" onclick="this.parentElement.remove()">X</button>
    `;
  container.appendChild(div);
}

// ---------- FORM SUBMISSIONS ----------
document.getElementById("formCompany").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  saveCompany({
    name: form.name.value,
    address: form.address.value,
    email: form.email.value,
    phone: form.phone.value,
  });
  form.reset();
  showPage("companyList");
});

document.getElementById("formEmployee").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  saveEmployee({
    companyId: currentCompanyId,
    name: form.name.value,
    designation: form.designation.value,
    join_date: form.join_date.value,
    email: form.email.value,
    phone: form.phone.value,
  });
  form.reset();
  viewEmployees(currentCompanyId);
});

// ---------- INITIAL LOAD ----------
displayCompanies();
