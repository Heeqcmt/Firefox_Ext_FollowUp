/*
bookmarkID key: tabID value: bookmarkID
lastOpenURL key: tabID value: last open URL
*/
let bookmarkID = new Map();
let lastOpenURL=new Map();
//check if url is in the bookmark
function checkBookmark(tabID,changeInfo,tabInfo){

    console.log(tabInfo.url);
    //check if url of tabID is in the bookmark tree.
    //if url is one of the bookmark, save bookmark id and url along with tabid as keys
    //save the url in every onUpdate calls
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
//check if tab once contains bookmarked content
//if so update the bookmark with current url
//new feature: adding user comfirmation before the update via a notification

function updateBookmark(tabID, removedInfo){

    

    let preUpdateNotification;


    if(lastOpenURL.has(tabID)){
        browser.bookmarks.update(bookmarkID.get(tabID),{url:lastOpenURL.get(tabID)}).then(
            ()=>{console.log(`${lastOpenURL.get(tabID)}`)},()=>{console.log("error")}
        )
        browser.notifications.create(
            preUpdateNotification,
            {
                "type":"basic",
                "message":`bookmark changed to ${lastOpenURL.get(tabID)}`,
                "title":"Follow Up detected a possible bookmark update",
            }
        )
    }
}


browser.tabs.onUpdated.addListener(checkBookmark);
browser.tabs.onRemoved.addListener(updateBookmark);