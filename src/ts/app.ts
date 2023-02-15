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

//Last section, display and commit score
const yourScoreResult = document.querySelector('#your-score-result') as HTMLElement;
const yourScoreDifficulty = document.querySelector('#your-score-difficulty') as HTMLElement;
const scoreArticle = document.querySelector('.score-article') as HTMLElement;
const nicknameInput = (document.getElementById('nickname-input') as HTMLInputElement)
const commitNicknameBtn = document.querySelector('#commit-nickname-btn') as HTMLButtonElement
const scoreboardSection = document.querySelector('.scoreboard') as HTMLDivElement;
const scoreboardArticle = document.querySelector('.scoreboard-article') as HTMLElement;

scoreboardArticle.style.display = 'none'
quizContent.style.display = 'none'
scoreArticle.style.display = 'none'

let expandDropdownCategory: boolean = false;
let quizUrl: string = 'https://the-trivia-api.com/api/categories'
let tagsUrl: string = 'https://the-trivia-api.com/api/tags'
let requestUrl: string = 'https://the-trivia-api.com/api/questions?categories='
let categoryUrl: string = ""
let valueArray: string[] = []
let diffUrl: string = ""
let questionsQuantityUrl: string = ""
let tagsString: string = ""
let tagsArray: string[] = []
let stringOfArray: string = ""
let targetValue: number;

interface Userstorage {
	nickname: string,
	difficulty: string,
	score: number
}
let storedUsers: Userstorage[] = []
let userData: Userstorage = {
	nickname: "",
	difficulty: "",
	score: 0
}

interface CorrectAwnser {
	answer: string, 
	correctScore: number, 
	askedCount: number, 
	totalQuestion: number,	
}
let correctAnswer: CorrectAwnser = {
	answer: "",
	correctScore: 0,
	askedCount: 0,
	totalQuestion: 0,
}
const imageSrc = 
{
	checkmark: "https://api.iconify.design/ph/check-circle-bold.svg?color=%230fa000&width=30&height=30",
	warning: "https://api.iconify.design/material-symbols/error-outline-rounded.svg?color=red&width=30&height=30"
}

let quizApp = {
	showCheckboxes(): void {
		if(!expandDropdownCategory) {
			categoryCheckbox.style.display = 'block'		
			expandDropdownCategory = true;
		} else {
			categoryCheckbox.style.display = 'none';
			expandDropdownCategory = false;
		}
	},
	setupContent() : void {
     	difficultyButtons[0].checked = true;
		diffUrl = '&difficulty=easy'
		difficultySpan.innerHTML = 'EASY'		
		numOfQuestionsBtns[0].checked = true;
		questionsQuantityUrl = '&limit=2'
		correctAnswer.totalQuestion = 2
	},
	printCategories(data: { [key:string]: string[] }): void {
		let checkboxValues: string[] = Object.values(data).map((values) => values[0])	
		categoryCheckbox.innerHTML = Object.keys(data)
		.map(key => `
			<label>
				<input type="checkbox" class="category-value" value=""/>  ${key}
			</label>
		`).join('');		
		this.testCheckCategories(checkboxValues)		
	},
	testCheckCategories(checkboxValues: string[]): void {
		const categoryCheckboxValue = document.querySelectorAll('.category-value') as NodeListOf<HTMLInputElement>	
		categoryCheckboxValue.forEach((checkbox, index) => {
			checkboxValues.forEach((box, i) => {
				categoryCheckboxValue[i].value = `${box}`
			})
			checkbox.addEventListener('change', e => {
				e.preventDefault()
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
			})
		})
	},
	selectDifficulty(): void {
		for(const difficultyRadioButton of difficultyButtons) {
			difficultyRadioButton.addEventListener('change', this.selectedDifficult)
		}
	},
	selectedDifficult(e: Event): void {
		const target = e.target as HTMLInputElement;	
		if (target.checked) {	
			diffUrl = '&difficulty=' + target.value
			difficultySpan.innerHTML = target.value.toUpperCase()
			yourScoreDifficulty.innerHTML = `Difficulty: ${target.value}`
			console.log(diffUrl)	
		} 
	},
	numOfQuestions(): void {
		for (const questions of numOfQuestionsBtns) {
			questions.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					questionsQuantityUrl = '&limit=' + target.value
					console.log(questionsQuantityUrl)	
					targetValue = Number(target.value)
					correctAnswer.totalQuestion = targetValue
				} 
			})
		}
	},
	tagsHandler(data: string[]): void {		
		const inputValueTag = tagsInputField.value
		const outputElement = `<div class="tags-div"><h1 class="tags">${inputValueTag}</h1></div>`
		const foundTag = data.find((tag:string) => tag === tagsInputField.value);
        if (foundTag) {
			paragraphError.innerHTML = ""
			tagsBoxDiv.innerHTML += outputElement;
			tagsArray.push(tagsInputField.value);
			tagsInputField.value = "";
			const tagsDiv = document.getElementsByClassName('tags-div')		
			for (const div of tagsDiv) {
				const p = div.getElementsByClassName('tags')[0]
				p.addEventListener('click', () => {					
					tagsArray = tagsArray.filter(string => string !== p.innerHTML)			
					div.remove()
				})
		  	}  
        } else {
			paragraphError.style.fontSize = "1rem"
			paragraphError.style.color = "red"	
			paragraphError.innerHTML = `<img src="${imageSrc.warning}">Tag not found.`   	
        }	
	},	
	storeUrl(): void {
		if(tagsArray.length > 0) {
			stringOfArray = tagsArray.toString()
			tagsString = '&tags=' + stringOfArray
		}		
		requestUrl += categoryUrl + questionsQuantityUrl + diffUrl  + tagsString;
		console.log(requestUrl);
		requestCallApi(requestUrl)
	},
	// Second part of the Quiz
	showQuestion(data: any): void {
		checkBtn.disabled = false;
		checkBtn.style.display = "block"
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
	selectOption(): void {
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
	checkAnswer(): void {
		checkBtn.disabled = true
		checkBtn.style.display = "none"
		if(questionUnorderlist.querySelector('.selected')) {
			let selectedAnswer = questionUnorderlist.querySelector('.selected')?.textContent
			console.log(selectedAnswer)
			console.log(correctAnswer)
			if(selectedAnswer == correctAnswer.answer) {
				correctAnswer.correctScore++
				awnserPrompt.innerHTML = `
				<img src="${imageSrc.checkmark}">
				<p> Correct Answer!</p>`
			} else {
				awnserPrompt.innerHTML = `
				<img src="${imageSrc.warning}">
				<p>Incorrect Answer!<br>
				Correct Answer: ${correctAnswer.answer}</p>
				`
			}
			this.checkCount()
		} else {
			awnserPrompt.innerHTML = `<img src="${imageSrc.warning}"><p>Please select a option.</p>`
			checkBtn.disabled = false;
			checkBtn.style.display = "block"
		}
	},
	checkCount(): void {
		correctAnswer.askedCount++
		this.setCount();
		if(correctAnswer.askedCount === correctAnswer.totalQuestion) {
			quizContent.style.display = "none"
			scoreArticle.style.display = "block"
			yourScoreResult.innerHTML = `Your score: ${correctAnswer.correctScore} of ${correctAnswer.totalQuestion}`
		} else {
			setTimeout(() => {
				requestCallApi(requestUrl)
			}, 2200)
		}
	},
	setCount(): void {
		totalQuestion.innerHTML = correctAnswer.totalQuestion.toString()
		correctScoreSpan.innerHTML = correctAnswer.correctScore.toString()
	},
	// Commit score section
	storeUserData(): void {		
		if(nicknameInput.value.length < 3) {
			alert('Your nickname is too short.')
		} else {
			userData = { nickname: nicknameInput.value, difficulty: difficultySpan.innerText, score: correctAnswer.correctScore }
			storedUsers.push(userData)
			this.printScoreboard()
		}
	},
	printScoreboard(): void {
		scoreboardArticle.style.display = "block"
		scoreArticle.style.display = 'none'
		scoreboardSection.innerHTML = ""	
		storedUsers.forEach(user => {
			scoreboardSection.innerHTML += `
			<h1>${user.nickname}</h1>
			<p>Score: ${user.score}</p>
			<p>Difficulty: ${user.difficulty}</p>
			<div class="line"></div>
			`
		})
		//clg for dev
		//console.log(storedUsers)
	},
	resetQuiz(): void {
		scoreArticle.style.display = 'none'
		scoreboardArticle.style.display = 'none'
		quizContent.style.display = 'none'
		mainContentStart.style.display = 'block'

		expandDropdownCategory = true;
		quizUrl = 'https://the-trivia-api.com/api/categories'
		tagsUrl = 'https://the-trivia-api.com/api/tags'
		requestUrl = 'https://the-trivia-api.com/api/questions?categories='
		
		categoryUrl = ""
		valueArray = []
		diffUrl = ""
		questionsQuantityUrl = ""
		tagsString = ""
		tagsArray = []
		stringOfArray = ""
		correctAnswer = { answer: "", correctScore: 0, askedCount: 0, totalQuestion: 0, }
		nicknameInput.value = ""
		this.setupContent()
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
startQuizBtn.addEventListener('click', () => {
	quizApp.storeUrl()
})
checkBtn.addEventListener('click', () => {
	quizApp.checkAnswer()
})
// Hide / Show categories
categorySelect.addEventListener('click', () => {
	quizApp.showCheckboxes()
})
commitNicknameBtn.addEventListener('click', () => {
	quizApp.storeUserData()
})

//General-btns
const scoreboardBtn = document.querySelector('#scoreboard-btn') as HTMLButtonElement;
scoreboardBtn.addEventListener('click', (e) => {
	e.preventDefault()
	quizApp.resetQuiz()
	mainContentStart.style.display = "none"
	scoreboardArticle.style.display = "block"
})
let playAgain = () => {
	quizApp.resetQuiz()
}
const playAgainBtn = document.getElementsByClassName('new-quiz')
for (let button of playAgainBtn) {
	button.addEventListener('click', playAgain)
}

//Start program
tagsInputs()
quizApp.setupContent()
quizApp.selectDifficulty()
quizApp.numOfQuestions()
getCategoriesDropdown(quizUrl)