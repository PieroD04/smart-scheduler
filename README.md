# 🗓️ Smart Scheduler
Smart Scheduler is a web application designed to help users optimize their schedules by managing courses, professors, and time preferences. Built with React, TypeScript, and Vite, this application provides an intuitive interface for adding, managing, and optimizing schedule entries. 🚀

You can access the deployed version of the Smart Scheduler here:
👉 [Smart Scheduler Live Demo](https://smart-scheduler.netlify.app)

---

## ✨ Features
📅 **Schedule Management**: Add, edit, and delete schedule entries with details such as course name, professor, modality (in-person, virtual, hybrid), and session times.

👨‍🏫 **Professor Preferences**: Order professors by preference to prioritize scheduling with preferred instructors.

⏰ **Time Range Selection**: Set preferred time ranges for classes to ensure schedules align with personal availability.

⚙️ **Optimization**: Automatically optimize the schedule to avoid overlaps, prioritize preferred professors, and fit within the preferred time range.

📊 **Visual Schedule**: View the schedule in a grid format with days of the week and hours, making it easy to see class timings at a glance.

---

## 🛠️ Technologies Used
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that improves code quality and readability.
- **Vite**: A fast build tool for modern web development.
- **Material-UI (MUI)**: A popular React UI framework for building responsive and visually appealing components.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **date-fns**: A modern JavaScript date utility library for manipulating dates and times.
- **Dnd-kit**: A lightweight and performant library for drag-and-drop functionality.

---

## 🚀 Getting Started
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-username/pierod04-smart-scheduler.git
```
2. Navigate to the project directory:
```bash
cd pierod04-smart-scheduler
```
3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```
5. Open your browser and visit http://localhost:5173 to view the application.

### Building for Production
To build the application for production, run:
```bash
npm run build
``` 

This will generate a production-ready build in the dist directory.

# Linting
To lint the code, run:

```bash
npm run lint
```

---

## 📂 Project Structure
```
pierod04-smart-scheduler/
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── ProfessorList.tsx
    │   ├── ScheduleForm.tsx
    │   ├── ScheduleTable.tsx
    │   ├── Scheduler.tsx
    │   └── TimeRangeSelector.tsx
    ├── hooks/
    │   ├── useEntries.ts
    │   ├── usePreferences.ts
    │   └── useSelectedEntries.ts
    ├── models/
    │   ├── Preferences.ts
    │   └── ScheduleEntry.ts
    ├── pages/
    │   └── Home.tsx
    ├── styles/
    │   ├── index.css
    │   └── scheduler.css
    └── utils/
        ├── constants.ts
        └── optimizeSchedule.ts
```

---

## 🎯 Usage
1. Add Schedule Entries: Click the "Add Schedule Entry" button to open a form where you can input course details, select a professor, choose a modality, and set session times.

2. Set Preferences: Use the "Preferred Professors" section to order professors by preference. Set your preferred time range for classes in the "Preferred Time Range" section.

3. Optimize Schedule: Click the "Optimize Schedule" button to automatically optimize your schedule based on your preferences.

4. View Schedule: The optimized schedule will be displayed in a grid format, showing the days of the week and hours. You can also view the schedule in a table format for more details.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

Enjoy using the Smart Scheduler! If you have any questions or feedback, feel free to reach out. 😊