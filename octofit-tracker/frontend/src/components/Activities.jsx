/**
 * Activities Component
 * 
 * Tracks fitness activities and workout logging.
 * 
 * API Endpoints:
 * - GET  https://{CODESPACE_NAME}-8000.app.github.dev/api/activities/
 * - POST https://{CODESPACE_NAME}-8000.app.github.dev/api/activities/
 * - DELETE https://{CODESPACE_NAME}-8000.app.github.dev/api/activities/{id}
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import api from '../api';

const activityTypeColors = {
  running: 'primary',
  cycling: 'info',
  swimming: 'success',
  yoga: 'warning',
  crossfit: 'danger',
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'running',
    duration: '',
    distance: '',
    calories: '',
    description: '',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.activities.getAll();
      setActivities(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch activities');
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
      await api.activities.create({
        ...formData,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        calories: parseInt(formData.calories),
      });
      setFormData({
        type: 'running',
        duration: '',
        distance: '',
        calories: '',
        description: '',
      });
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      setError(err.message || 'Failed to create activity');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await api.activities.delete(id);
        fetchActivities();
      } catch (err) {
        setError(err.message || 'Failed to delete activity');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>🏃 Activities</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Log Activity'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Activity Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option>running</option>
                  <option>cycling</option>
                  <option>swimming</option>
                  <option>yoga</option>
                  <option>crossfit</option>
                </Form.Select>
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
              <Form.Group className="mb-3">
                <Form.Label>Distance (km) - Optional</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Calories Burned</Form.Label>
                <Form.Control
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="success" type="submit">
                Log Activity
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
          {activities.map(activity => (
            <Col key={activity._id} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title>{activity.type}</Card.Title>
                    <Badge bg={activityTypeColors[activity.type] || 'secondary'}>
                      {activity.type}
                    </Badge>
                  </div>
                  <Card.Text>
                    <strong>Duration:</strong> {activity.duration} min<br />
                    {activity.distance && (
                      <><strong>Distance:</strong> {activity.distance} km<br /></>
                    )}
                    <strong>Calories:</strong> {activity.calories} kcal<br />
                    <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}<br />
                    {activity.description && (
                      <><small className="text-muted">{activity.description}</small></>
                    )}
                  </Card.Text>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(activity._id)}
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
