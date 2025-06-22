import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { courseAPI, courseInstanceAPI } from '../lib/api';

const CourseInstanceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseId: '',
    year: new Date().getFullYear(),
    semester: 1
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setAvailableCourses(response.data);
    } catch (err) {
      console.error('Error fetching available courses:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'semester' ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await courseInstanceAPI.createCourseInstance(formData);
      navigate('/instances');
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('Failed to create course instance');
      }
      console.error('Error creating instance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course Instance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <Select value={formData.courseId} onValueChange={(value) => handleSelectChange('courseId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.courseId} value={course.courseId}>
                      {course.courseId} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                min="2020"
                max="2030"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={formData.semester.toString()} onValueChange={(value) => handleSelectChange('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading || !formData.courseId}>
                {loading ? 'Creating...' : 'Create Instance'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/instances')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseInstanceForm;

