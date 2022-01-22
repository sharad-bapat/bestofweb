$("#button-Search").on("click", function (e) {
    e.preventDefault;
    var q = $.trim($("#input-Search").val())
    urls = [
        `https://public-api.wordpress.com/rest/v1.2/read/search?http_envelope=1&sort=relevance&q=${q}&number=20`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=20&exclude_followed=false&sort=relevance&&number=20`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=40&exclude_followed=false&sort=relevance&&number=20`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=60&exclude_followed=false&sort=relevance&&number=20`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=80&exclude_followed=false&sort=relevance&&number=20`,
    ]
    async.map(urls, getJSON)
        .then(result => {
            $.each(result, function (k, v) {
                populatePosts(v);
            })
        }).catch(err => {
            console.log(err);
        });
})

async function getJSON(url) {
    try {
        const response = await fetch(url);       
        return response.json()
    } catch (err) {
        console.log(err);
        return {};
    }   
}

function populate(data) {    
    $("#bowHome").html(``);
    if(data.code==200){
        if(data.body.feeds.length>0){
            $.each(data.body.feeds, function (k, item) {
                if(!item.URL.includes("wordpress.com")){
                    const {hostname} = new URL(item.URL)
                    var $listItem = $(`                    
                    <li class="list-group-item border-bottom py-1 bg-light mb-1" style="cursor:pointer">  
                        <div class="card bg-light border-0">
                            <div class="row g-0">
                                <div class="d-flex gap-2 w-100 justify-content-between">                                   
                                    <div class="col mt-3 ms-2">
                                        <h6 class="mb-0 mt-0 fw-bold">${item.title}</h6> 
                                        <p class="small">Subscribers: ${item.subscribers_count}</p>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-double-right text-main" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    `);                                         
                $("#bowHome").append($listItem);
                $listItem.on("click", function (e) {
                    fetchURL(`https://public-api.wordpress.com/rest/v1.2/sites/${item.blog_ID}/posts?http_envelope=1&number=20&offset=1`);                  
                });
                }
            });
            // fetchURL(`https://public-api.wordpress.com/rest/v1.2/sites/${data.body.feeds[0].blog_ID}/posts?http_envelope=1&number=1`);            
        } 
        else{
            var $listItem = $(`
            <li class="list-group-item border-bottom bg-light py-3 mb-1 fw-bold">
                    No posts on this site
            </li>                              
            `);       
             $("#bow").append($listItem);
        }     
    } 
    else{
        var $listItem = $(`
        <li class="list-group-item border-bottom bg-light py-3 mb-1">
                ${data.body.message};
        </li>                              
        `);       
        $("#bow").append($listItem);
    } 
 
}

async function fetchURL(url) {
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    populatePosts(data);    
}
function populatePosts(data) {
    $("#bowPosts").html(``);
    $("#bowPost").html(``);
    if(data.code==200){
        if(data.body.posts.length>0){
            $.each(data.body.posts, function (k, item) {
                var {hostname} = new URL(item.URL)
                var $listItem = $(`
                <li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                    <div class="row">                    
                        <div class="col-12">
                            <p class="small mb-0">${hostname}</p>
                            <p class="small mb-1">${new Date(item.date.toString()).toLocaleString()}</p>
                            <h5 class="mb-0 mt-0" style="line-height: 1.05; font-weight: 500;">${item.title}</h5>                                            
                        </div>                   
                    </div>
                </li>                              
                `);
                $listItem.on("click", function (e) {
                    populateDetails(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                $("#bowPosts").append($listItem);
            });
            // populateDetails(data.body.posts[0])
        } else{
            var $listItem = $(`
            <li class="list-group-item border-bottom bg-light py-3 mb-1 fw-bold">
                    No posts on this site
            </li>                              
            `);
        $("#bowPosts").append($listItem);
        }     
    } 
    else{
        var $listItem = $(`
        <li class="list-group-item border-bottom bg-light py-3 mb-1">
                ${data.body.message};
        </li>                              
        `);
       
        $("#bowPosts").append($listItem);
    }   
  
    
    
}

function populateDetails(v) {
    console.log(v);
    $("#bowPost").html(``);
    var $listItem = $(`
                    <li class="list-group-item border-bottom bg-light py-4 mb-1">
                        <div class="row">                    
                            <div class="col-12">                                
                                <p class="small">${new Date(v.date.toString()).toLocaleString()}</p>
                                <h5>${v.title}</h5>
                                <p>${v.content}</p>
                            </div>                   
                        </div>
                    </li>                              
                    `);
    $("#bowPost").append($listItem);
    
}


function imgError(image) {
    $(image).hide();
}