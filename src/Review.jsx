import { useState, useEffect } from 'react';
import { apiFetch } from './api';
import {
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Button,
  Divider,
  ScrollShadow,
  Chip,
} from '@nextui-org/react';

export default function Review() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiFetch('/review/my');
      setHistory(data.reverse()); 
    } catch {
      setHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReview('');
    setLoading(true);
    try {
      const data = await apiFetch('/review/submit', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setReview(data.review.trim());
      setCode('');
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-container">
     <Card className="left-pane full-height">
  <CardHeader className="text-xl text-white font-semibold">
    Enter Your Code...
  </CardHeader>
  <Divider />
  <CardBody className="left-body">
    <form onSubmit={handleSubmit} className="left-form">
      <Textarea
        id="code-input"
        placeholder="Paste or write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        variant="bordered"
        className="code-input full-height-textarea"
        fullWidth
      />
      <Button
        color="primary"
        type="submit"
        fullWidth
        isLoading={loading}
        className="submit-button"
      >
        Submit for Review
      </Button>
      {error && <p className="error mt-2">{error}</p>}
    </form>
  </CardBody>
</Card>


      <Card className="right-pane">
        <CardHeader className="text-xl text-white font-semibold">
          Code Review Result
        </CardHeader>
        <Divider />
        <CardBody>
          {review ? (
            <div className="structured-review">
              {splitReview(review).map((section, i) => (
                <div key={i} className="review-section">
                  <h4 className="section-title">{section.title}</h4>
                  <ScrollShadow className="review-scroll" hideScrollBar>
                    <pre className="review-pre">{section.content}</pre>
                  </ScrollShadow>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">
              Submit code to get a structured review.
            </p>
          )}
          <Divider className="my-4" />
          <h3 className="text-lg font-semibold">Previous Reviews</h3>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="text-muted">No previous reviews found.</p>
            ) : (
              history.map((entry, i) => (
                <Card key={i} className="mb-3 bg-[#1c2128]">
                  <CardBody>
                    <ScrollShadow className="review-scroll" hideScrollBar>
                      <pre className="review-pre">{entry.review}</pre>
                    </ScrollShadow>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function splitReview(review) {
  const parts = review.split(/(?=\/\/|\*\*|\n\n|Key improvements|Explanation|```)/g);
  const sections = [];

  parts.forEach((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    sections.push({
      title: `Part ${index + 1}`,
      content: trimmed,
    });
  });

  return sections;
}
