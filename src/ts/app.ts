const categorySelect = document.querySelector('.select-category') as HTMLDivElement
const categoryCheckbox = document.querySelector('.checkbox-category') as HTMLDivElement
//const formCategory = document.querySelector('.form-category') as HTMLFormElement

let expandDropdownCategory: boolean = false;
let quizUrl = 'https://the-trivia-api.com/api/categories'
let categoryUrl = 'https://the-trivia-api.com/api/questions?categories='
let keyArray: string[];
let result: string[];

let quizApp = {
	showCheckboxes() {
		if(!expandDropdownCategory) {
			categoryCheckbox.style.display = 'block'
			expandDropdownCategory = true;
		} else {
			categoryCheckbox.style.display = 'none';
			expandDropdownCategory = false;
		}
	},

}



async function getCategoriesDropdown(categories: string) {
	const response = await fetch(categories);
	const data = await response.json()

	categoryCheckbox.innerHTML = Object.keys(data)
	.map(key => `
		<label for="${key}">
		<input type="checkbox" name="category-value" value="${key}" class="category-checkbox-value"/>${key}</label>
	`).join('');


	/// LATEST
	console.log(data);
	
	Object.values(data).forEach((val: string) => {

		console.log(val[0]);
	})
	

	const categoryCheckboxValue = document.querySelectorAll('input[name="category-value"]') as NodeListOf<HTMLInputElement>
	categoryCheckbox.addEventListener('click', getValueFromCheckbox)

	function getValueFromCheckbox() {
		//result = []
		categoryCheckboxValue.forEach(item => {
			if (item.checked) {
				// let theData = item.value
				// result.push(theData)
				// categoryUrl += theData
				// console.log(categoryUrl)
			} 
		})
	}
	
}




categorySelect.addEventListener('click', (event) => {
	quizApp.showCheckboxes()
})

getCategoriesDropdown(quizUrl)



