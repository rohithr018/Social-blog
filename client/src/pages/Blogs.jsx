import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Blogs() {
    const [sidebarData, setSidebarData] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const categorytags = [
        'Algorithms', 'Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Web Development',
        'Cybersecurity', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering',
        'Cloud Computing', 'Big Data', 'Blockchain', 'Computer Vision', 'Natural Language Processing'
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm') || '';
        const sortFromUrl = urlParams.get('sort') || 'desc';
        const categoryFromUrl = urlParams.get('category') || '';

        setSidebarData({
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setShowMore(data.posts.length === 12);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [location.search]);

    const updateUrlParams = (newData) => {
        const urlParams = new URLSearchParams(newData);
        navigate(`/blogs?${urlParams.toString()}`);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const newSidebarData = { ...sidebarData, [id]: value };
        setSidebarData(newSidebarData);
        updateUrlParams(newSidebarData);
    };

    const handleClearFilters = () => {
        setSidebarData('');
        updateUrlParams('');
    };

    const handleShowMore = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', posts.length);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
            const data = await res.json();
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setShowMore(data.posts.length === 12);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:min-h-screen p-7 border-b md:border-r border-gray-500">
                <h1 className="text-3xl font-semibold p-3 border-b border-gray-500">
                    Filters
                </h1>
                <form className="flex flex-col gap-6 mt-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="searchTerm" className="font-semibold">
                            Search Term:
                        </label>
                        <TextInput
                            id="searchTerm"
                            placeholder="Search..."
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="sort" className="font-semibold">
                            Sort:
                        </label>
                        <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="category" className="font-semibold">
                            Category:
                        </label>
                        <Select
                            id="category"
                            value={sidebarData.category}
                            onChange={handleChange}
                        >
                            <option selected>Choose Tags</option>
                            {categorytags.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Select>
                    </div>
                    <Button gradientDuoTone="purpleToPink" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </form>
            </div>

            {/* Posts Section */}
            <div className="w-full p-7">
                <h1 className="text-3xl font-semibold p-3 border-b border-gray-500">
                    Post Results:
                </h1>
                <div className="flex flex-wrap gap-4 mt-5">
                    {loading && <p className="text-xl text-gray-500">Loading...</p>}
                    {!loading && posts.length === 0 && (
                        <p className="text-xl text-gray-500">No posts found.</p>
                    )}
                    {!loading && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="text-teal-500 text-lg hover:underline w-full mt-4"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
