import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { //reference to firebase database
    databaseURL: "https://ig-database-8ad46-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings) //initializes database
const database = getDatabase(app) //sets database for use
const postsInDB = ref(database, "posts") //reference to posts list in database

const avatorDog = document.getElementById("dog")
const avatorFox = document.getElementById("fox")
const avatorCow = document.getElementById("cow")
const postContent= document.getElementById("content")
let postLikes = [0] //stores like count for each post, will not work if empty
let postKeys = ["empty"] //stores key of each post from database, will not work if empty
let count = 0 //used to increase like count on each post
 
const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        ID: "Gogh",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "feeling a bit dizzy right now...",
        likes: 21786,
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        ID: "Courbet",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 7655,
    },
        {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        ID: "Ducreux",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! What are you doing today?? post below!",
        likes: 15201,
    }
]

const postAccessories = [
    {
         like: "/images/icon-heart.png",
         likeClicked: "/images/icon-heart-clicked.png",
         comment: "images/icon-comment.png",
         message: "images/icon-dm.png",
         dog: "images/dog.png",
         fox: "images/fox.png",
         cow: "images/cow.png"     
    }
]
         
//--- start up menu section ---//

    avatorDog.addEventListener("click", function()
    { setProfileIcon(postAccessories[0].dog) } )

    avatorCow.addEventListener("click", function()
    { setProfileIcon(postAccessories[0].cow) } )

    avatorFox.addEventListener("click", function()
    { setProfileIcon(postAccessories[0].fox) } )

    //sets selected avatar icon, visible at top right of screen
    function setProfileIcon(userSelection)
    {
        const iconSelection = document.getElementById("user-icon")
        iconSelection.src = userSelection
        postContent.innerHTML=""
        progressSpinner()
    }

    //circle spinner shown after icon selection
    function progressSpinner()
    {
        postContent.innerHTML = ` <div class="menu-loader"> </div> `
        setTimeout(loadPosts,1000)
    }
    
 // ---------------- //
 
//obtains info on all posts in database, stores key and like count of each post
 onValue(postsInDB, function(snapshot) { 
    let itemsArray = Object.entries(snapshot.val())
    postKeys=[] //arrays must be cleared before filling 
    postLikes=[]
    //traverses each post in database
    for (let i = 0; i < itemsArray.length; i++) { 
        let currentItem = itemsArray[i]
        let currentItemKey = currentItem[0]
        let currentItemValue = currentItem[1] 

        //pushes like count and key of each post to individual array
        postKeys.push(currentItemKey)
        postLikes.push(currentItemValue.likeCount)          
    }
}) 
     
//formats and loads each post to the page
function loadPosts()
{
    postContent.innerHTML=""
    for(let i =0; i < posts.length; i++) {
        
        //allows img src to be dynamically changed when clicked
        let newEl = document.createElement("div")
        newEl.innerHTML= ` <img alt="heart icon" class="post-interaction heartIcon"
                               id="${posts[i].ID}" src="${postAccessories[0].like}"> `
        
        //sets final format of each post
        postContent.innerHTML+= 
        ` 
            <div class= "post-header">
              <img alt="portrait of ${posts[i].name}" class="post-icon" src="${posts[i].avatar}"> 
              <p class="post-upper-text"> <span class="bolded"> ${posts[i].name} </span> 
                 </br> ${posts[i].location}  
              </p>
            </div> 
            
            <div>
              <img alt="portrait of ${posts[i].name}" class="post-portrait" src="${posts[i].post}">
            </div> 
            
            <div class= "post-footer">
              ${newEl.innerHTML}
              <img alt="comment icon" class="post-interaction" src="${postAccessories[0].comment}"> <img alt="dm icon" class="post-interaction" src="${postAccessories[0].message}">   
              <p class= "bolded" id="${posts[i].ID}Likes"> ${postLikes[i]} \t likes </p>
              <p> <span class= "bolded"> ${posts[i].username} </span> ${posts[i].comment}</p>
            </div> 
        `          
    }   
  
        const firstLikeBtn = document.getElementById(posts[0].ID)
        //listens for heart clicks on first post
        firstLikeBtn.addEventListener("click", function (){ heartIconChange(0, firstLikeBtn) })
      
        const secondLikeBtn = document.getElementById(posts[1].ID)
        //listens for heart clicks on second post
        secondLikeBtn.addEventListener("click", function (){ heartIconChange(1, secondLikeBtn) })
    
        const thirdLikeBtn = document.getElementById(posts[2].ID)
        //listens for heart clicks on third post
        thirdLikeBtn.addEventListener("click", function (){ heartIconChange(2, thirdLikeBtn) })
}

//updates like count and heart icon appearance 
function heartIconChange(index, selectedLikeBtn)
{
    const currentItemInDB  = ref(database, ("posts/" + postKeys[index]))
    const currentPostLikes = document.getElementById(`${posts[index].ID}Likes`)
   
        //sets count to current likes for selected post
        count = postLikes[index]
        count++
        currentPostLikes.innerHTML = count + " likes"
        //sets heart icon to clicked appearance
        selectedLikeBtn.src = postAccessories[0].likeClicked
        //waits # of ms, then sets heart icon back to orignal value (before click)     
        setTimeout(() => { selectedLikeBtn.src = postAccessories[0].like}, 100)
        //formats value then updates current post in database with new like count
        let inputValue = { ID: posts[index].ID, likeCount: count }
        update(currentItemInDB, inputValue)  
}