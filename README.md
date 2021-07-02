This text note is for introduce map-demo function and how to handle some errors may occur.
Start:
1. right click the folder and chose visual code or to ther platform to run it
2. open terminal in platform
2. use "yarn start" to run the web on server.

Function:
1. Search:
	a. pick "address" or "latLng" to decide the way you want to search a location
	b. press enter or click search button to search the current input location
	c. the input is initialized as "", the input form for both "address" and "latLng" is showed once input is cleared
	d. search legal location, map will relocate to the searched location and add new mark on map
2. Map:
	a. when initialized, your current spot location and mark is shown on map
	b. the current chosen mark(loaction) is shown as blue, the rest of marks are red, the information of blue mark will be shown in chosen mark
	c. click ringt mouse of marks to will shown 3 button context menu, which are add to favorite, remove from favortite and remove from map.
	d. for add to favorite and remove from favorite button, only one of them will be activate based on whehter current mark is in favorite list.
3.favorite List:
	a. the information of favortie location will be shown in this list
	b. when mouse enter in each item, the background color will change and a delet button will show to delete current location from favorite list
	c. click favorite location item will make map relocate to the clicked favorite location.

Error:
	1. please use "http://localhost:3000"(local) instead of "http://192.168.0.99:3000"(on your network) to use run the web, since for "http://192.168.0.99:3000",
	you may be rejected to access google api.
	2. when you first open the web, the map may not show due to failed to request map from goole, refresh it and the mapp will show correctly
	3. if alert this page can't load google maps correctly, it wont affect the function of web, only will cause the map is covered by develop only, you can refresh
	web to make it show correctly.
