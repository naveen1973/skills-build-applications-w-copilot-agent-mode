/**
 * Workouts Component
 * 
 * Creates and manages workout plans.
 * 
 * API Endpoints:
 * - GET  https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts/
 * - POST https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts/
 * - DELETE https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts/{id}
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge, ListGroup } from 'react-bootstrap';
import api from '../api';

const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'beginner',
    exercises: '',
    duration: '',
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.workouts.getAll();
      setWorkouts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const exercises = formData.exercises
        .split(',')
        .map(ex => ex.trim())
        .filter(ex => ex);
      
      await api.workouts.create({
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        exercises: exercises,
        duration: parseInt(formData.duration),
      });
      setFormData({
        name: '',
        description: '',
        difficulty: 'beginner',
        exercises: '',
        duration: '',
      });
      setShowForm(false);
      fetchWorkouts();
    } catch (err) {
      setError(err.message || 'Failed to create workout');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout plan?')) {
      try {
        await api.workouts.delete(id);
        fetchWorkouts();
      } catch (err) {
        setError(err.message || 'Failed to delete workout');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>💪 Workouts</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Workout'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Exercises (comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="exercises"
                  value={formData.exercises}
                  onChange={handleInputChange}
                  placeholder="e.g., Bench Press, Squats, Deadlift"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit">
                Create Workout
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {workouts.map(workout => (
            <Col key={workout._id} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{workout.name}</Card.Title>
                    <Badge bg={difficultyColors[workout.difficulty] || 'secondary'}>
                      {workout.difficulty}
                    </Badge>
                  </div>
                  {workout.description && (
                    <Card.Text className="mb-3">{workout.description}</Card.Text>
                  )}
                  
                  <Card.Subtitle className="mb-2">Exercises</Card.Subtitle>
                  <ListGroup variant="flush" className="mb-3">
                    {workout.exercises && workout.exercises.slice(0, 5).map((exercise, idx) => (
                      <div key={idx} className="small">
                        • {exercise.name} ({exercise.sets}×{exercise.reps})
                      </div>
                    ))}
                    {workout.exercises && workout.exercises.length > 5 && (
                      <div className="small text-muted">
                        • +{workout.exercises.length - 5} more exercises
                      </div>
                    )}
                  </ListGroup>
                  
                  <Card.Text className="small mb-3">
                    <strong>Duration:</strong> {workout.duration} minutes
                  </Card.Text>
                  
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(workout._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
