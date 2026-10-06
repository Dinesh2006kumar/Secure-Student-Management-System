// ==========================================
// GET JWT TOKEN AND USER
// ==========================================

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {
    window.location.href = "index.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

const studentCount = document.getElementById("studentCount");
const studentTableBody = document.getElementById("studentTableBody");

const addStudentBtn = document.getElementById("addStudentBtn");
const refreshBtn = document.getElementById("refreshBtn");

const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");

const studentForm = document.getElementById("studentForm");
const formMessage = document.getElementById("formMessage");


// ==========================================
// DISPLAY USER NAME
// ==========================================

if (storedUser) {

    const user = JSON.parse(storedUser);

    userName.textContent = user.name;

}


// ==========================================
// LOAD STUDENTS
// ==========================================

async function loadStudents() {

    try {

        const response = await fetch("/api/students", {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }

        });


        // Token expired or invalid
        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

            return;
        }


        const data = await response.json();


        if (!response.ok) {

            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Unable to load students.
                    </td>
                </tr>
            `;

            return;
        }


        const students = data.students || [];


        // Update student count
        studentCount.textContent = students.length;


        // No students
        if (students.length === 0) {

            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }


        // Clear table
        studentTableBody.innerHTML = "";


        // Add students to table
        students.forEach(student => {

            const row = document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.rollNumber}
                </td>

                <td>
                    ${student.email}
                </td>

                <td>
                    ${student.department}
                </td>

                <td>
                    ${student.year}
                </td>

                <td>
                    ${student.phone}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editStudent('${student._id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent('${student._id}')"
                    >
                        Delete
                    </button>

                </td>

            `;


            studentTableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Load students error:", error);

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to connect to server.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// OPEN ADD STUDENT MODAL
// ==========================================

addStudentBtn.addEventListener("click", () => {

    modalTitle.textContent = "Add Student";

    studentForm.reset();

    document.getElementById("studentId").value = "";

    formMessage.textContent = "";

    studentModal.classList.remove("hidden");

});


// ==========================================
// CLOSE MODAL
// ==========================================

closeModal.addEventListener("click", () => {

    studentModal.classList.add("hidden");

});


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

studentModal.addEventListener("click", (event) => {

    if (event.target === studentModal) {

        studentModal.classList.add("hidden");

    }

});


// ==========================================
// ADD / UPDATE STUDENT
// ==========================================

studentForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const studentId =
        document.getElementById("studentId").value;


    const studentData = {

        name:
            document.getElementById("studentName").value,

        rollNumber:
            document.getElementById("rollNumber").value,

        email:
            document.getElementById("studentEmail").value,

        department:
            document.getElementById("department").value,

        year:
            Number(document.getElementById("year").value),

        phone:
            document.getElementById("phone").value

    };


    formMessage.textContent = "Saving...";

    formMessage.style.color = "#2563eb";


    try {

        let url;
        let method;


        // UPDATE
        if (studentId) {

            url = `/api/students/${studentId}`;

            method = "PUT";

        }

        // ADD
        else {

            url = "/api/students";

            method = "POST";

        }


        const response = await fetch(url, {

            method: method,

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify(studentData)

        });


        const data = await response.json();


        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

            return;

        }


        if (!response.ok) {

            formMessage.textContent =
                data.message || "Operation failed";

            formMessage.style.color = "red";

            return;

        }


        formMessage.textContent =
            studentId
                ? "Student updated successfully!"
                : "Student added successfully!";

        formMessage.style.color = "green";


        // Reload table
        await loadStudents();


        // Close modal
        setTimeout(() => {

            studentModal.classList.add("hidden");

        }, 700);


    } catch (error) {

        console.error("Student save error:", error);

        formMessage.textContent =
            "Unable to connect to server.";

        formMessage.style.color = "red";

    }

});


// ==========================================
// EDIT STUDENT
// ==========================================

async function editStudent(id) {

    try {

        const response = await fetch(
            `/api/students/${id}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

            return;

        }


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to get student details."
            );

            return;

        }


        const student = data.student;


        // Change modal title
        modalTitle.textContent = "Edit Student";


        // Fill form
        document.getElementById("studentId").value =
            student._id;

        document.getElementById("studentName").value =
            student.name;

        document.getElementById("rollNumber").value =
            student.rollNumber;

        document.getElementById("studentEmail").value =
            student.email;

        document.getElementById("department").value =
            student.department;

        document.getElementById("year").value =
            student.year;

        document.getElementById("phone").value =
            student.phone;


        formMessage.textContent = "";


        // Open modal
        studentModal.classList.remove("hidden");

    } catch (error) {

        console.error("Edit student error:", error);

        alert("Unable to connect to server.");

    }

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/api/students/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "index.html";

            return;

        }


        const data = await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to delete student."
            );

            return;

        }


        alert("Student deleted successfully!");


        // Refresh table
        loadStudents();

    } catch (error) {

        console.error("Delete student error:", error);

        alert("Unable to connect to server.");

    }

}


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshBtn.addEventListener("click", () => {

    loadStudents();

});


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "index.html";

});


// ==========================================
// INITIAL LOAD
// ==========================================

loadStudents();