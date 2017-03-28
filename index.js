function getTopGenre(event){
  let genrePressed = event.target.dataset.genreId;
  console.log(event);
  console.log(genrePressed);
  fetch("https://api.themoviedb.org/3/discover/movie?api_key="+api_key+"&with_genres="+genrePressed+"&language=en-US&sort_by=popularity.desc")
  .then(movieInfo => movieInfo.json())
  .then(displayMovieInfo);
}
function getGenreList (response){
  console.log(response.genres.length);
  console.log(response.genres);
  for (i=0; i<response.genres.length; i++){
    genreList[i]={id:response.genres[i].id, name:response.genres[i].name};
    genreListIds[i]=response.genres[i].id;
    let newSPAN = document.createElement("BUTTON");
    newSPAN.textContent = response.genres[i].name;
    newSPAN.dataset.genreId = response.genres[i].id;
    newSPAN.className = "genreButton";
    genreSection.appendChild(newSPAN);
  }
  let buttons = document.querySelectorAll(".genreButton");
  for (i=0; i<buttons.length; i++){
    let button = buttons[i];
    button.addEventListener("click", getTopGenre);
  }
}
function displayMovieInfo(response){
  //Remove previous genre listings.
  while (genres.hasChildNodes()){
    genres.removeChild(genres.firstChild);
  }
  console.log(response);
  console.log(response.results[0].genre_ids);
  movieBackground.style.backgroundImage = "url("+baseImageUrl+response.results[0].poster_path+")";
  title.textContent = response.results[0].title;
  poster.src = baseImageUrl+response.results[0].poster_path;
  overview.textContent = response.results[0].overview;
  releaseDate.textContent = response.results[0].release_date;
  for (i=0; i < response.results[0].genre_ids.length; i++){
    let newSPAN = document.createElement("SPAN");
    newSPAN.textContent = "√"+genreList[genreListIds.indexOf(response.results[0].genre_ids[i])].name;
    genres.appendChild(newSPAN);
  }
}
function getMovieInfo(){
  //Get Movie Info
  if (movieSearch.value==""){
    movieTitle="harlem nights";
  } else {
    movieTitle=movieSearch.value;
  }
  fetch("https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+movieTitle)
  .then(movieInfo => movieInfo.json())
  .then(displayMovieInfo);
}
let baseImageUrl = "https://image.tmdb.org/t/p/w500";
let movieBackground = document.querySelector("#movieBackground");
let poster = document.querySelector("#poster");
let title = document.querySelector("#title");
let overview = document.querySelector("#overview");
let releaseDate = document.querySelector("#releaseDate");
let genres = document.querySelector("#genres");
let genreSection = document.querySelector("#genreSection");
let genreList = [];
let genreListIds = [];
let movieTitle = "harlem nights";
let startSearch = document.querySelector("#startSearch");
let movieSearch = document.querySelector("#movieSearch");
startSearch.addEventListener("click", getMovieInfo);
//Get Genre List
fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+api_key+"&language=en-US")
.then(genreList => genreList.json())
.then(getGenreList);
getMovieInfo();
