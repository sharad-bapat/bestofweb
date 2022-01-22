$("#button-Search").on("click", function (e) {
    e.preventDefault;
    var q = $.trim($("#input-Search").val())
    $("#bowPosts").html(`<li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
        <div class="row">                    
            <div class="col-12">
            <div class="d-flex align-items-center">
            <strong>Loading...</strong>
            <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
        </div>                                              
            </div>                   
        </div>
    </li>                              
    `);
    urls = [
        `https://public-api.wordpress.com/rest/v1.1/read/search?http_envelope=1&q=${q}&offset=0&exclude_followed=false&sort=relevance&&number=20&after=20220101`,
        `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=20&exclude_followed=false&sort=relevance&&number=20&after=20220101`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=40&exclude_followed=false&sort=relevance&&number=20&after=20220101`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=60&exclude_followed=false&sort=relevance&&number=20&after=20220101`,
        // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=80&exclude_followed=false&sort=relevance&&number=20&after=20220101`,
    ]
    // urls = [
    //     `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=0&exclude_followed=false&sort=relevance&&number=20`,
    //     // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=20&exclude_followed=false&sort=relevance&&number=20`,
    //     // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=40&exclude_followed=false&sort=relevance&&number=20`,
    //     // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=60&exclude_followed=false&sort=relevance&&number=20`,
    //     // `https://public-api.wordpress.com/rest/v1.1/read/feed?http_envelope=1&q=${q}&offset=80&exclude_followed=false&sort=relevance&&number=20`,
    // ]
    async.map(urls, getJSON)
        .then(result => {
            $.each(result, function (k, v) {
                populate(v);
            })
        }).catch(err => {
            console.log(err);
        });
})
onload();
async function onload(){
    posts = []
    url = "https://public-api.wordpress.com/rest/v1/batch?http_envelope=1&urls[]=/sites/176892389/posts?number=5&urls[]=/sites/171782886/posts?number=1&urls[]=/sites/126020344/posts?number=5&urls[]=/sites/197693856/posts?number=5";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
     if (data.code == 200) {
        for (const [key, value] of Object.entries(data.body)) {
            console.log(key, value);
            $.each(value.posts, function(k,item){ 
                var unixtime = Date.parse(item.date);
                var currTime = Date.now();
                var timediff = Math.round(currTime / 1000 - unixtime / 1000);
                if (timediff / 60 / 60 < 1) {
                    timediff = Math.round(timediff / 60) + " minutes ago";
                } else if (Math.round(timediff / 60 / 60) === 1) {
                    timediff = Math.round(timediff / 60 / 60) + " hour ago";
                } else if (Math.round(timediff / 60 / 60) > 1 && Math.round(timediff / 60 / 60) < 24) {
                    timediff = Math.round(timediff / 60 / 60) + " hours ago";
                } else if (Math.round(timediff / 60 / 60) === 24) {
                    timediff = Math.round(timediff / 60 / 60) + " day ago";
                } else {
                    timediff = Math.round(timediff / 60 / 60 / 24) + " days ago";
                }               
                var { hostname } = new URL(item.URL)
                    var $listItem = $(`
                    <li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                        <div class="row">                    
                            <div class="col-12">
                                <p class="small text-main fw-bold mb-1">${hostname},${timediff}</p>
                                <p class="mb-0 mt-0 fw-bold">${item.title}</p> 
                            </div>                   
                        </div>
                    </li>                              
                    `);
                    $listItem.on("click", function (e) {
                        // console.log(item);
                        $("#modalTitle").html(``);
                        $("#modalBody").html(``);
                        $('#myModal').on('shown.bs.modal', function(){                    
                            $("#modalTitle").html(item.title);
                            $("#modalBody").html(item.content);
                            $('#myModal img').each(function () {
                                $(this).removeAttr('style');
                                $(this).removeAttr('class');
                                $(this).removeAttr('width');
                                $(this).removeAttr('height');
                            });
                        })
                        $('#myModal').modal('show');               
                    });
                    $("#bowPosts").append($listItem);
            })
        }
     }
    
}

function populate(data) {    
    if (data.code == 200) {
        if (data.body.posts.length > 0) {
            $("#bowPosts").html(``);
            $.each(data.body.posts, function (k, item) {
                var unixtime = Date.parse(item.modified);
                var currTime = Date.now();
                var timediff = Math.round(currTime / 1000 - unixtime / 1000);
                if (timediff / 60 / 60 < 1) {
                    timediff = Math.round(timediff / 60) + " minutes ago";
                } else if (Math.round(timediff / 60 / 60) === 1) {
                    timediff = Math.round(timediff / 60 / 60) + " hour ago";
                } else if (Math.round(timediff / 60 / 60) > 1 && Math.round(timediff / 60 / 60) < 24) {
                    timediff = Math.round(timediff / 60 / 60) + " hours ago";
                } else if (Math.round(timediff / 60 / 60) === 24) {
                    timediff = Math.round(timediff / 60 / 60) + " day ago";
                } else {
                    timediff = Math.round(timediff / 60 / 60 / 24) + " days ago";
                }
                var { hostname } = new URL(item.URL)
                var $listItem = $(`
                <li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                    <div class="row">                    
                        <div class="col-12">
                            <p class="small mb-1">${hostname}, ${timediff}</p>
                            <p class="mb-0 mt-0 fw-bold">${item.title}</p> 
                        </div>                   
                    </div>
                </li>                              
                `);
                $listItem.on("click", function (e) {
                    // console.log(item);
                    $("#modalTitle").html(``);
                    $("#modalBody").html(``);
                    $('#myModal').on('shown.bs.modal', function(){                    
                        $("#modalTitle").html(item.title);
                        $("#modalBody").html(item.content);
                        $('#myModal img').each(function () {
                            $(this).removeAttr('style');
                            $(this).removeAttr('class');
                            $(this).removeAttr('width');
                            $(this).removeAttr('height');
                        });
                    })
                    $('#myModal').modal('show');               
                });
                $("#bowPosts").append($listItem);
            });            
        } 
    } 
 
}


// Batch URL

/*

https://public-api.wordpress.com/rest/v1/batch?http_envelope=1&urls[]=/sites/70135762/posts&urls[]=/sites/16518427/posts&urls[]=/sites/166419546/posts&urls[]=/sites/176892389/posts

*/

async function fetchPosts(id) {    
    $("#bowPosts").html(`<li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                            <div class="row">                    
                                <div class="col-12">
                                <div class="d-flex align-items-center">
                                <strong>Loading...</strong>
                                <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                            </div>                                              
                                </div>                   
                            </div>
                        </li>                              
                        `);
    
    
    url = `https://public-api.wordpress.com/rest/v1.2/sites/${id}/posts?http_envelope=1&number=20`    
    console.log(`https://public-api.wordpress.com/rest/v1.2/sites/${id}/posts?http_envelope=1&number=20`);
    const response = await fetch(url);
    const data = await response.json();
    populatePosts(data);    
}

async function fetchWOPosts(id) {   
    $("#bowPosts").html(`<li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                    <div class="row">                    
                        <div class="col-12">
                        <div class="d-flex align-items-center">
                        <strong>Loading...</strong>
                        <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                      </div>                                              
                        </div>                   
                    </div>
                </li>                              
                `);    
    url = `https://${id}/wp-json/wp/v2/posts?per_page=20&context=view`
    console.log(`https://${id}/wp-json/wp/v2/posts?per_page=1&context=view`);
    const response = await fetch(url);
    const data = await response.json();
    populateWOPosts(data);    
}

function populatePosts(data) {
    if (data.code == 200) {
        if (data.body.posts.length > 0) {
            $("#bowPosts").html(``);
            $.each(data.body.posts, function (k, item) {
                var { hostname } = new URL(item.URL)
                var $listItem = $(`
                <li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                    <div class="row">                    
                        <div class="col-12">
                            <p class="small text-main mb-1 fw-bold">${hostname}, ${new Date(item.date.toString()).toLocaleString()}</p>
                            <p class="mb-0 mt-0 fw-bold">${item.title}</p>                                                     
                        </div>                   
                    </div>
                </li>                              
                `);
                $listItem.on("click", function (e) {
                    // console.log(item);
                    $("#modalTitle").html(``);
                    $("#modalBody").html(``);
                    $('#myModal').on('shown.bs.modal', function(){                    
                        $("#modalTitle").html(item.title);
                        $("#modalBody").html(item.content);
                        $('#myModal img').each(function () {
                            $(this).removeAttr('style');
                            $(this).removeAttr('class');
                            $(this).removeAttr('width');
                            $(this).removeAttr('height');
                        });
                    })
                    $('#myModal').modal('show');               
                });
                $("#bowPosts").append($listItem);
            });            
        } 
    }   
}

function populateWOPosts(data) {    
    $("#bowPosts").html(``);
    if(data){
        $.each(data, function (k, item) {           
            var {hostname} = new URL(item.guid.rendered)
            var $listItem = $(`
            <li class="list-group-item border-bottom bg-light py-3 mb-1" style="cursor:pointer">
                <div class="row">                    
                    <div class="col-12">
                        <p class="small mb-1">${hostname}, ${new Date(item.modified_gmt.toString()).toLocaleString()}</p>
                        <p class="mb-0 mt-0 fw-bold">${item.title.rendered}</p>                                                     
                    </div>                   
                </div>
            </li>                              
            `);
            $listItem.on("click", function (e) {
                // console.log(item);
                $("#modalTitle").html(``);
                $("#modalBody").html(``);
                $('#myModal').on('shown.bs.modal', function(){                    
                    $("#modalTitle").html(item.title.rendered);
                    $("#modalBody").html(item.content.rendered);
                    $('#myModal img').each(function () {
                        $(this).removeAttr('style');
                        $(this).removeAttr('class');
                        $(this).removeAttr('width');
                        $(this).removeAttr('height');
                    });
                })
                $('#myModal').modal('show');               
            });
            $("#bowPosts").append($listItem);
        }); 
    }   
   
}

async function getJSON(url) {
    try {
        const response = await fetch(url);       
        return response.json()
    } catch (err) {
        console.log(err);
        return {};
    }   
}

async function fetchURL(url) {
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    populatePosts(data);    
}

function imgError(image) {
    $(image).hide();
}

       
