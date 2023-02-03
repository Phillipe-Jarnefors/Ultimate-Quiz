const categorySelect = document.querySelector('.select-category') as HTMLDivElement
const categoryCheckbox = document.querySelector('.checkbox-category') as HTMLDivElement
const difficultyButtons = document.querySelectorAll('.difficulty-button') as NodeListOf<HTMLInputElement>
const numOfQuestionsBtns = document.querySelectorAll('.number-of-questions') as NodeListOf<HTMLInputElement>
const startQuizBtn = document.querySelector('#start-quiz-btn') as HTMLButtonElement
const mainContentStart = document.querySelector('.main-content') as HTMLElement
const tagsBoxDiv = document.querySelector('.tags-box') as HTMLDivElement;
const tagsInputField = (document.getElementById('tags-input') as HTMLInputElement)
const paragraphError = document.getElementById('paragraph-error') as HTMLParagraphElement

//Next section of Quiz
const theQuestion = document.querySelector('.the-question') as HTMLHeadingElement
const theQuestionCategory = document.querySelector('.the-question-category') as HTMLElement
const questionUnorderlist = document.querySelector('.question-holder') as HTMLUListElement
const quizContent = document.querySelector('.quiz-content') as HTMLElement;
const correctScoreSpan = document.querySelector('#correct-score') as HTMLSpanElement
const totalQuestion = document.querySelector('#total-question') as HTMLSpanElement
const difficultySpan = document.querySelector('#difficulty-span') as HTMLSpanElement;
const checkBtn = document.querySelector('#check-answer') as HTMLButtonElement;
const awnserPrompt = document.querySelector('#awnser-prompt') as HTMLParagraphElement
//const playAgainBtn = document.querySelector('#difficulty-span') as HTMLSpanElement;


quizContent.style.display = 'none'

let expandDropdownCategory: boolean = false;
let quizUrl = 'https://the-trivia-api.com/api/categories'
let tagsUrl = 'https://the-trivia-api.com/api/tags'
let requestUrl = 'https://the-trivia-api.com/api/questions?categories='
let categoryUrl: string = ""
let valueArray: string[] = []
let diffUrl: string = ""
let questionsQuantityUrl: string = ""
let tagsString: string = ""
let tagsArray: string[] = []
let stringOfArray: string = ""

let correctAnswer: 
{ 	
	answer: string, 
	correctScore: number, 
	askedCount: number, 
	totalQuestion: number 
} 
= {
	answer: "",
	correctScore: 0,
	askedCount: 0,
	totalQuestion: 0
}

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
	setupContent() {
     	difficultyButtons[0].checked = true;
		diffUrl = '&difficulty=easy'
		difficultySpan.innerHTML = 'EASY'
		
		numOfQuestionsBtns[0].checked = true;
		questionsQuantityUrl = '&limit=2'
		correctAnswer.totalQuestion = 2
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
			})
		})
	},
	selectDifficulty() {
		for(const difficultyRadioButton of difficultyButtons) {
			difficultyRadioButton.addEventListener('change', this.selectedDifficult)
		}
	},
	selectedDifficult(e: Event) {
		const target = e.target as HTMLInputElement;
		
		if (target.checked) {	
			diffUrl = '&difficulty=' + target.value
			difficultySpan.innerHTML = target.value.toUpperCase()
			console.log(diffUrl)	
		} 
	},
	numOfQuestions() {
		for (const questions of numOfQuestionsBtns) {
			questions.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					questionsQuantityUrl = '&limit=' + target.value
					console.log(questionsQuantityUrl)	
					correctAnswer.totalQuestion = + target.value
				}
			})
		}
	},
	tagsHandler(data: any) {		
		const inputValueTag = tagsInputField.value
		const outputElement = `<div class="tags-div"><h1 class="tags">${inputValueTag}</h1></div>`

		const foundTag = data.find((tag:any) => tag === tagsInputField.value);

        if (foundTag) {
			paragraphError.innerHTML = ""
			tagsBoxDiv.innerHTML += outputElement;
			tagsArray.push(tagsInputField.value);
			tagsInputField.value = "";
			const tagsDiv = document.getElementsByClassName('tags-div')
			
			for (const div of tagsDiv) {
				const p = div.getElementsByClassName('tags')[0]
				p.addEventListener('click', () => {					
					tagsArray = tagsArray.filter(event => event !== p.innerHTML)			
					div.remove()
				})
		  	}  
        } else {
			paragraphError.style.fontSize = "1rem"
			paragraphError.style.color = "red"	
			paragraphError.innerHTML = "Tag not found, please try another!"   	
        }	
	},	
	storeUrl() {
		//mainContentStart.style.display = 'none'
		if(tagsArray.length > 0) {
			stringOfArray = tagsArray.toString()
			tagsString = '&tags=' + stringOfArray
		}
		
		requestUrl += categoryUrl + questionsQuantityUrl + diffUrl  + tagsString;
		console.log(requestUrl);
		requestCallApi(requestUrl)
	},
	// Second part of the Quiz
	showQuestion(data: any) {
		checkBtn.disabled = false;
		mainContentStart.style.display = "none"
		quizContent.style.display = "block"

		correctAnswer.answer = data.correctAnswer
		let incorrectAnswers = data.incorrectAnswers
		let optionsList = incorrectAnswers
		optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer.answer)

		theQuestionCategory.innerHTML = `${data.category}`
		theQuestion.innerHTML = `${data.question}`
		questionUnorderlist.innerHTML = `
			${optionsList.map((option: string) => `
				<li><span>${option}<span></li>
			`).join('')}
		`;
		this.selectOption()
	},
	selectOption() {
		questionUnorderlist.querySelectorAll('li').forEach((option) => {
			option.addEventListener('click', () => {
				if(questionUnorderlist.querySelector('.selected')) {
					const activeOption = questionUnorderlist.querySelector('.selected')
					activeOption?.classList.remove('selected')
				}
				option.classList.add('selected')
			})
		})
	},
	checkAnswer() {
		checkBtn.disabled = true
		if(questionUnorderlist.querySelector('.selected')) {
			let selectedAnswer = questionUnorderlist.querySelector('.selected')?.textContent
			console.log(selectedAnswer)
			console.log(correctAnswer)
			if(selectedAnswer == correctAnswer.answer) {
				correctAnswer.correctScore++
				awnserPrompt.innerHTML = 'Correct Answer!'
			} else {
				awnserPrompt.innerHTML = `Incorrect Answer! <br><br>Correct Answer:  ${correctAnswer.answer}`
			}
			this.checkCount()
		} else {
			awnserPrompt.innerHTML = `Please select a option.`
			checkBtn.disabled = false;
		}
	},
	checkCount() {
		correctAnswer.askedCount++
		this.setCount();
		if(correctAnswer.askedCount === correctAnswer.totalQuestion) {
			questionUnorderlist.innerHTML = `Your score: ${correctAnswer.correctScore} of ${correctAnswer.totalQuestion}`
		} else {
			setTimeout(() => {
				requestCallApi(requestUrl)
			}, 2500)
		}
	},
	setCount() {
		totalQuestion.innerHTML = correctAnswer.totalQuestion.toString()
		correctScoreSpan.innerHTML = correctAnswer.correctScore.toString()
	}
}


// Async functions
async function getCategoriesDropdown(categories: string) {
	const response = await fetch(categories);
	const data: { [key:string]: string[] } = await response.json()
	quizApp.printCategories(data)
}

async function requestCallApi(requestUrl: string) {
	const response = await fetch(requestUrl)
	const data = await response.json()
	
	quizApp.setCount()
	awnserPrompt.innerHTML = ""
	quizApp.showQuestion(data[0])
}

async function tagsInputs() {
	const response = await fetch(tagsUrl + tagsInputField.value);
	const data = await response.json();
  
	tagsInputField.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			quizApp.tagsHandler(data)
		}
	});
}

// AddEventListernes
startQuizBtn.addEventListener('click', (start) => {
	quizApp.storeUrl()
})

checkBtn.addEventListener('click', () => {
	quizApp.checkAnswer()
})

// Hide / Show categories
categorySelect.addEventListener('click', (event) => {
	quizApp.showCheckboxes()
})

//Start program
tagsInputs()
quizApp.setupContent()
quizApp.selectDifficulty()
quizApp.numOfQuestions()
getCategoriesDropdown(quizUrl)





