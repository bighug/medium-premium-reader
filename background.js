'use strict';
let doReplaceContent = function(tab) {
	chrome.extension.isAllowedIncognitoAccess(function(isAllow){
		let newPageData = {
			url: tab.url,
			incognito: true,
			type: 'panel',
		};
		
		if(!isAllow) {
			newPageData.state = 'maximized';
			newPageData.focused = true;
			chrome.windows.create(newPageData);
		} else {
			newPageData.focused = false;
			newPageData.width = 1;
			newPageData.height = 1;
			newPageData.left = tab.width;
			newPageData.top = tab.height;
			chrome.windows.create(newPageData, function(window){
				if(!window) return;
				chrome.tabs.executeScript(window.tabs[0].id,{
					code: 'document.documentElement.innerHTML;'
				}, (results) => {
					if(results) {
						let newContent = results[0];
						chrome.storage.local.set({ 'rbDocument': newContent }, function(){
							chrome.tabs.executeScript(tab.id,{
								file: 'replaceContent.js'
							});
						});
					}
					chrome.windows.remove(window.id);
				});
			});
		}
	});
};

chrome.webNavigation.onCompleted.addListener(function(details) {
	chrome.extension.isAllowedIncognitoAccess(function(isAllow) {
		if(!isAllow) return;
		chrome.tabs.executeScript(details.tabId, {
			file: 'autoReplace.js'
		}, (results) => {
			if (results) {
				let newContent = results[0];
				newContent = JSON.parse(newContent);
				if (newContent && newContent.rbReplace === true) {
					chrome.tabs.get(details.tabId, function (tab) {
						doReplaceContent(tab);
					});
				}
			}
		});
	});
}, {
	url: [{urlMatches : 'https://*/*'}]
});


chrome.browserAction.onClicked.addListener((tab) => {
	doReplaceContent(tab);
});