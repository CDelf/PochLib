//initialize the app
init();

function init(){
	//getContent('search.html', 'content');
	//Create the "add a book" button to load the research.html page
	const button = document.createElement("div");
	button.innerHTML = '<div id="ajout_livre">'+CreateDivButtonAddBook()+'</div><div style="color: red" id=\'error\'></div>';
	let myBooks = document.getElementById("myBooks");
	var childs = myBooks.childNodes;
	childs[5].appendChild(button);
	//get Google Books API
	getBooksStorageSession("content",true);
}

// Displays the main page
function cancel(){
	document.getElementById("ajout_livre").innerHTML=CreateDivButtonAddBook();
	document.getElementById("searchResult").innerHTML="";
	getBooksStorageSession("content",true);
}

// Creates the 'add a book' button et loads the search form.
function CreateDivButtonAddBook() {
	return '<button id="btn" onclick="getContent(\'research.html\',\'ajout_livre\')">Ajouter un livre</button>';
}

function getContent(template,id) {
	var z, i, elmnt, file, xhttp;
	/* Loop through a collection of all HTML elements: */
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = document.getElementById(id);
		/*search for elements with a certain attribute:*/
		file = template;
		if (file) {
			/* Make an HTTP request using the attribute value as the file name: */
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {elmnt.innerHTML = this.responseText;}
					if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
					/* Remove the attribute, and call this function once more: */
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			/* Exit the function: */
			return;
		}
	}
}

// Using the Google Books API to search
function getBooksApiGoogle(){
	var bookName = document.getElementById("title").value;
	var author = document.getElementById("author").value;
	if(bookName == "" || author == ""){
		var error = document.getElementById("error");
		error.innerHTML = "Renseignez au moins une valeur ('Titre' et 'Auteur')";
		return;
	}
	else{
		var xhttp,xhttp1;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200){
				if(xhttp.responseText != null){
					var jsonResponse = JSON.parse(xhttp.responseText);
					if(jsonResponse.totalItems > 0){
						var books = jsonResponse.items;
						const divSearch = document.createElement("div");
						divSearch.innerHTML = "<div id='searchResult'></div>";
						let myBooks = document.getElementById("myBooks");
						var childs = myBooks.childNodes;
						childs[5].appendChild(divSearch);
						CreateTableFromJSON(books,"searchResult",false);
						var error = document.getElementById("error");
						error.innerHTML = "";

					}
					else{
						var error = document.getElementById("error");
						error.innerHTML = "Aucun livre n'a été trouvé";
						return;
					}
				}
			}
		};
		var url = "https://www.googleapis.com/books/v1/volumes?q="+bookName+"+inauthor:"+author+"&key=AIzaSyDXq-fmbQTj_4Zkh2mpnwXqMmKTatWn9Eg&country=NO";
		xhttp.open("GET", url, false);
		xhttp.send();
	}
}

//
function getBooksStorageSession(id,title){
	if(sessionStorage.getItem('books') != "undefined"){
		var books = JSON.parse(sessionStorage.getItem('books'));
		CreateTableFromJSON(books,id,title);
	}
}

function CreateTableFromJSON(myBooks,id,isBooksMarked) {
	// Extracts value for html header.
	// ('Book ID', 'Book Name', 'Category' and 'Price')
	var col = [];
	var divContainer = document.getElementById(id);
	// Creates dynamic table.
	var table = document.createElement("table");
	if(myBooks != null){
		for (var i = 0; i < myBooks.length; i++) {
			for (var key in myBooks[i]) {
				if (col.indexOf(key) === -1) {
					col.push(key);
				}
			}
		}
		// Creates html table header row using the extracted headers above.
		var tr = table.insertRow(-1);                   // Table row.

		// Add JSON data to the table as rows.
		for (var i = 0; i < myBooks.length; i++) {
			tr = table.insertRow(-1);
			for (var j = 0; j < 1; j++) {
				var tabCell = tr.insertCell(-1);
				var book =  counstructBookTable(myBooks[i],isBooksMarked,tr);
				tabCell.innerHTML = book;
			}
		}
	}
	// Finally add the newly created table with JSON data to a container.
	var titre = isBooksMarked? "Ma poch'liste":"Résultats de recherche";
	divContainer.innerHTML = "<h2>"+titre+"</h2>";
	divContainer.appendChild(table);
}

function counstructBookTable(myBook, isBooksMarked) {
	// check if myBook is not undefined
	if (typeof myBook == "undefined" || myBook ==null) {
		return;
	}
	// variables declaration
	var idBook = "";
	var title = "Information manquante";
	var author = "Information manquante";
	var shortDescription = "Information manquante";
	var description = "Information manquante";
	var imgBook = "img/unavailable.png";

	// check if id is not undefined
	if (typeof myBook["id"] != "undefined") {
		idBook = myBook["id"];
	}
	// check if volumeInfo is not undefined
	if (typeof myBook["volumeInfo"] != "undefined") {
		// get title
		if (typeof myBook["volumeInfo"]["title"] != "undefined") {
			title = myBook["volumeInfo"]["title"];
		}
		// get first author
		if (typeof myBook["volumeInfo"]["authors"] != "undefined") {
			author = myBook["volumeInfo"]["authors"][0];
		}
		// cas : get book by id via api google books
		if (isBooksMarked) {
			if (typeof myBook["volumeInfo"]["description"] != "undefined") {
				description = myBook["volumeInfo"]["description"];
				shortDescription = description.length > 200 ?
					description.slice(0, 199) + "<a onclick='showMore(\"" + idBook + "\")' style='color: blue'> Lire la suite...</a></div><br>" :
					description;
			}
		}
		// get description
		if (typeof myBook["volumeInfo"]["imageLinks"] != "undefined") {
			imgBook = myBook["volumeInfo"]["imageLinks"]["smallThumbnail"];
		}
	}
	// cas : get all book by title & author via api google books => description = textSnippet
	if (typeof myBook["searchInfo"] != "undefined") {
		description = myBook["searchInfo"]["textSnippet"];
		shortDescription = description.length > 200 ?
			description.slice(0, 199) + "<a onclick='showMore(\"" + idBook + "\")' style='color: blue'> Lire la suite...</a></div><br>" :
			description;
	}
	// create dynamic icon "font lib" trash & mark book
	var imgBookMarkOrDeleteBook = isBooksMarked?"fas fa-trash-alt":"fas fa-bookmark";
	// create dynamic functions add & delete book
	var functionBookMarkOrDeleteBook = isBooksMarked ? "deleteBook(\'"+idBook+"\')" :
		"addBook(\'"+idBook+"\')";
	// Construct dynamic book table
	var book =
		'<div id="bookTable">'+
		'<div> <i class="'+imgBookMarkOrDeleteBook+'" onclick="'+functionBookMarkOrDeleteBook+'"></i>'+
		'<div><span class="idBook">Identifiant:</span> '+idBook+'</div>'+
		'<div> <span class="titleBook">Titre:</span> '+title+'</div>'+
		'<div> <span class="author">Auteur:</span> '+author+'</div>'+
		'<div class="description" style="display: block" id="hideDes-'+idBook+'"><span class="descr">Description:</span> '+shortDescription+'</div>'+
		'<div class="moreDescription" style="display: none" id="moreDes-'+idBook+'"><span class="descr">Description:</span> '+description
		+ "<a style='color: blue' onclick='hide(\""+idBook+"\")'> Masquer</a></div>"
		+'</div>'+
		'<div class="imgBook"><img src="'+imgBook+'" /></div></br>'+
		'</div>';

	return book;
}
// Shows the book's whole description
function showMore(idBookDescription){
	document.getElementById("moreDes-"+idBookDescription).style.display="block";
	document.getElementById("hideDes-"+idBookDescription).style.display="none";
}
// Limits the book's description to 200 characters.
function hide(idBookDescription){
	document.getElementById("moreDes-"+idBookDescription).style.display="none";
	document.getElementById("hideDes-"+idBookDescription).style.display="block";
}

// Deletes books from the storage session
function deleteBook(idBook){
	if(sessionStorage.getItem('books') != null) {
		var books = JSON.parse(sessionStorage.getItem('books'));
		for (var i = 0; i <= books.length; i++) {
			if(books[i]["id"] == idBook){
				books.splice(i, 1);
				sessionStorage.setItem('books', JSON.stringify(books));
				CreateTableFromJSON(JSON.parse(sessionStorage.getItem('books')),"content",true);
				return;
			}
		}

	}
}

// Add books in the storage session
function addBook(idBook){
	var xhttp;
	var books = [];
	var	isBookExiste =false;
	if(sessionStorage.getItem('books') !== null){
		books = JSON.parse(sessionStorage.getItem('books'));
		books.forEach((item, index) => {
			if (item["id"] == idBook) {
				isBookExiste = true;
			}
		});
		if(isBookExiste) {
			alert("Vous ne pouvez pas ajouter deux fois le même livre");
			return;
		}
	}
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var jsonResponse = JSON.parse(xhttp.responseText);
			if (jsonResponse!= null) {
				var book = jsonResponse;
			}
			books[books.length] = book;
		}
	};
	var url = "https://www.googleapis.com/books/v1/volumes/"+idBook+"?key=AIzaSyDXq-fmbQTj_4Zkh2mpnwXqMmKTatWn9Eg&country=NO";
	xhttp.open("GET", url, false);
	xhttp.send();
	sessionStorage.setItem('books', JSON.stringify(books));
}