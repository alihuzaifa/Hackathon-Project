// ==================================  Firebase config  ========================================
import {
    auth,
    db,
} from "../firebase/firebase-config.js";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// ==================================  Card Variables ========================================
const userName = document.querySelector(".name");
const fatherName = document.querySelector(".f-name");
const rollNumber = document.querySelector(".roll-num");
const contactNumber = document.querySelector(".number");
const cnicNumber = document.querySelector(".cnic-num");
const picture = document.querySelector("#user-image");
const course = document.querySelector(".course");
const classTeacher = document.querySelector(".teacher");
const attendanceStatus = document.querySelector(".attendance-category");
const searchData = document.querySelector(".search-data");
const search = document.querySelector("#search");
const attendane = document.querySelector("#attendance");
const attendanceBtn = document.querySelector("#attendance-btn");
const completedAttendance = document.querySelector("#completed-btn")
let correct = 0;
let allStudent = []
let studentClass;
let unsubscribe;

// ==================================  You have to define it first ========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        // 
    } else {
        console.log("AAAAAAaa")
    }
});

const getSearchData = () => {
    if (searchData.value != "") {
        event.preventDefault()


        // ==================================  For getting search value ========================================
        let collectionRef2 = collection(db, "allStudent");
        let collectionQuery2 = where("rollNumberStudent", "==", searchData.value);
        const q1 = query(collectionRef2, collectionQuery2);
        let time;
        unsubscribe = onSnapshot(q1, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data()
                userName.innerHTML = `${data.student}`;
                fatherName.innerHTML = `${data.studentFather}`;
                rollNumber.innerHTML = `${data.rollNumberStudent}`;
                contactNumber.innerHTML = `${data.contact}`;
                cnicNumber.innerHTML = `${data.cnic}`;
                picture.src = data.image;
                course.innerHTML = `${data.studentCourse}`;
                classTeacher.innerHTML = `${data.teacher}`;
                studentClass = data.studentCourse;
                completedAttendance.classList.remove("d-none");
                attendanceStatus.classList.remove("d-none")
                let getData = localStorage.getItem("classData");
                getData = JSON.parse(getData);
                for (let i = 0; i < getData.length; i++) {
                    if (getData[i].class === course.innerHTML) {
                        time = getData[i].timing;
                        break;
                    }
                }
                let date = new Date().getHours();
                let minute = new Date().getMinutes();
                if (date > 12) {
                    date = date - 12
                    time = Number(parseInt(time))
                }
                if (date === 9 && minute > 10) {
                    attendanceStatus[0].innerHTML = "late"
                    attendanceStatus[0].value = "late"
                    attendanceStatus[2].innerHTML = "leave"
                    attendanceStatus[2].value = "leave"
                    attendanceStatus[3].innerHTML = "present"
                    attendanceStatus[3].value = "present"
                } else if (date > time) {
                    attendanceStatus[0].innerHTML = "late"
                    attendanceStatus[0].value = "late"
                    attendanceStatus[2].innerHTML = "leave"
                    attendanceStatus[2].value = "leave"
                    attendanceStatus[3].innerHTML = "present"
                    attendanceStatus[3].value = "present"
                }
            });
        });
        searchData.value = ""

    }
}
search.addEventListener("click", getSearchData);

async function attendanceStudent() {
    correct++
    if (correct === 1) {
        if (attendanceStatus.value == "late" || attendanceStatus.value == "absent" || attendanceStatus.value == "leave") {
            swal("Enter Admin Password:", {
                content: "input",
            })
                .then((value) => {
                    let adminPass = localStorage.getItem("admin-pass");
                    if (value === adminPass) {
                        swal(`Admin Confirmed`);
                    } else {
                        swal(`You Cannot Change setting`);
                        correct = 0;
                        return false;
                    }
                });
        }
    } else {
        if (userName.innerHTML == "" && fatherName.innerHTML == "" && rollNumber.innerHTML == "" && contactNumber.innerHTML == "" && cnicNumber.innerHTML == "" && course.innerHTML == "" && classTeacher.innerHTML == "") {
            swal({
                title: "You Can't Attendance",
                text: "First Search some data For Attendance!",
                icon: "warning",
                button: "OK!",
            });
            return
        }
        else {
            let collectionRef = collection(db, "attendance")
            attendanceBtn.innerHTML = `<div class="loader"></div>`
            await addDoc(collectionRef, {
                studentName: userName.innerHTML,
                guardianName: fatherName.innerHTML,
                rollNumberStudent: rollNumber.innerHTML,
                studentContact: contactNumber.innerHTML,
                studentCNIC: cnicNumber.innerHTML,
                currentDate: Timestamp.fromDate(new Date()),
                status: attendanceStatus.value,
                class: course.innerHTML,
                studentTeacher: classTeacher.innerHTML,
            });
            correct = 0;
            attendanceBtn.innerHTML = "Attendance";
            let confirmAttendance;
            let data = localStorage.getItem("getAllStudent");
            data = JSON.parse(data)
            for (let i = 0; i < data.length; i++) {
                if (data[i].rollNumberStudent === rollNumber.innerHTML) {
                    confirmAttendance = data[i]
                    localStorage.setItem("deletedStudent", JSON.stringify(confirmAttendance))
                    break
                }
            }
            let deleteAttendanceStudent = localStorage.getItem("deletedStudent")
            deleteAttendanceStudent = JSON.parse(deleteAttendanceStudent);
            let allDataStudent = localStorage.getItem("getAllStudent");
            allDataStudent = JSON.parse(allDataStudent);
            for (let i = 0; i < allDataStudent.length; i++) {
                if (allDataStudent[i].rollNumberStudent === deleteAttendanceStudent.rollNumberStudent) {
                    let remainingStudentAttendance = allDataStudent.splice(allDataStudent[i], 1);
                    localStorage.setItem("getAllStudent", JSON.stringify(remainingStudentAttendance));
                    break;
                }
            }
            clearAllCardData()
        }
    }

};


function clearAllCardData() {
    correct = 0;
    attendanceStatus.classList.add("d-none")
    userName.innerHTML = "";
    fatherName.innerHTML = "";
    rollNumber.innerHTML = "";
    contactNumber.innerHTML = "";
    cnicNumber.innerHTML = "";
    course.innerHTML = "";
    classTeacher.innerHTML = "";
    picture.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

}


const attendanceCompleted = async () => {
    // let uniqueChars;
    // let collectionRef = collection(db, "attendance")
    // const q = query(collectionRef);
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         let data = doc.data();
    //         let getStudent = localStorage.getItem("saveAttendanceData");
    //         if (getStudent) {
    //             getStudent = JSON.parse(getStudent)
    //             getStudent = allStudent;
    //             uniqueChars = allStudent.filter((c, index) => {
    //                 return allStudent.indexOf(c) === index;
    //             });
    //         }
    //         allStudent.push(data);
    //         localStorage.setItem("saveAttendanceData", JSON.stringify(allStudent));
    //     });
    // });
    // let data = localStorage.getItem("getAllStudent");
    // let getStudent = localStorage.getItem("saveAttendanceData");
    // if(data){
    //     data = JSON.parse(data);
    // }
    // if(getStudent){
    //     getStudent = JSON.parse(getStudent)
    // }
    // let remainingStudent = data.includes(getStudent);
    // console.log(remainingStudent)
    let data = localStorage.getItem("getAllStudent");
    if(data){
        data = JSON.parse(data);
        for(let i = 0; i < data.length; i++){
            console.log(data)
            let collectionRef = collection(db, "attendance")
            completedAttendance.innerHTML = `<div class="loader"></div>`
                let student = await addDoc(collectionRef, {
                    studentName: data[i].student,
                    guardianName: data[i].studentFather,
                    rollNumberStudent: data[i].rollNumberStudent,
                    studentContact: data[i].contact,
                    studentCNIC: data[i].cnic,
                    currentDate: Timestamp.fromDate(new Date()),
                    status: "Absent",
                    class: data[i].studentCourse,
                    studentTeacher: data[i].teacher,
                });
                console.log(student)
                completedAttendance.innerHTML = "Attendance Completed"
        }
    }
    data = [];
    localStorage.setItem("getAllStudent",JSON.stringify(data))
}

completedAttendance.addEventListener("click", attendanceCompleted)
window.attendanceStudent = attendanceStudent;