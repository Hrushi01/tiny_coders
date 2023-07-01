import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getItinerary } from './apis/getitinerary';
import { getPointsOfInterest } from './apis/getpoints';

export default function Inputtt() {
  const [request, setRequest] = useState({ days: '', city: '' });
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkRedirect();
  }, []);

  function checkRedirect() {
    if (window.location.hostname === 'gpt-travel-advisor.vercel.app') {
      window.location.replace('https://www.roamaround.io/');
    }
  }

  async function hitAPI() {
    try {
      if (!request.city || !request.days) return;
      setMessage('Building itinerary...');
      setLoading(true);
      setItinerary('');

      setTimeout(() => {
        if (!loading) return;
        setMessage('Getting closer ...');
      }, 7000);

      setTimeout(() => {
        if (!loading) return;
        setMessage('Almost there ...');
      }, 15000);

      const { pointsOfInterestPrompt, itinerary } = await getItinerary(
        request.days,
        request.city
      );

      const pointsOfInterest = await getPointsOfInterest(pointsOfInterestPrompt);

      let updatedItinerary = itinerary;

      pointsOfInterest.forEach((point) => {
        const link = `[${point}](https://www.google.com/search?q=${encodeURIComponent(
          point + ' ' + request.city
        )})`;
        updatedItinerary = updatedItinerary.replace(point, link);
      });

      setItinerary(updatedItinerary);
      setLoading(false);
    } catch (err) {
      console.log('error: ', err);
      setMessage('');
    }
  }

  useEffect(() => {
    let days = itinerary.split('Day');
    if (days.length > 1) {
      days.shift();
    } else {
      days[0] = '1' + days[0];
    }
  }, [itinerary]);

  // Convert days string to an array
  const daysArray = request.days.split(',').map((day) => day.trim());

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className="hero-header">
          Roam Around
        </h1>
        <div style={styles.formContainer} className="form-container">
          <input
            style={styles.input}
            placeholder="City"
            onChange={(e) =>
              setRequest((request) => ({ ...request, city: e.target.value }))
            }
          />
          <input
            style={styles.input}
            placeholder="Days"
            onChange={(e) =>
              setRequest((request) => ({ ...request, days: e.target.value }))
            }
          />
          <button className="input-button" onClick={hitAPI}>
            Build Itinerary
          </button>
        </div>
        <div className="results-container">
          {loading && <p>{message}</p>}

    {itinerary}

    {console.log("message,itinerary,daysarray",daysArray)}
          {/* {itinerary &&
            daysArray.map((day, index) => (
              <div style={{ marginBottom: '30px' }} key={index}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props) => (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={props.href}
                      >
                        {props.children}
                      </a>
                    ),
                  }}
                >
                  {itinerary}
                  {`Day ${day}`}
                </ReactMarkdown>
              </div>
            ))} */}
        </div>
      </div>
    </main>
  );
}

const styles = {
  header: {
    textAlign: 'center',
    marginTop: '60px',
    color: '#c683ff',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '68px',
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px',
  },
};
