import { useState } from "react";

export default function PostNotice() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [files, setFiles] = useState(null);

    const categories = [
        "Scholarship",
        "Agriculture",
        "Announcement",
        "Scheme",
        "Health",
        "Training",
        "Employment",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { title, description, category, files };
        console.log("Notice submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-[#1b5aa7] mb-6">Post a Notice</h2>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6"
                >

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-800">Notice Title</label>
                        <input
                            type="text"
                            placeholder="e.g. National Scholarship Program 2082"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b5aa7] focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-800">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b5aa7] focus:border-transparent bg-white"
                        >
                            <option value="">Choose category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-800">Notice Description</label>
                        <textarea
                            placeholder="Describe the notice in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b5aa7] focus:border-transparent resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1b5aa7] text-white font-semibold py-3 rounded-lg hover:bg-[#164a8a] transition-colors cursor-pointer"
                    >
                        Post Notice
                    </button>
                </form>
            </div>
        </div>
    );
}
