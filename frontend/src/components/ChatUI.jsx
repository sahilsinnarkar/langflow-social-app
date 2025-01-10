import React, { useState } from 'react';
import axios from 'axios';

const ChatUI = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set loading to true when request is initiated
        setLoading(true);
        setOutput(''); // Clear previous output

        try {
            // Send input to backend with the key 'message' instead of 'input'
            const response = await axios.post('http://localhost:5000/run-flow', { message: input });

            // Check if the response contains the output
            if (response.data.response) {
                setOutput(response.data.response); // Update the output based on backend response
            } else {
                setOutput('No response from the backend');
            }
        } catch (error) {
            console.error('Error communicating with backend:', error);
            setOutput('Error: Unable to process your request.');
        } finally {
            // Set loading to false when response is received or error occurs
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-start pt-6">
            <div className="w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Chat With Langflow</h1>

                <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your input here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </form>

                <div className="w-full p-4 bg-white rounded-lg border border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Output:</h2>

                    {loading ? (
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                            <span className="text-gray-600">Loading...</span>
                        </div>
                    ) : (
                        <p className="text-gray-800">{output || 'No output yet'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatUI;
