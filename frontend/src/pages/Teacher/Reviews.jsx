import { useState } from 'react';
import { HiStar, HiUser } from 'react-icons/hi';

const Reviews = () => {
    const [reviews, setReviews] = useState([
        { id: 1, student: 'Alice Johnson', feedback: 'Great progress in the final project.', rating: 5, date: '2024-03-24' }
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Reviews</h1>
            <div className="grid gap-6">
                {reviews.map(review => (
                    <div key={review.id} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center">
                                    <HiUser className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{review.student}</h3>
                                    <p className="text-sm text-gray-500">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.feedback}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
