const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

async function loadIssues(type = "all") {

  showLoader(true)

  const res = await fetch(API);
  const data = await res.json();

  let issues = data.data;

  if(type === "open"){
    issues = issues.filter(i => i.status === "open")
  }

  if(type === "closed"){
    issues = issues.filter(i => i.status === "closed")
  }

  renderIssues(issues)

  showLoader(false)

}

document.addEventListener("DOMContentLoaded", () => {
  loadIssues("all");
});

function renderIssues(issues){

const container = document.getElementById("issuesContainer");

container.innerHTML = "";

issues.forEach(issue=>{

const borderColor = issue.status === "open"
? "border-green-500"
: "border-purple-500";

container.innerHTML += `

<div onclick="openModal(${issue.id})"
class="bg-white rounded-xl shadow border-t-4 ${borderColor} p-4 cursor-pointer">

<h3 class="font-bold mb-2">${issue.title}</h3>

<p class="text-gray-500 text-sm mb-3">
${issue.description.substring(0,80)}...
</p>

<div class="flex gap-2 mb-3">

<span class="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
${issue.type}
</span>

</div>

<p class="text-xs text-gray-400">
#${issue.id} by ${issue.author}
</p>

<p class="text-xs text-gray-400">
${issue.createdAt}
</p>

</div>

`

})

};

async function searchIssues(){

const q = document.getElementById("searchInput").value;

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`
);

const data = await res.json();

renderIssues(data.data);

};

async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
)

const data = await res.json();
const issue = data.data;

document.getElementById("modalTitle").innerText = issue.title;
document.getElementById("modalDesc").innerText = issue.description;
document.getElementById("modalAuthor").innerText = issue.author;
document.getElementById("modalStatus").innerText = issue.status;
document.getElementById("modalPriority").innerText = issue.priority;
document.getElementById("modalDate").innerText = issue.createdAt;

document.getElementById("modal").classList.remove("hidden");

}

function closeModal(){
document.getElementById("modal").classList.add("hidden");
};

function showLoader(show){

const loader = document.getElementById("loader");

if(show) loader.classList.remove("hidden")
else loader.classList.add("hidden")

};