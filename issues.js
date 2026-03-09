const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

document.addEventListener("DOMContentLoaded", () => {
  loadIssues("all");
});

async function loadIssues(type = "all") {

  showLoader(true);

  const res = await fetch(API);
  const data = await res.json();

  let issues = data.data;

  if(type === "open"){
    issues = issues.filter(issue => issue.status === "open");
  }

  if(type === "closed"){
    issues = issues.filter(issue => issue.status === "closed");
  }

  renderIssues(issues);

  showLoader(false);

}

function renderIssues(issues){

  const container = document.getElementById("issuesContainer");
  const count = document.getElementById("issueCount");

  container.innerHTML = "";

  // dynamic issue count
  count.innerText = `${issues.length} Issues`;

  let html = "";

  issues.forEach(issue => {

    const borderColor =
      issue.status === "open"
        ? "border-green-500"
        : "border-purple-500";

    const statusBadge =
      issue.status === "open"
        ? `<span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Open</span>`
        : `<span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Closed</span>`;

    html += `

    <div onclick="openModal(${issue.id})"
    class="bg-white rounded-xl shadow border-t-4 ${borderColor} p-4 cursor-pointer hover:shadow-lg transition">

      <div class="p-2">

        <div class="flex gap-2 mb-2">
          ${statusBadge}

          <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          ${issue.type}
          </span>
        </div>

        <h3 class="font-bold mb-2">${issue.title}</h3>

        <p class="text-gray-500 text-sm mb-3">
        ${issue.description.substring(0,80)}...
        </p>

      </div>

      <div class="p-2">

        <p class="text-xs text-gray-400">
        #${issue.id} by ${issue.author}
        </p>

        <p class="text-xs text-gray-400">
        ${issue.createdAt}
        </p>

      </div>

    </div>

    `;

  });

  container.innerHTML = html;

}

async function searchIssues(){

  const q = document.getElementById("searchInput").value;

  if(!q){
    loadIssues("all");
    return;
  }

  showLoader(true);

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`
  );

  const data = await res.json();

  renderIssues(data.data);

  showLoader(false);

}

async function openModal(id){

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
  );

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
}

function showLoader(show){

  const loader = document.getElementById("loader");

  if(show){
    loader.classList.remove("hidden");
  }else{
    loader.classList.add("hidden");
  }

};