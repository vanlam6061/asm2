"use strict";

// DOM get element by id
const submitBtn = document.getElementById("submit-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const ageInput = document.getElementById("input-age");
const typeInput = document.getElementById("input-type");
const weightInput = document.getElementById("input-weight");
const lengthInput = document.getElementById("input-length");
const colorInput = document.getElementById("input-color-1");
const breedInput = document.getElementById("input-breed");
const vaccinatedInput = document.getElementById("input-vaccinated");
const dewormedInput = document.getElementById("input-dewormed");
const sterilizedInput = document.getElementById("input-sterilized");
const today = new Date();
let yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
let sideBar = document.getElementById("sidebar");
sideBar.classList.toggle("active");

//filter the breed type before  load to pet table
const breedFilterArr = JSON.parse(getFromStorage("localBreedArr"));
console.log(breedFilterArr);
typeInput.addEventListener("change", () => {
  breedInput.innerHTML = "";
  if (typeInput.value == "dog") {
    let dogBreed = breedFilterArr.filter((arr) => arr.type == "Dog");
    console.log(dogBreed);
    dogBreed.forEach((dog) => {
      const dogOption = document.createElement("option");
      dogOption.innerHTML = `${dog.name}`;
      breedInput.appendChild(dogOption);
    });
  } else {
    let catBreed = breedFilterArr.filter((arr) => arr.type == "Cat");
    console.log(catBreed);
    catBreed.forEach((cat) => {
      const catOption = document.createElement("option");
      catOption.innerHTML = `${cat.name}`;
      breedInput.appendChild(catOption);
    });
  }
});
const petArr = [];
//I. Bắt sự kiện Click vào nút "Submit"
submitBtn.addEventListener("click", () => {
  // II. Lấy dữ liệu từ các Form Input
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: weightInput.value,
    lengthPet: lengthInput.value,
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    bmi: null,
    date: `${dd}/${mm}/${yyyy}`,
  };
  // III. Validate dữ liệu
  let validate = true;
  //1 Không có trường nào bị nhập thiếu dữ liệu.
  if (
    data.id == "" ||
    data.name == "" ||
    data.age == "" ||
    data.lengthPet == "" ||
    data.weight == "" ||
    data.color == ""
  ) {
    alert("Please fill all fields");
    validate = false;
  } else {
    //2 Giá trị ID không được trùng với các thú cưng còn lại. Nếu không hợp lệ, hãy đưa ra thông báo "ID must unique!".
    for (let i = 0; i < petArr.length; i++) {
      if (data.id == petArr[i].id) {
        alert("ID must unique!");
        validate = false;
      }
    }
    //3 Trường Age chỉ được nhập giá trị trong khoảng 1 đến 15. Nếu không hợp lệ, hãy đưa ra thông báo "Age must be between 1 and 15!".
    if (data.age < 1 || data.age > 15) {
      alert("Age must be between 1 and 15!");
      validate = false;
    }
    //4 Trường Weight chỉ được nhập giá trị trong khoảng 1 đến 15. Nếu không hợp lệ, hãy đưa ra thông báo "Weight must be between 1 and 15!".
    if (data.weight < 1 || data.weight > 15) {
      alert("Weight must be between 1 and 15!");
      validate = false;
    }
    //5 Trường Length chỉ được nhập giá trị trong khoảng 1 đến 100. Nếu không hợp lệ, hãy đưa ra thông báo "Length must be between 1 and 100!".
    if (data.lengthPet < 1 || data.lengthPet > 100) {
      alert("Length must be between 1 and 100!");
      validate = false;
    }
    //6 Bắt buộc phải chọn giá trị cho trường Type. Nếu không hợp lệ, hãy đưa ra thông báo "Please select Type!".
    if (data.type == "") {
      alert("Please select Type!");
      validate = false;
    }
    //7 Bắt buộc phải chọn giá trị cho trường Breed. Nếu không hợp lệ, hãy đưa ra thông báo "Please select Breed!".
    if (data.breed == "") {
      alert("Please select Breed!");
      validate = false;
    }
  }
  // IV. Thêm thú cưng vào danh sách
  if (validate) {
    localPetArr.push(data);
    saveToStorage("localPetArr", JSON.stringify(localPetArr));
    const petArr = JSON.parse(getFromStorage("localPetArr"));
    renderTableData(petArr);
  }
  console.log(localPetArr);
});
const tableBodyEl = document.getElementById("tbody");
// V. Hiển thị danh sách thú cưng
function renderTableData(petArr) {
  tableBodyEl.innerHTML = "";
  for (let i = 0; i < petArr.length; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <th scope="row">${petArr[i].id}</th>
		<td>${petArr[i].name}</td>
		<td>${petArr[i].age}</td>
		<td>${petArr[i].type}</td>
	  <td>${petArr[i].weight} kg</td>
		<td>${petArr[i].lengthPet} cm</td>
		<td>${petArr[i].breed}</td>
		<td>
		<i class="bi bi-square-fill" style="color: ${petArr[i].color}"></i>
		</td>
		<td><i class="bi ${
      petArr[i].vaccinated == true ? "bi-check-circle-fill" : "bi-x-circle-fill"
    }"></i></td>
		<td><i class="bi ${
      petArr[i].dewormed == true ? "bi-check-circle-fill" : "bi-x-circle-fill"
    }"></i></td>
		<td><i class="bi ${
      petArr[i].sterilized == true ? "bi-check-circle-fill" : "bi-x-circle-fill"
    }"></i></td>
		<td>${petArr[i].date}</td>
		<td><button type="button" class="btn btn-danger" onclick="deletePet('${
      petArr[i].id
    }')">Delete</button>
		</td>
  `;
    tableBodyEl.appendChild(row);
  }
}
// VI Xóa các dữ liệu nhập trong Form Input
const clearInput = () => {
  idInput.value = "";
  nameInput.value = "";
  ageInput.value = "";
  typeInput.value = "Select Type";
  weightInput.value = "";
  lengthInput.value = "";
  colorInput.value = "#000000";
  breedInput.value = "Select Breed";
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
  date: new Date();
};
// VII. Xóa một thú cưng

const deletePet = (petId) => {
  if (confirm("Are you sure?")) {
    let i = petArr.findIndex((id) => {
      id == petId;
    });
    petArr.splice(i, 1);
    renderTableData(petArr);
  }
};
// VIII. Hiển thị các thú cưng khỏe mạnh

let healthyCheck = false;
const healthyCheckBtn = document.getElementById("healthy-btn");
healthyCheckBtn.addEventListener("click", () => {
  if (healthyCheck == true) {
    let healthyPetArr = petArr.filter((petArr) => {
      return (
        petArr.vaccinated === true &&
        petArr.dewormed === true &&
        petArr.sterilized === true
      );
    });
    renderTableData(healthyPetArr);
    healthyCheckBtn.textContent = "Show All Pet";
    healthyCheck = false;
  } else {
    renderTableData(petArr);
    healthyCheckBtn.textContent = "Show Healthy Pet";
    healthyCheck = true;
  }
});
//filter dog/cat from localBreedArr

// const petArr = JSON.parse(getFromStorage("localPetArr"));
// renderTableData(petArr);
// console.log(petArr);
