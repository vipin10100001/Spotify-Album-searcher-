import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_client_id;
const CLIENT_SECRET = process.env.REACT_APP_client_secret;
function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    // Fetch the access token from the Spotify API
    async function fetchAccessToken() {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();

      setAccessToken(data.access_token);
    }

    fetchAccessToken();
  }, []);

  // Search for artists
  async function searchArtists() {
    // Make sure the access token has been fetched
    if (!accessToken) {
      return;
    }

    const response = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${searchInput}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    // Check for errors
    if (response.status !== 200) {
      throw new Error(`Error searching for artist: ${data.error.message}`);
    }

    setArtists(data.artists.items);
  }

  const handleSearch = async () => {
    await searchArtists();
  };
  
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search for a  Artist'
            type='input'
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={handleSearch}>
            Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mb-2 row-cols-4'>
          {artists.map(artist => (
            <Card key={artist.id}>
              {artist.images.length > 0 && <Card.Img src={artist.images[0].url} alt={artist.name} />}
              <Card.Body>
                <Card.Title>{artist.name}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;