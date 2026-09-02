import { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import api from '../api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.leaderboard.getGlobal(page, 10);
      setLeaderboard(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>🏆 Leaderboard</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
                <th>Activities</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry._id}>
                  <td>
                    <strong>{getMedalEmoji(entry.rank || index + 1)}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>
                        {entry.user?.firstName} {entry.user?.lastName}
                      </strong>
                      <br />
                      <small className="text-muted">
                        @{entry.user?.username}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="primary">{entry.totalPoints}</Badge>
                  </td>
                  <td>{entry.activitiesCount}</td>
                  <td>{entry.totalCalories}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {leaderboard.length === 0 && (
            <Alert variant="info">
              No leaderboard data available. Log some activities to see rankings!
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}
