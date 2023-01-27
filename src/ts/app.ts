const categorySelect = document.querySelector('.select-category') as HTMLDivElement
const categoryCheckbox = document.querySelector('.checkbox-category') as HTMLDivElement
let expandDropdownCategory: boolean = false;


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

categorySelect.addEventListener('click', (event) => {
	quizApp.showCheckboxes()
})
