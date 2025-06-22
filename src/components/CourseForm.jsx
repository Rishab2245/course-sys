import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { X } from 'lucide-react';
import { courseAPI } from '../lib/api';

const CourseForm = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditing = Boolean(courseId);

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    prerequisites: []
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableCourses();
    if (isEditing) {
      fetchCourse();
    }
  }, [courseId, isEditing]);

  const fetchAvailableCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setAvailableCourses(response.data);
    } catch (err) {
      console.error('Error fetching available courses:', err);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourseById(courseId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch course details');
      console.error('Error fetching course:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPrerequisite = (prerequisiteId) => {
    if (prerequisiteId && !formData.prerequisites.includes(prerequisiteId) && prerequisiteId !== formData.courseId) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteId]
      }));
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (prerequisiteId) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(id => id !== prerequisiteId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await courseAPI.updateCourse(courseId, formData);
      } else {
        await courseAPI.createCourse(formData);
      }
      navigate('/');
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError('Failed to save course');
      }
      console.error('Error saving course:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = availableCourses.filter(course => 
    course.courseId.toLowerCase().includes(prerequisiteInput.toLowerCase()) &&
    course.courseId !== formData.courseId &&
    !formData.prerequisites.includes(course.courseId)
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="courseId">Course ID</Label>
              <Input
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                placeholder="e.g., CS 209"
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Computer Programming"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Course description..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Prerequisites</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                    placeholder="Search for prerequisite courses..."
                  />
                  {prerequisiteInput && filteredCourses.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredCourses.map((course) => (
                        <div
                          key={course.courseId}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => addPrerequisite(course.courseId)}
                        >
                          <div className="font-medium">{course.courseId}</div>
                          <div className="text-sm text-muted-foreground">{course.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {formData.prerequisites.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="secondary" className="flex items-center gap-1">
                        {prereq}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removePrerequisite(prereq)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseForm;

