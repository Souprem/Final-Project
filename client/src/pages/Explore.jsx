import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Explore = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Use a public beta key if no env var
    const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'dc6zaTOxFJmzC';

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=20`);
            setResults(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="form-input" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search GIFs"
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn" style={{ padding: '5px 15px' }} onClick={handleSearch}>Search</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {results.map(gif => (
                    <Link key={gif.id} to={`/details/${gif.id}`} state={{ gif }}>
                        <img
                            src={gif.images.fixed_height.url}
                            alt={gif.title}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Explore;
