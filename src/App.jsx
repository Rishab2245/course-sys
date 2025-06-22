import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseInstanceForm from './components/CourseInstanceForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="bg-card border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Courses Management System</h1>
            <div className="flex space-x-4">
              <Link to="/">
                <Button variant="ghost">Courses</Button>
              </Link>
              <Link to="/courses/new">
                <Button variant="ghost">Add Course</Button>
              </Link>
              <Link to="/instances">
                <Button variant="ghost">Instances</Button>
              </Link>
              <Link to="/instances/new">
                <Button variant="ghost">Add Instance</Button>
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/edit/:courseId" element={<CourseForm />} />
            <Route path="/instances" element={<CourseInstanceList />} />
            <Route path="/instances/new" element={<CourseInstanceForm />} />
            <Route path="/instances/:year/:semester" element={<CourseInstanceList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

