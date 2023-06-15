const foodContainer = document.getElementById('food-container');
const categoriesBtn = document.getElementById('categories-btn');
const categoriesHeroBtn = document.getElementById('categories-hero-btn');
const searchBtn = document.getElementById('search-btn');
const arrowBtn = document.getElementById('arrow');
const cheeseBurger = document.getElementById('cheese-burger');
const input = document.getElementById('input');
const favoritesBtn = document.getElementById('favorites-btn');
const mobileBtn = document.getElementById('mobile-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeBtn = document.getElementById('close-btn');

const svg = `<img src="src/images/loader.svg" class="fixed top-[40%] left-[50%] right-[50%] translate-x-[-50%]" alt="">`

let favoriteMeals = []  // LOCAL STORAGE ARRAY WILL GO HERE AND THIS IS THE ARRAY WE CAN MODIFY
let stringFavorites = [] // FAVORITE ITEM WRAP IN HTML TAGS WILL GO HERE

let localStorageBrowser = JSON.parse(localStorage.getItem("Favorites")) // returns an array

// if localStorage is existing
if(localStorageBrowser !== null){
    favoriteMeals = localStorageBrowser
}

// localStorage.removeItem("Favorites")
// =================================================== DATA FETCHERS =================================================
async function getCategoriesData(){
    try{
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        const data = await response.json()
        const array = data.categories
        const categories = array.map(category => {
            return `<div class="flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-300">
                        <div class="relative bg-wood">
                            <img src="${category.strCategoryThumb}" class="w-full" alt="">
                        </div>
                        <div class="p-[0.8rem] lg:p-1 flex flex-col justify-between h-full">
                            <h3 class="text-[1.5rem] lg:text-2xl font-bold text-black">${category.strCategory}</h3>
                            <p class="text-sm lg:text-base text-gray-700">${shortenDescription(category.strCategoryDescription)}</p>
                            <div class="text-center md:text-left"><button class="w-full md:w-fit text-sm md:text-base rounded-lg text-black border-2 border-black font-bold py-[0.5rem] px-1 mt-1 md:mt-2" id="view-category-btn" data-id="${category.strCategory}">View ${category.strCategory} Meals</button></div>

                        </div>
                    </div>`
        }).join("")
        // change html main container to categories
        foodContainer.innerHTML = categories

        // button to show dishes under that category
        const viewCategoryBtn = document.querySelectorAll('#view-category-btn');
            viewCategoryBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    foodContainer.innerHTML = svg
                    getMealsData(btn.dataset.id)    // fetch dishes under that category
                })
        })
    }
    catch(err){
        foodError()
    }


}

async function getMealsData(category){
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        const data = await response.json()
        const array = data.meals
        renderMeals(array, category) // wrap every meals in html tags
}

function renderMeals(array, category){
        const meals = array.map(meal => {
            return `<div class="flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-300 max-h-[21rem] md:max-h-[23rem]">
                        <div class="relative h-11">
                            <img src="${meal.strMealThumb}" class="w-full h-full object-cover" alt="">
                            <button class="rounded-full bg-white w-2.5 h-2.5 absolute top-1 right-1 flex justify-center items-center shadow-md cursor-pointer" id="heart-btn"><i class="fa-solid fa-heart transition-all ease-in-out duration-500 text-gray-300 text-[1.2rem]" data-id="${meal.idMeal}"></i></button>
                        </div>
                        <div class="p-[0.8rem] lg:p-1 flex flex-col justify-between h-full">
                            <h3 class="text-[1rem] md:text-[1.2rem] lg:text-[1.4rem] font-bold text-black">${shortenTitle(meal.strMeal)}</h3>
                            <div class="flex flex-col lg:flex-row justify-center md:justify-between items-center mt-[0.5rem] md:mt-1 gap-[0.3rem] md:gap-0">
                                <small class="block text-base text-gray-500"><i class="fa-regular fa-clock mr-[0.4rem]"></i>30 Minutes</small>
                                <button class="w-full lg:w-fit rounded-lg text-gray-600 border-2 border-gray-600 bg-white py-[0.5rem] px-1 font-bold" id="view-recipe-btn" data-id="${meal.strMeal}">View Recipe</button>
                            </div>
                        </div>
                    </div>`
        }).join("")

        // change html main container to meals under the chosen category
        foodContainer.innerHTML = backBtn(category) + meals

        // ==================================== EVENT LISTENERS IN THE MEALS SECTION =================================
        document.getElementById('back-category-btn').addEventListener('click', () => { // go back to choosing category
            foodContainer.innerHTML = svg
            getCategoriesData()
        })

        // heart button functionality
        const heartBtn = document.querySelectorAll('#heart-btn');
        heartBtn.forEach(btn => {
            // if localstorage is not empty then change the color of the hearts of dishes that exist in local storage
            if(favoriteMeals){
                favoriteMeals.forEach(localitem => {
                    if(localitem === btn.childNodes[0].dataset.id){
                        btn.childNodes[0].classList.add('text-red-500')
                    }
                })
            }
            // button click functionality
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.childNodes[0]
                target.classList.toggle('text-red-500') // toggle heart to be red or not

                if(!favoriteMeals || favoriteMeals.length === 0){   // if localstorage is empty
                    // alert("added to first")
                    favoriteMeals.push(target.dataset.id)   // push immediately
                    localStorage.setItem("Favorites", JSON.stringify(favoriteMeals))    // import to localStorage
                }
                else{  // if localstorage is not empty
                    for(let i = 0; i < favoriteMeals.length; i++){
                        let localitem = favoriteMeals[i]
                        // console.log(localitem," with ", target.dataset.id)
                        if(localitem === target.dataset.id){      // check whether the item that is clicking exist
                            favoriteMeals.splice(i,1)              // remove the item from the favorites
                            // alert("existing")
                            localStorage.removeItem('Favorites')
                            localStorage.setItem("Favorites", JSON.stringify(favoriteMeals))  // update the favorites
                            stringFavorites = []    // remove favorites that wraps with html tags
                            return
                        }
                    }
                    // alert("added to favorites list")
                    favoriteMeals.push(target.dataset.id)   // if not exist, just add to favorites immediately
                    localStorage.setItem("Favorites", JSON.stringify(favoriteMeals))    // update the favorites
                }
            })
        })

        // view recipe button functionality
        const viewRecipeBtn = document.querySelectorAll('#view-recipe-btn');
        viewRecipeBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                foodContainer.innerHTML = svg
                getRecipeData(btn.dataset.id)
            })
        })
        scrollToTop()
}

async function getRecipeData(meal) {
    try{
        const response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${meal}`)
        const data = await response.json()
        const object = data.meals[0]

        // change html main container to recipes of the chosen meal
        foodContainer.innerHTML = `<button class="rounded-full bg-white shadow-lg cursor-pointer border border-gray-200 w-3 h-3 absolute top-0 left-1 lg:left-0 flex justify-center items-center" id="back-meals-btn"><i class="fa-solid fa-arrow-left text-black"></i></button>
        <div class="col-span-4 flex flex-col gap-1 lg:gap-3">
            <div class="rounded-2xl shadow-xl pt-2 p-1 lg:p-3 leading-[3rem] border border-gray-200" >
                <h1 class="text-3xl lg:text-4xl font-bold text-lightBrown">${object.strMeal}</h1>
                <p class="text-[1.3rem] lg:text-2xl leading-[2rem] lg:leading-[3rem] tracking-wide text-navyBlue">
                    Meal originated from ${object.strArea} folks
                </p>
                <div class="w-full h-[18rem] lg:h-[25rem] mt-2 mb-2 lg:mb-4 bg-black rounded-tr-[5rem] rounded-bl-[5rem] rounded-3xl overflow-hidden">
                    <img src="${object.strMealThumb}" class="w-full h-full object-cover opacity-80" alt="">
                </div>
                <hr>
                <div class="my-2 lg:my-4">
                    <h2 class="text-center text-2xl lg:text-3xl font-bold">Ingredients</h2>
                    <ul class="w-3/5 mx-auto mt-2 lg:mt-3 flex flex-col md:flex-row gap-[0.5rem] md:gap-2 md:flex-wrap list-disc text-xl">
                        ${renderIngredients(object)}
                    </ul>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-[0.5rem] lg:gap-2 mt-3">
                <h2 class="text-center text-2xl lg:text-3xl font-bold col-span-1 lg:col-span-4 mb-1">Instructions</h2>
                    ${renderInstructions(object.strInstructions)}
            </div>
            <div class="mt-3 p-0 md:p-2">
                <h2 class="text-center text-2xl lg:text-3xl font-bold">Video Tutorial</h2>
                <iframe class="w-full h-[23rem] lg:h-[35rem] my-2 md:my-3 rounded-2xl" src="https://www.youtube.com/embed/${getEmbeddedCode(object.strYoutube)}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>`

        // button to go back to meals under that category
        document.getElementById('back-meals-btn').addEventListener('click', () => {
            foodContainer.innerHTML = svg
            getMealsData(object.strCategory)
        })
        scrollToTop()

    }
    catch(err){
        foodError()
    }
}

// =================================================== EVENT LISTENERS =============================================

searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    foodContainer.innerHTML = svg
    if(input.value === ""){
        foodMissing()
    }
    else{
        getRecipeData(input.value)
        input.value = ""
    }

})
// category btn on navigation
categoriesBtn.addEventListener('click', () => {
    foodContainer.innerHTML = svg
    getCategoriesData()
})

// category btn in home page
categoriesHeroBtn.addEventListener('click', () => {
    foodContainer.innerHTML = svg
    getCategoriesData()
})

// cheese burger on home page
cheeseBurger.addEventListener('click', () => {
    foodContainer.innerHTML = svg
    getRecipeData('Big Mac')
    scrollToTop()
})

// arrow on homepage
arrowBtn.addEventListener('click', () => {
    input.focus();
});

// mobile nav burger menu
mobileBtn.addEventListener("click", ()=> {
    mobileNav.classList.toggle("translate-y-[20rem]")
    mobileNav.classList.toggle("translate-y-0")
})
closeBtn.addEventListener("click", ()=> {
    mobileNav.classList.add("translate-y-[20rem]")
    mobileNav.classList.remove("translate-y-0")
})

// ======================================================== FAVORITES FUNCTION =========================================
favoritesBtn.addEventListener('click', () =>{
    foodContainer.innerHTML = svg
    getFavoritesData()
})

function  getFavoritesData(){

    if(!favoriteMeals || favoriteMeals.length === 0){   // if favorites container is empty
        favoriteError()
    }
    else{
        const length = favoriteMeals.length

        favoriteMeals .forEach(async (localitem) => {
            const response = await fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${localitem}`)
            const data = await response.json()
            const meal = data.meals[0]
            renderFavoriteMeal(meal,length)
        })
    }
}

function renderFavoriteMeal(meal,length){

    const meals =  `<div class="flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-300 max-h-[21rem] md:max-h-[23rem]">
                    <div class="relative h-11">
                        <img src="${meal.strMealThumb}" class="w-full h-full object-cover" alt="">
                        <button class="rounded-full bg-white w-2.5 h-2.5 absolute top-1 right-1 flex justify-center items-center shadow-md cursor-pointer" id="heart-btn"><i class="fa-solid fa-heart transition-all ease-in-out duration-500 text-red-500 text-[1.2rem]" data-id="${meal.idMeal}"></i></button>
                    </div>
                    <div class="p-[0.8rem] lg:p-1 flex flex-col justify-between h-full">
                        <h3 class="text-[1rem] md:text-[1.2rem] lg:text-[1.4rem] font-bold text-black">${shortenTitle(meal.strMeal)}</h3>
                        <div class="flex flex-col lg:flex-row justify-center md:justify-between items-center mt-[0.5rem] md:mt-1 gap-[0.3rem] md:gap-0">
                            <small class="block text-base text-gray-500"><i class="fa-regular fa-clock mr-[0.4rem]"></i>30 Minutes</small>
                            <button class="w-full lg:w-fit rounded-lg text-gray-600 border-2 border-gray-600 bg-white py-[0.5rem] px-1 font-bold" id="view-recipe-btn" data-id="${meal.strMeal}">View Recipe</button>
                        </div>
                    </div>
                </div>`

                stringFavorites.push(meals) // push favorites that wrap in html tags
                let set = new Set(stringFavorites)  // filter string favorites to have no duplicates

                if(set.size === length){    // if string favorites is equal to number of favorites
                    foodContainer.innerHTML = [...set].join("") // change the main container to favorites
                }

                // heart btn functionality on favorite meals
                const heartBtn = document.querySelectorAll('#heart-btn');
                heartBtn.forEach(btn => {
                    btn.addEventListener('click', (e) => {      // function just to remove the meal from favorites
                        const target = e.currentTarget.childNodes[0]
                        target.classList.remove('text-red-500') // remove red button
                        target.classList.add('text-gray-300')
                        for(let i = 0; i < favoriteMeals.length; i++){
                            if(favoriteMeals[i] === target.dataset.id){     // condition to check where the btn belongs to
                                favoriteMeals.splice(i,1)   // remove the meal from favorites
                                localStorage.removeItem('Favorites')
                                localStorage.setItem("Favorites", JSON.stringify(favoriteMeals))    // update localStorage
                                getFavoritesData()  // re render the html main container
                                stringFavorites = []    // remove favorites that wraps with html tags
                            }
                        }
                    })
                })
                // view recipe of the chosen favorite meal
                const viewRecipeBtn = document.querySelectorAll('#view-recipe-btn');
                viewRecipeBtn.forEach(btn => {
                    btn.addEventListener('click', () => {
                        foodContainer.innerHTML = svg
                        getRecipeData(btn.dataset.id)
                    })
                })
                scrollToTop()
}
// ===================================================================================================================


// =================================================== HELPER FUNCTIONS =============================================

function shortenDescription(description){   // for categories description
    newDesc = ""
    for(let i = 0; i < description.length; i++){
        if(description[i] == "." || description[i] == ";"){
            return newDesc + "."
        }
        newDesc += description[i]
    }
    return description + "."
}

function shortenTitle(title){   // for meals title
    const arrayTitle = title.split(" ")

    for(let i = 0; i < arrayTitle.length; i++){
        if(arrayTitle[i].toLowerCase() == 'with'){
            return arrayTitle.slice(0, i).join(" ")
        }
    }
    return title
}

function renderIngredients(data){   // for recipe data
    let count = 1;
    let ingredients = []

    for(item in data){
        if(item.startsWith("strIngredient") && data[item]){
            ingredients.push(`<li class="text-[0.9rem] lg:text-base"><strong class="text-red-700">${data['strMeasure'+ count]}</strong> ${data[item]}</li>`)
            count++;
        }
    }
    return ingredients.join("")
}

function renderInstructions(data){ // for recipe data
    let period = 0;
    let str = ""
    let steps = []
    // function to arrange the steps equally for every step container
    for(let i = 0; i < data.length; i++){
        if(i > 5 && !isNaN(Number(data[i])) && data[i+1] === "."){
            // console.log("Step:"+ (steps.length+1) + "Number:" + data[i])
            if(Number(data[i]) !== (steps.length+2)){
                i += 2
            }
            else{
                steps.push(`<div class="rounded-2xl shadow-xl p-1 lg:p-2 bg-wood text-white h-fit lg:h-full w-full">
                            <h4 class="text-[1.3rem] md:text-[1.5rem] lg:text-2xl font-bold mb-[0.7rem] lg:mb-1">Step ${steps.length+1}</h4>
                            <p>${str}</p>
                        </div>`)
                str = ""
                period = 0;
            }

        }
        if(period == 2 && str.length >= 100 && isNaN(Number(data[i])) && data[i+1] !== "."){
            steps.push(`<div class="rounded-2xl shadow-xl p-1 lg:p-2 bg-wood text-white h-fit lg:h-full w-full">
                        <h4 class="text-[1.3rem] md:text-[1.5rem] lg:text-2xl font-bold mb-[0.7rem] lg:mb-1">Step ${steps.length+1}</h4>
                        <p>${str}</p>
                    </div>`)
            period = 0;
            str = ""
        }
        else if((period == 2 && str.length < 100) || (data[i] === "s" && data[i+1] === "p" && data[i+2] === ".") || (data[i] === "o" && data[i+1] === "z" && data[i+2] === ".")){
            period--
        }
        else if(period !== 2 && data[i] == "."){
            period++
        }
        str += data[i]
    }
    return steps.join("")
}

function getEmbeddedCode(link){     // for youtube link on recipe data
    let code = ""

    for(let i=link.length-1; i >= 0; i--){
        if(link[i] == "="){
            return code.split("").reverse().join("")
        }
        code+=link[i]
    }
}

// ==================================== ERRORS RENDERING =================================
function foodError(){
    foodContainer.innerHTML = `<p class="absolute top-[30%] left-[50%] right-[50%] translate-x-[-50%] text-gray-400 text-[1.6rem] md:text-2xl font-semibold block w-full text-center">The food you are craving cannot be found.</p>`
}
function foodMissing(){
    foodContainer.innerHTML = `<p class="absolute top-[30%] left-[50%] right-[50%] translate-x-[-50%] text-gray-400 text-[1.6rem] md:text-2xl font-semibold block w-full text-center">The search bar is empty.</p>`
}
function favoriteError(){
    foodContainer.innerHTML = `<p class="absolute top-[30%] left-[50%] right-[50%] translate-x-[-50%] text-gray-400 text-[1.6rem] md:text-2xl font-semibold block w-full text-center">Your favorite foods is empty.</p>`
}

// ==================================== BACK BTN FOR CATEGORY THAT WAS CHOSEN =================================
function backBtn(category){
    return `<button class="rounded-full bg-white shadow-lg cursor-pointer border border-gray-200 px-1 h-3 absolute top-0 lg:left-0 left-1 flex justify-center items-center gap-[0.5rem]" id="back-category-btn"><i class="fa-solid fa-arrow-left text-black"></i><span class="font-semibold">${category} Category</span></button>`
}
// scrolls to top
function scrollToTop(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
