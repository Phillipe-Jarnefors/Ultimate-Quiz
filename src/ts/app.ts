const categorySelect = document.querySelector('.select-category') as HTMLDivElement
const categoryCheckbox = document.querySelector('.checkbox-category') as HTMLDivElement

let expandDropdownCategory: boolean = false;
let quizUrl = 'https://the-trivia-api.com/api/categories'
let keyArray: string[];

let quizApp = {
	showCheckboxes() {
		if(!expandDropdownCategory) {
			console.log("block");
			categoryCheckbox.style.display = 'block'
			expandDropdownCategory = true;
			
		} else {
			categoryCheckbox.style.display = 'none';
			console.log("none");
			expandDropdownCategory = false;
		}
	}
}




async function getCategoriesDropdown(categories: string) {
	//categoryCheckbox.innerHTML = ""
	const response = await fetch(categories);
	const data = await response.json()

	categoryCheckbox.innerHTML = Object.keys(data)
	.map(key =>
		 `<label for="${key}">
		  <input type="checkbox" id="${key}"/>${key}</label>`
		 ).join('')
}

categorySelect.addEventListener('click', (event) => {
	quizApp.showCheckboxes()
})


getCategoriesDropdown(quizUrl)



// Object.keys(data).forEach(key => {
// 	const checkbox = document.createElement('input')
// 	checkbox.type = 'checkbox';
// 	checkbox.name = key;
// 	categoryCheckbox.append(checkbox);

// 	const label = document.createElement('label')
// 	label.setAttribute('for', key)
// 	label.innerHTML = key;
// 	categoryCheckbox.append(label)
// })