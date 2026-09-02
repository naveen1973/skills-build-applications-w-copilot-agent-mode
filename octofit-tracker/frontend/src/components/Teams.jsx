/**
 * Teams Component
 * 
 * Manages team creation and membership.
 * 
 * API Endpoints:
 * - GET  https://{CODESPACE_NAME}-8000.app.github.dev/api/teams/
 * - POST https://{CODESPACE_NAME}-8000.app.github.dev/api/teams/
 * - DELETE https://{CODESPACE_NAME}-8000.app.github.dev/api/teams/{id}
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, ListGroup } from 'react-bootstrap';
import api from '../api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.teams.getAll();
      setTeams(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch teams');
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
      await api.teams.create(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchTeams();
    } catch (err) {
      setError(err.message || 'Failed to create team');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this team?')) {
      try {
        await api.teams.delete(id);
        fetchTeams();
      } catch (err) {
        setError(err.message || 'Failed to delete team');
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>👫 Teams</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create Team'}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Team Name</Form.Label>
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
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="success" type="submit">
                Create Team
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
          {teams.map(team => (
            <Col key={team._id} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{team.name}</Card.Title>
                  {team.description && (
                    <Card.Text className="mb-3">{team.description}</Card.Text>
                  )}
                  
                  {team.members && team.members.length > 0 && (
                    <>
                      <Card.Subtitle className="mb-2">Members</Card.Subtitle>
                      <ListGroup variant="flush" className="mb-3">
                        {team.members.slice(0, 5).map((member, idx) => (
                          <div key={idx} className="small text-muted">
                            • {member.firstName} {member.lastName}
                          </div>
                        ))}
                        {team.members.length > 5 && (
                          <div className="small text-muted">
                            • +{team.members.length - 5} more
                          </div>
                        )}
                      </ListGroup>
                    </>
                  )}
                  
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(team._id)}
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
