const categorySelect = document.querySelector('.select-category') as HTMLDivElement
const categoryCheckbox = document.querySelector('.checkbox-category') as HTMLDivElement
const difficultyButtons = document.querySelectorAll('.difficulty-button') as NodeListOf<HTMLInputElement>
const numOfQuestionsBtns = document.querySelectorAll('.number-of-questions') as NodeListOf<HTMLInputElement>
const startQuizBtn = document.querySelector('#start-quiz-btn') as HTMLElement


let expandDropdownCategory: boolean = false;
let quizUrl = 'https://the-trivia-api.com/api/categories'

let requestUrl = 'https://the-trivia-api.com/api/questions?categories='
let categoryUrl: string = ""
let valueArray: string[] = []
let diffUrl: string = ""
let questionsQuantityUrl: string = ""


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
	printCategories(data: { [key:string]: string[] }) {
		let checkboxValues: string[] = Object.values(data).map((values) => values[0])
		
		categoryCheckbox.innerHTML = Object.keys(data)
		.map(key => `
			<label for="${key}">
			<input type="checkbox" class="category-value" value=""/>${key}
			</label>
		`).join('');
		
		this.testCheckCategories(checkboxValues)
		
	},
	testCheckCategories(checkboxValues: string[]) {
		const categoryCheckboxValue = document.querySelectorAll('.category-value') as NodeListOf<HTMLInputElement>
	
		categoryCheckboxValue.forEach((checkbox, index) => {
			checkboxValues.forEach((box, i) => {
				categoryCheckboxValue[i].value = `${box}`
			})

			checkbox.addEventListener('change', e => {
				if(checkbox.checked) {
					if (!valueArray.includes(checkboxValues[index])) {
						valueArray.push(checkboxValues[index])
						categoryUrl = ''
					}	
				} else {
					valueArray = valueArray.filter(match => 
						match !== checkboxValues[index])
						categoryUrl = ''
				}
				let addValueToArray = valueArray.join(',')
				categoryUrl += addValueToArray

				//CLG for dev
				console.log(categoryUrl)
				console.log(valueArray)		
				

				//this.selectDifficulty()
			})
		})
	},
	selectDifficulty() {
		//difficultyButtons[0].checked = true;
		for(const difficultyRadioButton of difficultyButtons) {
			difficultyRadioButton.addEventListener('change', this.selectedDifficult)
		}
	},
	selectedDifficult(e: Event) {
		const target = e.target as HTMLInputElement;
		
		if (target.checked) {	
			//diffUrl = categoryUrl + '&difficulty=' + target.value

			diffUrl = '&difficulty=' + target.value
			console.log(diffUrl)	
			//this.numOfQuestions(diffUrl)
		} 
	},
	numOfQuestions() {
		for (const questions of numOfQuestionsBtns) {
			questions.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					// questionsQuantityUrl = categoryUrl + target.value + diffUrl;

					questionsQuantityUrl = '&limit=' + target.value
					console.log(questionsQuantityUrl)
					
				}
			})
		}
	},
	
	storeUrl() {
		
		requestUrl += categoryUrl + diffUrl + questionsQuantityUrl;

		console.log(requestUrl);
		
	},


}




async function getCategoriesDropdown(categories: string) {
	const response = await fetch(categories);
	const data: { [key:string]: string[] } = await response.json()
	
	quizApp.printCategories(data)
}

startQuizBtn.addEventListener('click', (start) => {
	quizApp.storeUrl()
})



// Hide / Show categories
categorySelect.addEventListener('click', (event) => {
	quizApp.showCheckboxes()
})


quizApp.selectDifficulty()
quizApp.numOfQuestions()
quizApp.selectDifficulty()
getCategoriesDropdown(quizUrl)



