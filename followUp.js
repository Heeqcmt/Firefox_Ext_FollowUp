
let bookmarkID = new Map();
let lastOpenURL=new Map();
//check if url is in the bookmark
function checkBookmark(tabID,changeInfo,tabInfo){

    console.log(tabInfo.url);
    let searching = browser.bookmarks.search({url: tabInfo.url});
    searching.then(
        bookmarkItem =>{
            if(bookmarkItem.length > 0){
                console.log(bookmarkItem[0].id);
                lastOpenURL.set(tabID,tabInfo.url);
                bookmarkID.set(tabID,bookmarkItem[0].id);
                
            }else{
                console.log("bookmark does not exist")
            }

            if(lastOpenURL.has(tabID)){
                lastOpenURL.set(tabID,tabInfo.url);
            }
            
        }
    );

}

//update bookmark url when tab is closed

function updateBookmark(tabID, removedInfo){
    if(lastOpenURL.has(tabID)){
        browser.bookmarks.update(bookmarkID.get(tabID),{url:lastOpenURL.get(tabID)}).then(
            ()=>{console.log(`${lastOpenURL.get(tabID)}`)},()=>{console.log("error")}
        )
    }
}


browser.tabs.onUpdated.addListener(checkBookmark);
browser.tabs.onRemoved.addListener(updateBookmark);