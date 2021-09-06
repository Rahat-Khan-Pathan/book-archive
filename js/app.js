// function to get the input field text 
const getInputValue = id => {
    const val = document.getElementById(id).value;
    document.getElementById(id).value = '';     // Clear input field
    return val;
}

// function to make url from the input text 
const makeUrl = searchText => {
    const url = `https://openlibrary.org/search.json?q=${searchText}`;
    return url;
}

// function to set the display property of an element 
const setDisplay = (id,dis) => {
    document.getElementById(id).style.display = dis;
}

// function to show message below the search box 
const showTextMessage = text => {
    setDisplay('spinner','none');
    setDisplay('text-message','block');
    document.getElementById('text-message').innerHTML = text;
}

// function to display data found from api 
const displayData = data => {
    let text;
    const row = document.getElementById('row');
    const bookData = data.docs.slice(0,30);   //get first 30 books
    const bookNumber = bookData.length;
    if(bookNumber >= 30) {
        text = `Showing results 30 out of ${data.numFound}`;  // If more than 30 books then showing first 30
    }
    else if(bookNumber > 0) {
        text = `Showing results ${data.numFound} out of ${data.numFound}`;;    // If not more than 30, then showing available books
    }
    else {
        text = 'No Result Found';  // No books were found
    }
    showTextMessage(text);
    bookData.forEach(book => {
        let {title,author_name,first_publish_year,publisher,cover_i} = book;    // Destructuring

        let bookTitle,bookAuthor,bookPublisher,bookPublishYear,bookCover;

        // Ternary operators to check if all data are present or not. If not, then set the value as Unknown
        (title === undefined) ? bookTitle = 'Unknown' : bookTitle = title;
        (author_name === undefined) ? bookAuthor = 'Unknown' : bookAuthor = author_name[0];
        (publisher === undefined) ? bookPublisher = 'Unknown' : bookPublisher = publisher[0];
        (first_publish_year === undefined) ? bookPublishYear = 'Unknown' : bookPublishYear = first_publish_year;
        (cover_i === undefined) ? bookCover="/images/not-found.jpg" : bookCover=`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`;

        const col = document.createElement('div');
        col.innerHTML = `
        <div class="col h-100">
            <div class="card h-100">
                <img src=${bookCover} class="card-img-top" alt="${bookTitle}">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3 fw-bolder">${bookTitle}</h5>
                    <p class="card-text"><span class="fw-bolder details">Author:</span> ${bookAuthor} </p>
                    <p class="card-text"><span class="fw-bolder details">Publisher:</span> ${bookPublisher}</p>
                    <p class="card-text"><span class="fw-bolder details">First Published:</span> ${bookPublishYear}</p>
                </div>
            </div>
        </div>
        `;
        row.appendChild(col);
    });
}

// function to fetch api data 
const fetchData = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => displayData(data))
        .catch(() => showTextMessage('Something went wrong. Please try again later!'));
}

// Search button event listener 
document.getElementById('button-search').addEventListener('click',function() {
    const inputText = getInputValue('input-field');
    const url = makeUrl(inputText);
    setDisplay('text-message','none');
    setDisplay('spinner','block');
    const row = document.getElementById('row');
    row.textContent = '';
    fetchData(url);
})