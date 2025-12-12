import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from '../api';
import TweetCard from '../components/TweetCard';

const Explore = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [tweetResults, setTweetResults] = useState([]);
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'your_news_api_key_here';

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const [newsRes, tweetsRes] = await Promise.allSettled([
                axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`),
                api.get(`/tweets/search?q=${query}`)
            ]);

            if (newsRes.status === 'fulfilled') {
                setResults(newsRes.value.data.articles);
            } else {
                console.log("NewsAPI Error:", newsRes.reason);
            }

            if (tweetsRes.status === 'fulfilled') {
                setTweetResults(tweetsRes.value.data);
            } else {
                console.log("Tweet Search Error:", tweetsRes.reason);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="form-input" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search News & Discussion"
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn" style={{ padding: '5px 15px' }} onClick={handleSearch}>Search</button>
            </div>

            {tweetResults.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Community Discussion</h3>
                    {tweetResults.map(tweet => (
                        <TweetCard key={tweet._id} tweet={tweet} setTweets={setTweetResults} />
                    ))}
                </div>
            )}

            <div>
                {(results.length > 0 || tweetResults.length > 0) && <h3 style={{ marginBottom: '15px' }}>News Results</h3>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {results.map((article, index) => (
                        <Link key={index} to={`/details/${encodeURIComponent(article.url)}`} state={{ article }} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ border: '1px solid #333', borderRadius: '10px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {article.urlToImage && (
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.4' }}>{article.title}</h4>
                                    <span style={{ fontSize: '12px', color: 'gray', marginTop: 'auto' }}>{article.source.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {results.length === 0 && tweetResults.length === 0 && query && (
                <p style={{ color: 'gray', textAlign: 'center', marginTop: '20px' }}>No results found.</p>
            )}
        </div>
    );
};

export default Explore;
