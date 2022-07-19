let news = [];
let url;
let page = 1;
let total_pages = 0;

let menus = document.querySelectorAll(".menus button");
let sideMenu = document.querySelectorAll(".side-menu-list button");

let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

menus.forEach((menu) =>
    menu.addEventListener("click", (event) => getNewsByTopic(event))
);

sideMenu.forEach((menu) =>
    menu.addEventListener("click", (event) => getNewsByTopic(event))
);

const getNews = async () => {
    try {
        let header = new Headers({
            "x-api-key": "BjcEqRCWS06o_pRLB09Ev4NJQeaxp-NuVOlKO1un07I",
        });
        url.searchParams.set("page", page);
        let response = await fetch(url, { headers: header });
        let data = await response.json();
        if (response.status == 200) {
            console.log(data);
            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.");
            }
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pagenation();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
        console.log("잡힌 에러는", error.message);
    }
};

const getLatestNews = async () => {
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
    );
    getNews();
};

const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLocaleLowerCase();

    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
    );
    page = 1;
    getNews();
};

const getNewsBySearch = async () => {
    let keyword = searchInput.value;

    url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
    );
    page = 1;
    getNews();
};

const render = () => {
    let newsHTML = "";
    newsHTML = news
        .map((item) => {
            return `<a href="${item.link}" class="row news">
        <div class="col-lg-4">
            <div class="news-img-size" style="background-image: url('${
                item.media ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            }');"></div>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${
                item.summary == null || item.summary == ""
                    ? "내용없음"
                    : item.summary.length > 200
                    ? item.summary.substring(0, 200) + "..."
                    : item.summary
            }</p>
            <div>${item.rights || "no source"} * ${moment(
                item.published_date
            ).fromNow()}</div>
        </div>
    </a>`;
        })
        .join("");

    document.getElementById("news-board").innerHTML = newsHTML;
};

//메뉴
const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
};

//검색창
const openSearchBox = () => {
    let inputEl = document.getElementById("input-area");
    if (inputEl.style.display == "inline") {
        inputEl.style.display = "none";
    } else {
        inputEl.style.display = "inline";
    }
};

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
    let pagenationHTML = ``;
    let pageGroup = Math.ceil(page / 5);
    let last = pageGroup * 5;
    if (last > total_pages){
        last = total_pages;
    }
    let first = last - 4<=1?1:last-4;

    pagenationHTML = pageGroup==1?``:`<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${1})">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`

    for (let i = first; i <= last; i++) {
        pagenationHTML += `<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick = "moveToPage(${i})">${i}</a></li>`;
    }

    pagenationHTML += pageGroup==Math.ceil(total_pages/5)?``:`<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
  <li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`

    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
    page = pageNum;
    console.log(page);
    getNews();
};

searchButton.addEventListener("click", getNewsBySearch);
searchInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        getNewsBySearch();
    }
});
getLatestNews();
