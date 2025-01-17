// Dynamic footer content
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Updated: ${document.lastModified}`;

// Course data
const courses = [
  { name: "CSE 110", type: "cse", completed: true },
  { name: "WDD 130", type: "wdd", completed: false },
  { name: "CSE 111", type: "cse", completed: true },
  { name: "CSE 210", type: "cse", completed: false },
  { name: "WDD 131", type: "wdd", completed: true },
  { name: "WDD 231", type: "wdd", completed: false },
];

// Populate courses dynamically
const courseContainer = document.querySelector('.courses');

function renderCourses(filter = "all") {
  courseContainer.innerHTML = ""; // Clear previous content
  const filteredCourses = filter === "all" 
    ? courses 
    : courses.filter(course => course.type === filter);

  filteredCourses.forEach(course => {
    const courseDiv = document.createElement('div');
    courseDiv.className = `course ${course.completed ? 'completed' : ''}`;
    courseDiv.textContent = course.name;
    courseContainer.appendChild(courseDiv);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => renderCourses(btn.dataset.filter));
});

// Initial render
renderCourses();

// Hamburger menu toggle
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navbar = document.querySelector('.navbar');

hamburgerMenu.addEventListener('click', () => {
  navbar.classList.toggle('expanded');
});
