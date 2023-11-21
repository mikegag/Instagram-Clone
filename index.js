import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { posts, postAccessories } from "/data.js"

const appSettings = { //reference to firebase database
    databaseURL: "https://ig-database-8ad46-default-rtdb.firebaseio.com/"
} 
const app = initializeApp(appSettings) //initializes database
const database = getDatabase(app) //sets database for use
const postsInDB = ref(database, "posts") //reference to posts list in database

const postContent= document.getElementById("content")
let postLikes = [0] //stores like count for each post, will not work if empty
let postKeys = ["empty"] //stores key of each post from database, will not work if empty
 

document.body.addEventListener("click", (e)=> {
    setProfileIcon(e.target)
    heartIconChange(e.target)
})
          
//sets selected avatar icon, visible at top right of screen
function setProfileIcon(userSelection)
{
    if( userSelection.src.includes(postAccessories[0].dog) || 
        userSelection.src.includes(postAccessories[0].fox) ||
        userSelection.src.includes(postAccessories[0].cow) ) {
        
            document.getElementById("user-icon").src = userSelection.src
            postContent.innerHTML=""
            progressSpinner()
    }
}

//circle spinner shown after icon selection
function progressSpinner()
{
    postContent.innerHTML = ` <div class="menu-loader"> </div> `
    setTimeout(loadPosts,1000)
}
    
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
                               id="${posts[i].ID}" src="${postAccessories[0].unclicked}"> `
        
        //sets final format of each post
        postContent.innerHTML+= 
        ` <article class = "post>
            <header class= "post-header">
                <img alt="portrait of ${posts[i].name}" class="post-icon" src="${posts[i].avatar}"> 
                <p class="post-upper-text"> <span class="bolded"> ${posts[i].name} </span> 
                    </br> ${posts[i].location}  
                 </p>
            </header> 

            <div>
                 <img alt="portrait of ${posts[i].name}" class="post-portrait" src="${posts[i].post}">
            </div> 

            <footer class= "post-footer">
                ${newEl.innerHTML}
                <img alt="comment icon" class="post-interaction" src="${postAccessories[0].comment}"> 
                <img alt="dm icon" class="post-interaction" src="${postAccessories[0].message}">   
                <p class= "bolded" id="${posts[i].ID}Likes"> ${postLikes[i]} \t likes </p>
                <p> <span class= "bolded"> ${posts[i].username} </span> ${posts[i].comment}</p>
            </footer> 
          </article>
        `          
    }   
}

//updates like count and heart icon appearance 
function heartIconChange(selectedLikeBtn)
{ 
    //checks if + which heart icon is clicked, then sends data to database for update
    posts.forEach(current => {if (current.ID === selectedLikeBtn.id)  {

        const currentItemInDB  = ref(database, ("posts/" + postKeys[current.index]))
        const currentPostLikes = document.getElementById(`${posts[current.index].ID}Likes`)
        //sets count to current likes for selected post
        let count = postLikes[current.index]
        count++
        currentPostLikes.innerHTML = count + " likes"
        //sets heart icon to clicked and then unclicked appearance
        selectedLikeBtn.src = postAccessories[0].likeClicked   
        setTimeout(() => { selectedLikeBtn.src = postAccessories[0].unclicked}, 180)
        //formats value then updates current post in database with new like count
        let inputValue = { ID: posts[current.index].ID, likeCount: count }
        update(currentItemInDB, inputValue)  
    }
  })
}