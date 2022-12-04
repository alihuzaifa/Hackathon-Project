// ==================================  Firebase config  ========================================
import {
    auth,
    db,
    storage
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

import {
    collection,
    addDoc,
    onSnapshot,
    where,
    query,
    updateDoc,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

import {
    uploadBytes,
    getDownloadURL,
    ref
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getAvailableClasses();
        showClass();
    } else {
        console.log("AAAAAAaa");
    }
});

// ==================================  All Variables For Class ========================================
const addClass = document.querySelector("#add-class");
const classTiming = document.querySelector(".class-timing");
const classSchedule = document.querySelector(".class-schedule");
const teachersName = document.querySelector(".teachers-name");
const sectionName = document.querySelector(".section-timing");
const courseName = document.querySelector(".course-name");
const batchNumber = document.querySelector(".batch-number");
const mainError = document.querySelector(".main-error");
const showClassData = document.querySelector(".class-data")
const cnicRegex = "^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$"

// ==================================  All Variables Of Students ========================================
const studentName = document.querySelector(".name");
const fatherName = document.querySelector(".f-name");
const rollNumber = document.querySelector(".roll-number");
const contactNumber = document.querySelector(".contact-number");
const cnicNumber = document.querySelector(".cnic-number");
const studentPic = document.querySelector(".student-pic")
const courseNameStudent = document.querySelector(".student-course-name");
const teachersList = document.querySelector(".teachers-list");
const addStudent = document.querySelector("#add-student");
const studentsMainError = document.querySelector(".student-error");
let allClasses = [];

// ==================================  All Variables for show class data ========================================
const classTimingData = document.querySelector(".class-timing-data");
const classScheduleData = document.querySelector(".class-schedule-data");
const classTeacherData = document.querySelector(".class-teacher-data");
const sectionTimingData = document.querySelector(".section-timing-data");
const batchNumberData = document.querySelector(".batch-number-data");
const courseNameData = document.querySelector(".course-name-data");
const editDataError = document.querySelector(".edit-data-error");
const editBtn = document.querySelector("#edit-data");
const deleteBtn = document.querySelector("#delete-data");
let getDataId;

// ==================================  Variable For Attendance Page  ========================================
const attendanceBtn = document.querySelector("#attendance");
let allStudent = [];


// ==================================  Main Function For Class Creation  ========================================
const addClassData = async () => {
    if (classTiming.value === "Open this select timings" || classSchedule.value === "Open this select classes" || teachersName.value === "Open this select teacher's name" || sectionName.value === "Open this select class timings" || batchNumber.value === "Open this select batch name" || courseName.value === "Open this select course name") {
        mainError.innerHTML = "All Input Data Are Required"
        mainError.classList.add("error");
        mainError.style.display = "block";
        mainError.style.color = "red"
    }
    else {
        addClass.innerHTML = `<div class="loader"></div>`
        let collectionRef = collection(db, "allClass")
        await addDoc(collectionRef, {
            timing: classTiming.value,
            schedule: classSchedule.value,
            teachers: teachersName.value,
            section: sectionName.value,
            course: courseName.value,
            batch: batchNumber.value
        });
        addClass.setAttribute("data-bs-dismiss", "modal");
        swal({
            title: "Good job!",
            text: "The class has been made.",
            icon: "success",
            button: "Ok",
        })
        clearInputFields()
        addClass.innerHTML = `Add`

    }
}
addClass.addEventListener("click", addClassData);


function clearInputFields() {
    classTiming.value = "Open this select timings";
    classSchedule.value = "Open this select classes";
    teachersName.value = "Open this select teacher's name";
    sectionName.value = "Open this select class timings";
    batchNumber.value = "Open this select batch name";
    courseName.value = "Open this select course name";
    classSchedule.value = "Open this select classes";
}


// ==================================  Main Function For Students Creation  ========================================
const studentData = async () => {
    if (studentName.value === "" || fatherName.value === "" || cnicNumber.value == "" || rollNumber.value === "" || contactNumber.value === "" || studentPic.files === "") {
        studentsMainError.innerHTML = "All Input Fields Are Required"
        studentsMainError.classList.add("error");
        studentsMainError.style.display = "block"
    } else {
        addStudent.innerHTML = `<div class="loader"></div>`;
        // ======================================  Firebase Storage ===================================== 
        let upload_picture = studentPic.files[0];
        const imageRef = await ref(storage, `user-images/${upload_picture.name}`);
        await uploadBytes(imageRef, upload_picture);
        const url = await getDownloadURL(imageRef);

        // ====================================== For getting class time of the student ===================================== 
        let collectionRef = collection(db, "allClass");
        let collectionQuery = where("course", "==", courseNameStudent.value)
        const q = query(collectionRef, collectionQuery);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let getData = localStorage.getItem("classData");
                if (getData) {
                    getData = JSON.parse(getData);
                    allClasses = getData;
                }
                allClasses.push({
                    class: doc.data().course,
                    timing: doc.data().timing
                });
                localStorage.setItem("classData", JSON.stringify(allClasses));
            });
        });


        // ======================================  Firebase Firestore  ===================================== 
        const dataRef = collection(db, "allStudent");
        let data = await addDoc(dataRef, {
            student: studentName.value,
            studentFather: fatherName.value,
            rollNumberStudent: rollNumber.value,
            uid: auth.currentUser.uid,
            contact: contactNumber.value,
            cnic: cnicNumber.value,
            studentCourse: courseNameStudent.value,
            teacher: teachersList.value,
            image: url,
        });
        swal({
            title: "Good job!",
            text: "The Student has been created.",
            icon: "success",
            button: "Ok",
        })
        addStudent.innerHTML = "Add Student"
        clearInput()
    }

}


addStudent.addEventListener("click", studentData);

// ==================================  Main Function to show available classes in options in studentdata  ========================================
function getAvailableClasses() {
    let collectionRef = collection(db, "allClass")
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        courseNameStudent.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let data = doc.data().course
            courseNameStudent.innerHTML += `
            <option selected value="${data}">${data}</option>`
        });
    });
}

// ==================================  Main Function to show classes on screen  ========================================
function showClass() {
    let collectionRef = collection(db, "allClass")
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        showClassData.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let data = doc.data().course
            let otherData = doc.data()
            showClassData.innerHTML += `<div
            class="col-12 offset-0 col-sm-8 offset-sm-2 col-md-6 col-lg-4 offset-lg-0 my-2 my-sm-2 my-md-2 my-lg-0">
            <div class="card">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <div class="name fs-3 text-center my-1">${data}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div type="button" class="col btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#staticBackdrop-3" onclick="getClassData('${data}','${otherData.batch}','${otherData.schedule}','${otherData.section}','${otherData.teachers}','${otherData.timing}','${doc.id}')">Show Details
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        });
    });
}

// ==================================  Main Function to show class details at modal popup  ========================================
function getClassData(course, time, schedule, batch, teacher, section, id) {
    classTimingData.value = time;
    classScheduleData.value = schedule;
    classTeacherData.value = teacher;
    sectionTimingData.value = section;
    courseNameData.value = course;
    batchNumberData.value = batch;
    getDataId = id;
}

// ================================== Main Function To Delete ========================================
async function deleteData() {
    deleteBtn.innerHTML = `<div class="loader"></div>`
    console.log(getDataId)
    let dataRef = doc(db, "all-classes", getDataId)
    await deleteDoc(dataRef);
    deleteBtn.innerHTML = "Delete";
    deleteBtn.setAttribute("data-bs-dismiss", "modal");
    swal({
        title: "Good job!",
        text: "Your data has been deleted successfully!",
        icon: "success",
        button: "Ok",
    });
}

// ================================== Main Function To Edit Class Data ========================================
const editData = async () => {
    if (classTimingData.value === "" || classScheduleData.value === "" || classTeacherData.value === "" || sectionTimingData.value === "" || courseNameData.value === "" || batchNumberData.value === "") {
        editDataError.innerHTML = "Fill All Data";
        editDataError.classList.add("error");
        editDataError.style.display = "block";
        editDataError.style.color = "red"
    } else {
        editBtn.innerHTML = `<div class="loader"></div>`
        const dataRef = doc(db, "all-classes", getDataId);
        await updateDoc(dataRef, {
            timing: classTimingData.value,
            schedule: classScheduleData.value,
            teachers: classTeacherData.value,
            section: sectionTimingData.value,
            course: courseNameData.value,
            batch: batchNumberData.value
        });
        editBtn.innerHTML = `Edit`;
        editBtn.setAttribute("data-bs-dismiss", "modal");
        swal({
            title: "Good job!",
            text: "Your data has been edited successfully!",
            icon: "success",
            button: "Ok",
        });
    }
}

function clearInput() {
    studentName.value = "";
    fatherName.value = "";
    rollNumber.value = "";
    contactNumber.value = "";
    cnicNumber.value = "";
}

// ==================================  Function that get All student and it will save it in array  ========================================
const attendancePage = () => {
    const q = query(collection(db, "allStudent"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            let getStudent = localStorage.getItem("getAllStudent");
            if (getStudent) {
                getStudent = JSON.parse(getStudent)
                getStudent = allStudent;
            }
            allStudent.push(data);
            localStorage.setItem("getAllStudent", JSON.stringify(allStudent));
            location = ".././class-section.html";
        });
    });


}
attendanceBtn.addEventListener("click", attendancePage)

window.deleteData = deleteData;
window.editData = editData
window.getClassData = getClassData;