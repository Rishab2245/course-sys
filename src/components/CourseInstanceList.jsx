import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Trash2 } from 'lucide-react';
import { courseInstanceAPI } from '../lib/api';

const CourseInstanceList = () => {
  const { year: paramYear, semester: paramSemester } = useParams();
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(paramYear || new Date().getFullYear().toString());
  const [semester, setSemester] = useState(paramSemester || '1');

  useEffect(() => {
    if (year && semester) {
      fetchInstances();
    }
  }, [year, semester]);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await courseInstanceAPI.getCourseInstancesByYearAndSemester(year, semester);
      setInstances(response.data);
    } catch (err) {
      setError('Failed to fetch course instances');
      console.error('Error fetching instances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstance = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course instance?')) {
      try {
        await courseInstanceAPI.deleteCourseInstance(year, semester, courseId);
        fetchInstances(); // Refresh the list
      } catch (err) {
        alert('Failed to delete course instance');
        console.error('Error deleting instance:', err);
      }
    }
  };

  const handleSearch = () => {
    if (year && semester) {
      fetchInstances();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Course Instances</h2>
        <Link to="/instances/new">
          <Button>Add New Instance</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by Year and Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                min="2020"
                max="2030"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading instances...</div>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-32">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {instances.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No course instances found for {year} semester {semester}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <div className="text-lg font-medium">
                Course Instances for {year} - Semester {semester}
              </div>
              {instances.map((instance) => (
                <Card key={instance.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{instance.courseId}</CardTitle>
                        <CardDescription>
                          Year: {instance.year} | Semester: {instance.semester}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInstance(instance.courseId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseInstanceList;

