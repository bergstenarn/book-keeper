const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameElem = document.getElementById("website-name");
const websiteUrlElem = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show modal and focus on input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameElem.focus();
}

// Modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener(
  "click",
  (e) => e.target === modal && modal.classList.remove("show-modal")
);

// Validate form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(expression)) {
    alert("Please provide a valid web address.");
    return false;
  }
  return true;
}

// Build bookmarks DOM
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.textContent = "";
  // Build items
  Object.keys(bookmarks)
    .sort()
    .forEach((key) => {
      const { name, url } = bookmarks[key];
      // Item
      const item = document.createElement("div");
      item.classList.add("item");
      // Close icon
      const closeIcon = document.createElement("i");
      closeIcon.classList.add("fas", "fa-times");
      closeIcon.setAttribute("title", "Delete Bookmark");
      closeIcon.setAttribute("onclick", `deleteBookmark("${url}")`);
      // Favicon / Link container
      const linkinfo = document.createElement("div");
      linkinfo.classList.add("name");
      // Favicon
      const favicon = document.createElement("img");
      favicon.setAttribute(
        "src",
        `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
      );
      favicon.setAttribute("alt", "Favicon");
      // Link
      const link = document.createElement("a");
      link.setAttribute("href", `${url}`);
      link.setAttribute("target", "_blank");
      link.textContent = name;
      // Append to bookmarks container
      linkinfo.append(favicon, link);
      item.append(closeIcon, linkinfo);
      bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from local storage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }
  buildBookmarks();
}

// Delete bookmark
function deleteBookmark(url) {
  bookmarks[url] && delete bookmarks[url];
  // Update bookmarks array in local storage and re-populate DOM
  if (Object.keys(bookmarks).length > 0) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    localStorage.removeItem("bookmarks");
  }
  fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameElem.value;
  let urlValue = websiteUrlElem.value;
  if (!urlValue.includes("https//") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameElem.focus();
}

// Event listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();
