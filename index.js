function getGenreList (response){
  console.log(response.genres.length);
  console.log(response.genres);
  for (i=0; i<response.genres.length; i++){
    genreList[i]={id:response.genres[i].id, name:response.genres[i].name};
    genreListIds[i]=response.genres[i].id;
  }
  console.log(genreList)
  console.log(genreListIds)
}
function displayMovieInfo(response){
  console.log(response);
  console.log(response.results[0].genre_ids);
  movieBackground.style.backgroundImage = "url("+baseImageUrl+response.results[0].poster_path+")";
  title.textContent = response.results[0].title;
  poster.src = baseImageUrl+response.results[0].poster_path;
  overview.textContent = response.results[0].overview;
  releaseDate.textContent = response.results[0].release_date;
  for (i=0; i < response.results[0].genre_ids.length; i++){
    let newSPAN = document.createElement("SPAN");
    newSPAN.textContent = "|"+genreList[genreListIds.indexOf(response.results[0].genre_ids[i])].name;
    genres.appendChild(newSPAN);
    console.log(genreList[genreListIds.indexOf(response.results[0].genre_ids[i])].name);
    console.log(response.results[0].genre_ids[i]);
  }
}
function getMovieInfo(){
  //Get Movie Info
  if (movieSearch.value==""){
    movieTitle="harlem nights";
  } else {
    movieTitle=movieSearch.value;
  }
  console.log(movieSearch.value);
  console.log(movieTitle);

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
