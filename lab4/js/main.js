
var curNumberOfNews = 0;
var lastUsedUrl = "";
var cur_page = 1;

function init_news_source(data){
	for (let i = 0; i < data.sources.length; i++) {
		document.getElementById("view_source_list").innerHTML +=  '<button class="btn_choose_tag" id="' + data.sources[i].id + '">' + data.sources[i].name + '</button><br><br>';
	}
}

function get_news_source(){
	var news_link = "https://newsapi.org/v2/sources?apiKey=a2e47115d1424ba98afeedef8beeed98";
	var request = new Request(news_link);
  	fetch(request)
          .then((response) => { 
              return response.json(); 
            })
          .then((data) => {
             init_news_source(data);     
          });
}

function write_news(data){
	if(data.articles.length == 0){
		document.getElementById("news").innerHTML += 'No news!';
		return;
	}
	for(let i = 0; i < data.articles.length; i++){
		document.getElementById("news").innerHTML += '<a class="news_class" href="' + data.articles[i].url + '">' + data.articles[i].title + '<br>' + 
		(data.articles[i].urlToImage ? ('<img src="' + data.articles[i].urlToImage + '" alt="' + data.articles[i].url + '"/><br>') : "") + '<br></a>'
	}
	
}

function process_with_search(main_url){
 		let newsAPIUrl = 'https://newsapi.org/v2/' + main_url + 'apiKey=a2e47115d1424ba98afeedef8beeed98';
        let request = new Request(newsAPIUrl);
        document.getElementById("news").innerHTML = "";
        fetch(request)
          .then((response) => { 
                return response.json(); 
            })
          .then((data) => {
          	  cur_page = 2;
              write_news(data);
              lastUsedUrl = newsAPIUrl;
          });
}

function add_news(){
		if(cur_page >= 8)
			return;
		var position = lastUsedUrl.indexOf("page=");
		lastUsedUrl = lastUsedUrl.substr(0, position + 5) + cur_page + lastUsedUrl.substr(position + 6, lastUsedUrl.length - 1);
		cur_page++;
        let request = new Request(lastUsedUrl);
        fetch(request)
          .then((response) => { 
              return response.json(); 
            })
          .then((data) => {
              write_news(data);
          });
}

function create_events(){
	document.querySelector('#view_source_list').addEventListener('click', 
    	(event) =>{
            process_with_search(`everything?sources=${event.target.id}&pageSize=5&page=1&`);
        });

    document.querySelector('#load_btn').addEventListener('click', 
    	() => {
            add_news();   
        });

    document.querySelector('#search_field_id').addEventListener('keyup', 
    	(event) => {
              event.preventDefault();
              if (event.keyCode == 13) document.querySelector('#btn_search_id').click();
        });

    document.querySelector('#btn_search_id').addEventListener('click', 
    	() => {
            var request = document.querySelector('#search_field_id').value;
            if(request.length > 0)
                process_with_search(`everything?q=${request}&pageSize=5&page=1&`);	
        });
}

function main(){
	get_news_source();
	create_events();
}

main();


