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
startSearch.addEventListener("click", registerClick);
//Get Genre List
fetch("https://api.themoviedb.org/3/genre/movie/list?api_key="+api_key+"&language=en-US")
.then(genreList => genreList.json())
.then(getGenreList);

getInfo("search/movie","query=harlem nights")
.then(displayMovieInfo);

function registerClick(event){
  if (movieSearch.value==""){
    movieTitle="harlem nights";
  } else {
    movieTitle=movieSearch.value;
  }
  getInfo("search/movie","query="+movieTitle)
  .then(displayMovieInfo);
}
function getTopGenre(event){
  let genrePressed = event.target.dataset.genreId;
  //console.log(event);
  //console.log(genrePressed);
  fetch("https://api.themoviedb.org/3/discover/movie?api_key="+api_key+"&with_genres="+genrePressed+"&language=en-US&sort_by=popularity.desc")
  .then(movieInfo => movieInfo.json())
  .then(displayMovieInfo);
}
function getGenreList (response){
  //console.log(response.genres.length);
  //console.log(response.genres);
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
function getInfo(url, params){
  //Get Movie Info
  //fetch("https://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+movieTitle)
  return fetch("https://api.themoviedb.org/3/"+url+"?api_key="+api_key+"&"+params)
  .then(movieInfo => movieInfo.json());
}
function getMovieInfo(movieObject){
  //console.log(movieObject);
  return getInfo("movie/"+movieObject.id);
}

function getTopGenreInfo(genreId){
  return fetch("https://api.themoviedb.org/3/discover/movie?api_key="+api_key+"&with_genres="+genreId+"&language=en-US&sort_by=popularity.desc")
  .then(movieInfo => movieInfo.json())
}
//1. What is the total budget of the ten most popular movies in the db?
function calculateTotalBudget(movieObject){
  let totalBudget = movieObject.reduce((total, movieObject) => total + movieObject.budget, 0);
  console.log("1. What is the total budget of the ten most popular movies in the db?", totalBudget);
}
getInfo("movie/popular")
.then(object => {
  let top10 = object.results.slice(0,10);
  return top10.map(getMovieInfo);
})
.then(moviePromises => Promise.all(moviePromises))
//.then(object => console.log(object))
.then(calculateTotalBudget)

//2. Which genre has the highest average popularity for its top 20 movies?

//3. Which of the top 20 horror movies have no spoken language besides English?
function filterSpokenLanguage(movieObject){
  //console.log(movieObject)
  let englishOnly = movieObject.filter(object => object.spoken_languages.length == 1 && object.spoken_languages[0].iso_639_1=="en")
  .map(object => object.title)
  console.log("3. Which of the top 20 horror movies have no spoken language besides English?",englishOnly)

}
getTopGenreInfo("27")
.then(object => object.results.map(getMovieInfo))
.then(moviePromises => Promise.all(moviePromises))
.then(filterSpokenLanguage);
//4. Who had the most starring roles in the top 20 comedies?
getTopGenreInfo("35")
.then(object => object.results.map(getMovieInfo))
//.then(moviePromises => Promise.all(moviePromises))
//.then(object => console.log(object))
//.then(object => object.results.map(getMovieInfo))

//5. how many movies have the stars of the most popular movie of last year appeared in? (list each star's name with the number of movies)
function getActorCredits (actorObject){
  console.log(actorObject.name)
  return getInfo("person/"+actorObject.id+"/movie_credits")
}

function getTop5ActorsMovies (actorObject){
  let top5ActorsMovies = actorObject.map(object => [object.cast.length])
  console.log(top5ActorsMovies);
}
getInfo("discover/movie","primary_release_year=2016")
.then(object => getInfo("movie/"+object.results[0].id+"/credits"))
.then(object => {
  let top5cast = object.cast.slice(0,5)
  return top5cast.map(getActorCredits)
})
.then(moviePromises => Promise.all(moviePromises))
.then(getTop5ActorsMovies);
//.then(object => console.log(object));
//.then(object => )
